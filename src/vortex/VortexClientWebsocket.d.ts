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
    private sentBuffer;
    constructor(vortexStatusService: VortexStatusService, zone: NgZone, url: string);
    readonly isReady: boolean;
    sendPayloads(payloads: Payload[]): void;
    private sendMessages();
    private createSocket();
    private onMessage(event);
    private onOpen(event);
    private onClose(event);
    private onError(event);
}
