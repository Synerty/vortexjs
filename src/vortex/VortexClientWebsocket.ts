import {Payload} from "./Payload";
import {VortexClientABC} from "./VortexClientABC";
import {NgZone} from "@angular/core";
import {VortexStatusService} from "./VortexStatusService";
import {getFiltStr} from "./UtilMisc";

// https://developer.mozilla.org/en-US/docs/Web/API/WebSocket

declare const WebSocket: any;
declare const MozWebSocket: any;

export class VortexClientWebsocket extends VortexClientABC {

    private static readonly RECONNECT_BACKOFF = 5000; // Seconds

    private Socket = WebSocket || MozWebSocket;
    private socket: WebSocket | null = null;

    private lastReconnectDate: number = Date.parse("01-Jan-2017");

    private unsentBuffer: Payload[] = [];
    private sentBuffer: Payload[] = [];

    constructor(vortexStatusService: VortexStatusService,
                zone: NgZone,
                url: string) {
        super(vortexStatusService, zone, url);

    }

    get isReady(): boolean {
        return this.socket != null && this.socket.readyState === this.Socket.OPEN;
    }

    sendPayloads(payloads: Payload[]): void {
        this.unsentBuffer.add(payloads);

        if (!this.isReady)
            this.createSocket();

        this.sendMessages();
    }

    private sendMessages() {
        while (this.unsentBuffer.length !== 0) {
            if (!this.isReady)
                return;

            let payload = this.unsentBuffer.shift();
            this.socket.send(payload.toVortexMsg());
        }
    }


    private createSocket(): void {
        // If we're already connecting, then do nothing
        if (this.socket && this.socket.readyState === this.Socket.CONNECTING)
            return;

        // If we're open then close
        if (this.socket && this.socket.readyState === this.Socket.OPEN)
            this.socket.close();

        this.socket = null;

        this.vortexStatusService.setOnline(false);

        // If the vortex is shutdown then don't reconnect
        if (this.closed) {
            this.vortexStatusService.logInfo("WebSocket, Vortex is shutdown");
            return;
        }

        // Don't continually reconnect
        let reconnectDiffMs = Date.now() - this.lastReconnectDate;
        if (reconnectDiffMs < VortexClientWebsocket.RECONNECT_BACKOFF) {
            setTimeout(() => this.createSocket(),
                VortexClientWebsocket.RECONNECT_BACKOFF - reconnectDiffMs + 10);
            return;
        }

        this.lastReconnectDate = Date.now();

        // Prepare the args to send
        let args = {
            "vortexUuid": this.uuid,
            "vortexName": this.name
        };

        // Construct + open the socket
        this.vortexStatusService.logInfo(`WebSocket, connecting to ${this.url}`);
        this.socket = new this.Socket(this.url + getFiltStr(args), []);
        this.socket.binaryType = "arraybuffer";
        this.socket.addEventListener('open', event => this.onOpen(event));
        this.socket.addEventListener('message', event => this.onMessage(event));
        this.socket.addEventListener('close', event => this.onClose(event));
        this.socket.addEventListener('error', event => this.onError(event));
    }

    private onMessage(event) {
        if (event.data.length == null) {
            this.vortexStatusService.logError("WebSocket, We've received a websocket binary message," +
                " we expect a unicode");
            return;
        }

        // If the server sends us a '.', that's a heart beat, return it.
        if (event.data === '.') {
            this.beat();
            this.socket != null && this.socket.send('.');
            return;
        }


        let payload = Payload.fromVortexMsg(event.data);
        this.receive(payload);
    }

    private onOpen(event) {
        this.vortexStatusService.setOnline(true);
        this.sendMessages();
    }

    private onClose(event) {
        this.vortexStatusService.logInfo("WebSocket, closed");
        // The base class will reconnect
    }

    private onError(event) {
        this.vortexStatusService.logError(event.error ? event.error : "WebSocket, No error message");
        // onClose will get called as well
    }


}
