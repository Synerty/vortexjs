import { Payload } from "./Payload";
import { VortexClientABC } from "./VortexClientABC";
import { NgZone } from "@angular/core";
import { VortexStatusService } from "./VortexStatusService";
export declare class VortexClientWebsocket extends VortexClientABC {
    private static readonly RECONNECT_BACKOFF;
    private Socket;
    private socket;
    private lastReconnectDate;
    private unsentBuffer;
    constructor(vortexStatusService: VortexStatusService, zone: NgZone, url: string);
    readonly isReady: boolean;
    send(payload: Payload | Payload[]): void;
    protected sendVortexMsg(vortexMsgs: string[]): void;
    private sendMessages();
    protected shutdown(): void;
    private createSocket();
    private onMessage(event);
    private onOpen(event);
    private onClose(event);
    private onError(event);
}
