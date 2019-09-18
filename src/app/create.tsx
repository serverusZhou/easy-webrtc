import * as React from "react";
import * as styles from "./index.scss";
import { createWebSocket } from './utils/commonUtils'

import * as hangup from '../../assets/images/hangup.png';

const nativeRTCIceCandidate = (window.RTCIceCandidate);

interface createConfigInte {
    wsServer: string
}

const iceServer = {
    "iceServers": [{
        "urls": "stun:stun.l.google.com:19302",
    }]
};

const create = (createConfig: createConfigInte) => {
    return (WrappedComponent: any) => {
        return class extends React.Component {

            private selfVideoRef = React.createRef<HTMLVideoElement>()

            private videoRef = React.createRef<HTMLVideoElement>()

            private mediaStreamTrack: any

            private socket: any

            private pc: any

            public state: {socketId: string, allSockets: Array<any>, calling: boolean} = {
                socketId: '',
                allSockets: [],
                calling: false,
            }

            private makeCall = async (to: string) => {
                // 不是https或者localhost，getUserMedia是undefined
                const getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
                this.pc = (new RTCPeerConnection(iceServer));

                this.pc.addEventListener('icecandidate', (evt: any) => {
                    this.socket.send(JSON.stringify({
                        eventName: "__ice_candidate",
                        data: {
                            "label": evt.candidate.sdpMLineIndex,
                            "candidate": evt.candidate,
                            "toSocketId": to
                        }
                    }))
                });

                getUserMedia.call(navigator, {
                    video: true,
                    audio: true
                }, (localMediaStream: any) => {
                    this.pc.addStream(localMediaStream);
                    this.pc.onaddstream = (stream: any) => {
                        console.log('streamstreamstreamstreamstream=========', stream)
                    }

                    this.pc.onicecandidate = function(evt: any) {
                        console.log('onicecandidateonicecandidate', evt)
                    };
                    this.pc.createOffer((offer: any) => {
                        this.pc.setLocalDescription(new RTCSessionDescription(offer), () => {
                          this.socket.send(JSON.stringify({
                            "eventName": "__offer",
                            "data": {
                                "sdp": offer,
                                "socketId": this.state.socketId,
                                "toSocketId": to
                            }
                        }));
                        }, (e: any) => {console.error(e)});
                      }, (e: any) => {console.error(e)});

                    const video: HTMLVideoElement = this.selfVideoRef.current;
                    try {
                        video.autoplay = true;
                        video.src = window.URL.createObjectURL(localMediaStream);
                    } catch (error) {
                        video.autoplay = true;
                        video.srcObject = localMediaStream;
                    }
                    this.mediaStreamTrack = localMediaStream;
                    this.setState({ calling: true })
                }, function(e: Event) {
                    console.log('Reeeejected!', e);
                });
            }

            private answerCall = (offer: any, callSocketId: string) => {
                this.pc = (new RTCPeerConnection(iceServer));
                this.pc.addEventListener('addstream', (e: any) => {
                    const video: HTMLVideoElement = this.videoRef.current;
                    console.log('videovideovideovideovideo', video)
                    try {
                        video.autoplay = true;
                        video.src = window.URL.createObjectURL(e.stream);
                    } catch (error) {
                        video.autoplay = true;
                        video.srcObject = e.stream;
                    }
                    this.setState({ calling: true })
                });
                this.pc.setRemoteDescription(new RTCSessionDescription(offer), () => {
                    this.pc.createAnswer((answer: any) => {
                        this.pc.setLocalDescription(new RTCSessionDescription(answer), (stream: any) => {
                            this.socket.send(JSON.stringify({
                                "eventName": "__answer",
                                "data": {
                                    "callSocketId": callSocketId,
                                    "sdp": answer,
                                    "toSocketId": this.state.socketId
                                }
                            }))
                        }, () => {})
                  }, () => {})
                }, () => {})
            }

            private dealCall = (offer: any) => {
                this.pc.setRemoteDescription(new RTCSessionDescription(offer), (stream: any) => {
                    console.log('streamstreamstream', stream)
                }, () => {});
            }

            private closeCall = () => {
                this.setState({
                    calling: false
                }, () => {
                    if (this.mediaStreamTrack) {
                        const allTracks: Array<{ stop: () => {}}> = this.mediaStreamTrack.getTracks();
                        allTracks.forEach(item => {
                            item.stop()
                        });
                    }
                })
            }

            private handleMsg = (msgObject: { type: string, data: any}) => {
                if (msgObject.type === 'connection') {
                    this.setState({ socketId: msgObject.data.socketId })
                }
                if (msgObject.type === 'all_sockets') {
                    this.setState({ allSockets: msgObject.data.sockets })
                }
                if (msgObject.type === 'offer') {
                    this.answerCall(msgObject.data.sdp, msgObject.data.callSocketId)
                }
                if (msgObject.type === 'answer') {
                    this.dealCall(msgObject.data.sdp)
                }
                if (msgObject.type === 'ice_candidate') {
                    const candidate = new nativeRTCIceCandidate({ candidate: msgObject.data.candidate.candidate, sdpMid: '0', sdpMLineIndex: 0 } );
                    this.pc.addIceCandidate(candidate);
                }
            }

            componentDidMount() {
                this.socket = createWebSocket(createConfig.wsServer);
                this.socket.onmessage = (message: { data: string }) => {
                    this.handleMsg(JSON.parse(message.data))
                };
            }

            componentWillUnmount() {
                if (this.socket) {
                    this.socket.close()
                }
            }

            public render(): JSX.Element {
                const { socketId, allSockets, calling } = this.state;
                return (
                    <>
                    <WrappedComponent
                        simpleRtc={{
                            makeCall: this.makeCall,
                            socketId,
                            allSockets
                        }}
                        {...this.props}
                    />
                    <div className={styles.callPage} style={{ display: calling ? 'block' : 'none' }}>
                        <div className={styles.selfVideoWarp}>
                            <video ref={this.selfVideoRef} width={120} />
                        </div>
                        <video  ref={this.videoRef} />
                        <div className={styles.callClose} onClick={this.closeCall}>
                            <img src={hangup} alt="hangup" />
                        </div>
                    </div>
                    </>
                );
            }
        };
    };
};

export default create;
