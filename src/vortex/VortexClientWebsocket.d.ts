import { VortexClientABC } from "./VortexClientABC";
import { VortexStatusService } from "./VortexStatusService";
import { PayloadEnvelope } from "./PayloadEnvelope";
export declare class VortexClientWebsocket extends VortexClientABC {
    private static readonly RECONNECT_BACKOFF;
    private Socket;
    private socket;
    private lastReconnectDate;
    private unsentBuffer;
    constructor(vortexStatusService: VortexStatusService, url: string);
    readonly isReady: boolean;
    send(payloadEnvelope: PayloadEnvelope | PayloadEnvelope[]): Promise<void>;
    reconnect(): void;
    protected sendVortexMsg(vortexMsgs: string[]): void;
    private sendMessages();
    protected shutdown(): void;
    private createSocket();
    private onMessage(event);
    private onOpen(event);
    private onClose(event);
    private onError(event);
}
