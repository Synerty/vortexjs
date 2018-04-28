import { VortexStatusService } from "./VortexStatusService";
import { PayloadEnvelope } from "./PayloadEnvelope";
/**
 * Server response timeout in milliseconds
 * @type {number}
 */
export declare let SERVER_RESPONSE_TIMEOUT: number;
export declare abstract class VortexClientABC {
    protected vortexStatusService: VortexStatusService;
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
    constructor(vortexStatusService: VortexStatusService, url: string);
    static makeUuid(): string;
    readonly url: string;
    readonly uuid: string;
    readonly name: string;
    closed: boolean;
    send(payloadEnvelope: PayloadEnvelope | PayloadEnvelope[]): Promise<void>;
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
     * @param payloadEnvelope {Payload}
     */
    protected receive(payloadEnvelope: PayloadEnvelope): void;
}
