import { VortexClientABC } from "./VortexClientABC";
import { VortexStatusService } from "./VortexStatusService";
export declare class VortexClientHttp extends VortexClientABC {
    /**
     * RapUI VortexService, This class is responsible for sending and receiving payloads to/from
     * the server.
     */
    private lastConn;
    constructor(vortexStatusService: VortexStatusService, url: string, vortexClientName: string);
    protected shutdown(): void;
    protected sendVortexMsg(vortexMsgs: string[]): void;
}
