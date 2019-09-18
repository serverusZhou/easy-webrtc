const Koa = require('koa2');
const WebSocket = require("koa-websocket");
const UUID = require('node-uuid');

/* 实例化 WebSocket, 实例化储存所有上线文数组 并分配监听的端口 */
const app = WebSocket(new Koa());
const ctxs = [];
app.listen(9000);

app.ws.use((ctx, next) => {
    /* 每打开一个连接就往 上线文数组中 添加一个上下文 */
    ctx.id = UUID.v4();
    ctxs.push(ctx);
    ctx.websocket.on("message", (message) => {
        const json = JSON.parse(message);
        if (json.eventName === '__offer') {
            const toCtx = ctxs.find(item => item.id === json.data.toSocketId);
            if (toCtx) {
                toCtx.websocket.send(JSON.stringify({ type: 'offer', data: { sdp: json.data.sdp, callSocketId: json.data.socketId  }}))
            }
        }
        if (json.eventName === '__answer') {
            const callCtx = ctxs.find(item => item.id === json.data.callSocketId);
            if (callCtx) {
                callCtx.websocket.send(JSON.stringify({ type: 'answer', data: { sdp: json.data.sdp, callSocketId: json.data.callSocketId, toSocketId: json.data.toSocketId  }}))
            }
        }
        if (json.eventName === '__ice_candidate') {
            const toCtx = ctxs.find(item => item.id === json.data.toSocketId);
            if (toCtx) {
                toCtx.websocket.send(JSON.stringify({ type: 'ice_candidate', data: {
                    "sockketId": json.data.toSocketId,
                    "label": json.data.label,
                    "candidate": json.data.candidate,
                }}))
            }
        }
    });
    // 将唯一标识返回至前端
    ctx.websocket.send(JSON.stringify({ type: 'connection', data: { socketId: ctx.id } }));
    for(let i = 0; i < ctxs.length; i++) {
        ctxs[i].websocket.send(JSON.stringify({ type: 'all_sockets', data: { sockets: ctxs.reduce((ev, ctx) => { ev.push(ctx.id); return ev },[]) } }));
    }
    ctx.websocket.on("close", (message) => {
        /* 连接关闭时, 清理 上下文数组, 防止报错 */
        let index = ctxs.indexOf(ctx);
        ctxs.splice(index, 1);
        for(let i = 0; i < ctxs.length; i++) {
            ctxs[i].websocket.send(JSON.stringify({ type: 'all_sockets', data: { sockets: ctxs.reduce((ev, ctx) => { ev.push(ctx.id); return ev },[]) } }));
        }
    });
});