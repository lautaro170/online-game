/*export const BACKEND_URL = (window.location.href.indexOf("localhost") === -1)
    ? `${window.location.protocol.replace("http", "ws")}//${window.location.hostname}${(window.location.port && `:${window.location.port}`)}`
    : "ws://localhost:2567"
*/
export const TIME_STEP = 1000 / 60;
export const BACKEND_URL = "ws://192.168.100.9:2567";
export const BACKEND_HTTP_URL = BACKEND_URL.replace("ws", "http");