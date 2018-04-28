import {Payload} from "./Payload";
import {dateStr} from "./UtilMisc";
import {rapuiClientEcho} from "./PayloadFilterKeys";
import {payloadIO} from "./PayloadIO";
import {NgZone} from "@angular/core";
import {VortexStatusService} from "./VortexStatusService";
import {PayloadEnvelope} from "./PayloadEnvelope";


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
                url: string) {
        this._uuid = VortexClientABC.makeUuid();
        this._name = "browser";
        this._url = url;
        this._vortexClosed = false;
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

    send(payloadEnvelope: PayloadEnvelope | PayloadEnvelope[]): Promise<void> {
        if (this.closed) {
            let msg = dateStr() + "VortexService is closed, Probably due to a login page reload";
            console.log(msg);
            throw new Error("An attempt was made to reconnect a closed vortex");
        }

        let payloadEnvelopes: PayloadEnvelope[] = [];
        if (payloadEnvelope instanceof Array)
            payloadEnvelopes = payloadEnvelope;
        else
            payloadEnvelopes = [payloadEnvelope];

        for (let p of payloadEnvelopes) {
            // Empty payloadEnvelopes are like heart beats, don't check them
            if (!p.isEmpty() && p.filt["key"] == null) {
                throw new Error("There is no 'key' in the payloadEnvelopes filt"
                    + ", There must be one for routing");
            }
        }

        let vortexMsgs: string[] = [];
        let promisies = [];

        for (let payloadEnvelope of payloadEnvelopes) {
            promisies.push(
                payloadEnvelope.toVortexMsg()
                    .then((vortexMsg) => vortexMsgs.push(vortexMsg))
            );
        }

        return Promise.all(promisies)
            .then(() => this.sendVortexMsg(vortexMsgs))
            .catch(e => {
                let msg = `ERROR VortexClientABC: ${e.toString()}`;
                console.log(msg);
                throw new Error(msg);
            });
    }

    protected abstract sendVortexMsg(vortexMsgs: string[]): void;

    protected abstract shutdown(): void;

    reconnect(): void {
        if (this.closed)
            throw new Error("An attempt was made to reconnect a closed vortex");

        this.restartTimer();
        this.send(new PayloadEnvelope());
    }


    protected beat(): void {
        // We may still get a beat before the connection closes
        if (this.closed)
            return;

        this.vortexStatusService.setOnline(true);
        this.restartTimer();
    }

    protected restartTimer() {
        this.clearBeatTimer();

        this.beatTimer = setInterval(() => {
            if (this.closed)
                return;

            this.dead();
            this.reconnect();
        }, 15000);
    }

    private clearBeatTimer() {
        if (this.beatTimer != null) {
            clearInterval(this.beatTimer);
            this.beatTimer = null;
        }
    }

    private dead(): void {
        this.vortexStatusService.setOnline(false);
        this.vortexStatusService.logInfo(
            `VortexService server heartbeats have timed out : ${this._url}`
        );
    }

    /**
     * Receive
     * This should only be called only from VortexConnection
     * @param payloadEnvelope {Payload}
     */
    protected receive(payloadEnvelope: PayloadEnvelope): void {
        this.beat();
        if (payloadEnvelope.filt.hasOwnProperty(rapuiClientEcho)) {
            delete payloadEnvelope[rapuiClientEcho];
            this.send(payloadEnvelope);
        }

        if (payloadEnvelope.isEmpty()) {
            if (payloadEnvelope.filt[PayloadEnvelope.vortexUuidKey] != null)
                this.serverVortexUuid = payloadEnvelope.filt[PayloadEnvelope.vortexUuidKey];

            if (payloadEnvelope.filt[PayloadEnvelope.vortexNameKey] != null)
                this.serverVortexName = payloadEnvelope.filt[PayloadEnvelope.vortexNameKey];

            return;
        }

        // console.log(dateStr() + "Received payloadEnvelope with filt : " + JSON.stringify(payloadEnvelope.filt));

        // TODO, Tell the payloadIO the vortexUuid
        payloadIO.process(payloadEnvelope);
    }


}
