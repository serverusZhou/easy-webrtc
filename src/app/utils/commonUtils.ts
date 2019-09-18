export const createWebSocket = (function () {
    return function (urlValue: string) {
        if(window.WebSocket) return new WebSocket(urlValue);
        return false;
    }
})();