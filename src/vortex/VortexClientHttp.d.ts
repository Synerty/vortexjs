import { Payload } from "./Payload";
import { VortexClientABC } from "./VortexClientABC";
import { NgZone } from "@angular/core";
import { VortexStatusService } from "./VortexStatusService";
export declare class VortexClientHttp extends VortexClientABC {
    /**
     * RapUI VortexService, This class is responsible for sending and receiving payloads to/from
     * the server.
     */
    constructor(vortexStatusService: VortexStatusService, zone: NgZone, url: string);
    sendPayloads(payloads: Payload[]): void;
}
