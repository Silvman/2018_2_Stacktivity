import Emitter from "./Emitter.js";

export default class WebSocks {
    /** Create the websockets module */
    constructor(name) {
        this._name = name;
        this._connected = false;
        Emitter.on(`${name}-send`, this.send.bind(this), false);
        Emitter.on(`${name}-close`, this.close.bind(this), false);
    }

    get isConnected() {
        return this._connected;
    }

    send(data) {
        if (this._connected) {
            this._ws.send(JSON.stringify(data));
        }
    }

    connect(path) {
        if (!this._connected) {
            this._ws = new WebSocket(path);

            this._ws.addEventListener("open", this._onopen.bind(this));
            this._ws.addEventListener("message", this._onmessage.bind(this));
            this._ws.addEventListener("error", this._onerror.bind(this));
            this._ws.addEventListener("close", this._onclose.bind(this));
        }
    }

    close() {
        if (this._connected) {
            this._ws.close();
            this._connected = false;

        }
}

    _onmessage(event) {
        const message = JSON.parse(event.data);
        Emitter.emit(`${this._name}-message`, message);
    }

    _onerror(error) {
        Emitter.emit("error", `ws error ${error.message}`);
    }

    _onopen() {
        this._connected = true;
    }

    _onclose(event) {
        this._connected = false;
    }
}