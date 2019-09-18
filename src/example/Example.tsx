import * as React from "react";
import SimpleRtc from "../index";

import * as styles from "./index.scss";

interface IAppProps { simpleRtc: any}

const userLists: Array<{imgSrc: string, title: string, subTitle: string }> = [
    {
        imgSrc: 'https://ss0.bdstatic.com/94oJfD_bAAcT8t7mm9GUKT-xh_/timg?image&quality=100&size=b4000_4000&sec=1568604059&di=576d58922fa0d36532a435c5ac34b5ad&src=http://pic2.zhimg.com/50/v2-f34145b01ab1d5bb463cac35ddc9777d_hd.jpg',
        title: '哪吒-萌萌哒',
        subTitle: '萌归萌，丑还是一样的丑！'
    },
    {
        imgSrc: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1568621474022&di=7c4d7420dbabe3b579762b2b74644ab7&imgtype=0&src=http%3A%2F%2Fpic4.zhimg.com%2F50%2Fv2-46c2eb18d011d3711617a2664844e5fd_hd.jpg',
        title: '哪吒-我的命由我定',
        subTitle: '厉害，厉害，把作死说的那么清新脱俗！'
    },
    {
        imgSrc: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1568621540112&di=dfe231efadcc413eb5c2a7033264bbec&imgtype=0&src=http%3A%2F%2F5b0988e595225.cdn.sohucs.com%2Fq_70%2Cc_zoom%2Cw_640%2Fimages%2F20190207%2Fc936c6a4d4104dd0ae77aea7ff9c3085.jpeg',
        title: '猪八戒-清纯起来不是猪',
        subTitle: '那是什么？驴吗？'
    },
    {
        imgSrc: 'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=3573715313,3624250277&fm=26&gp=0.jpg',
        title: '猪八戒-我是那么的丰满',
        subTitle: '丰满仅仅是性感吗？还有钱！！！'
    }
]

class Example extends React.Component<IAppProps> {
    public renderListItem(user: {imgSrc: string, title: string, subTitle: string, click: (socketId: string) => {}, key: string, isMe: boolean }): JSX.Element {
        return (
            <li key={user.key} onClick={user.isMe ? () => {} : () => user.click(user.key)} style={{ backgroundColor: user.isMe ? '#f0f0f0' : '#fff' }}>
                <div className={styles.imgWarp}>
                    <div>
                        <img src={user.imgSrc} alt="head"/>
                    </div>
                </div>
                <div className={styles.titleWarp}>
                    <p className={styles.itemTitle}>{user.title}</p>
                    <p className={styles.subItemTitle}>{user.subTitle}</p>
                </div>
            </li>
        )
    }
    public render(): JSX.Element {
        const { simpleRtc } = this.props;
        const { makeCall, allSockets, socketId } = simpleRtc;
        return (
            <>
                <div className={styles.content}>
                    <ul>
                        {
                            allSockets.map((id: string, i: number) => this.renderListItem({ ...userLists[i], click: makeCall, key: id, isMe: socketId === id }))
                        }
                    </ul>
                    <div></div>
                </div>
            </>
        );
    }
}

export default SimpleRtc.create({ wsServer: 'ws://localhost:9000' })(Example);