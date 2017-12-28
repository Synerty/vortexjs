import { Payload } from "./Payload";
import { NgZone } from "@angular/core";
import { VortexStatusService } from "./VortexStatusService";
/**
 * Server response timeout in milliseconds
 * @type {number}
 */
export declare let SERVER_RESPONSE_TIMEOUT: number;
export declare abstract class VortexClientABC {
    protected vortexStatusService: VortexStatusService;
    private zone;
    private beatTimer;
    private _uuid;
    private _name;
    private _url;
    private _vortexClosed;
    private serverVortexUuid;
    private serverVortexName;
    /**
     * RapUI VortexService, This class is responsible for sending and receiving payloads to/from
     * the server.
     */
    constructor(vortexStatusService: VortexStatusService, zone: NgZone, url: string);
    static makeUuid(): string;
    readonly url: string;
    readonly uuid: string;
    readonly name: string;
    closed: boolean;
    send(payload: Payload | Payload[]): void;
    protected abstract sendVortexMsg(vortexMsgs: string[]): void;
    protected abstract shutdown(): void;
    reconnect(): void;
    protected beat(): void;
    protected restartTimer(): void;
    private clearBeatTimer();
    private dead();
    /**
     * Receive
     * This should only be called only from VortexConnection
     * @param payload {Payload}
     */
    protected receive(payload: Payload): void;
}
