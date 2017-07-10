import {Payload} from "./Payload";
import {dateStr} from "./UtilMisc";
import {rapuiClientEcho} from "./PayloadFilterKeys";
import {payloadIO} from "./PayloadIO";
import {NgZone} from "@angular/core";
import {VortexStatusService} from "./VortexStatusService";


/**
 * Server response timeout in milliseconds
 * @type {number}
 */
export let SERVER_RESPONSE_TIMEOUT = 20000;

export abstract class VortexClientABC {

    private beatTimer: any | null = null;
    private _uuid: string;
    private _name: string;
    private _url: string;
    private _vortexClosed: boolean;

    private serverVortexUuid: string | null = null;
    private serverVortexName: string | null = null;

    /**
     * RapUI VortexService, This class is responsible for sending and receiving payloads to/from
     * the server.
     */
    constructor(protected vortexStatusService: VortexStatusService,
                private zone: NgZone,
                url: string) {
        this._uuid = VortexClientABC.makeUuid();
        this._name = "browser";
        this._url = url;
        this._vortexClosed = false;

        console.log(`Creating new vortex to ${this._url}`);
    }

    static makeUuid() {
        function func(c) {
            let r = Math.random() * 16 | 0, v = c === "x" ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        }

        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, func);
    }

    get url(): string {
        return this._url;
    }

    get uuid(): string {
        return this._uuid;
    }

    get name(): string {
        return this._name;
    }

    get closed(): boolean {
        return this._vortexClosed;
    }

    set closed(value: boolean) {
        this._vortexClosed = value;
        if (value) {
            this.clearBeatTimer();
            this.shutdown();
        }
    }

    send(payload: Payload | Payload[]): void {
        let self = this;
        if (self.closed) {
            console.log(dateStr() + "VortexService is closed, Probably due to a login page reload");
            return;
        }

        let payloads: Payload[] = [];
        if (payload instanceof Array)
            payloads = payload;
        else
            payloads = [payload];

        for (let p of payloads) {
            // Empty payloads are like heart beats, don't check them
            if (!p.isEmpty() && p.filt["key"] == null) {
                throw new Error("There is no 'key' in the payload filt"
                    + ", There must be one for routing");
            }
        }

        this.sendPayloads(payloads);
    }

    protected abstract  sendPayloads(payloads: Payload[]): void;

    protected abstract shutdown(): void;

    reconnect(): void {
        if (this.closed)
            throw new Error("An attempt was made to reconnect a closed vortex");

        this.restartTimer();
        this.send(new Payload());
    }


    protected beat(): void {
        // We may still get a beat before the connection closes
        if (this.closed)
            return;

        this.vortexStatusService.setOnline(true);
        this.restartTimer();
    }

    private restartTimer() {
        this.clearBeatTimer();

        this.beatTimer = setInterval(() => {
            if (this.closed)
                return;

            this.dead();
            this.reconnect();
        }, 15000);
    }

    private clearBeatTimer(){
        if (this.beatTimer != null) {
            clearInterval(this.beatTimer);
            this.beatTimer = null;
        }
    }

    private dead(): void {
        this.vortexStatusService.setOnline(false);
        this.vortexStatusService.logInfo(
            "VortexService server heartbeats have timed out");
    }

    /**
     * Receive
     * This should only be called only from VortexConnection
     * @param payload {Payload}
     */
    protected receive(payload: Payload): void {
        this.beat();
        if (payload.filt.hasOwnProperty(rapuiClientEcho)) {
            delete payload[rapuiClientEcho];
            this.send(payload);
        }

        if (payload.isEmpty()) {
            if (payload.filt[Payload.vortexUuidKey] != null)
                this.serverVortexUuid = payload.filt[Payload.vortexUuidKey];

            if (payload.filt[Payload.vortexNameKey] != null)
                this.serverVortexName = payload.filt[Payload.vortexNameKey];

            return;
        }

        // console.log(dateStr() + "Received payload with filt : " + JSON.stringify(payload.filt));

        // TODO, Tell the payloadIO the vortexUuid
        this.zone.run(() => {
            payloadIO.process(payload);
        });
    }


}
