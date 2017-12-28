import { VortexStatusService } from "./VortexStatusService";
import { TupleActionABC } from "./TupleAction";
import { Tuple } from "./Tuple";
import { VortexService } from "./VortexService";
import { Payload } from "./Payload";
export declare class TupleActionPushNameService {
    name: string;
    additionalFilt: {};
    constructor(name: string, additionalFilt?: {});
}
export declare class TupleActionPushService {
    protected tupleActionProcessorName: TupleActionPushNameService;
    protected vortexService: VortexService;
    protected vortexStatus: VortexStatusService;
    constructor(tupleActionProcessorName: TupleActionPushNameService, vortexService: VortexService, vortexStatus: VortexStatusService);
    /** Push Action
     *
     * This pushes the action, either locally or to the server, depending on the
     * implementation.
     *
     * If pushed locally, the promise will resolve when the action has been saved.
     * If pushed directly to the server, the promise will resolve when the server has
     * responded.
     */
    pushAction(tupleAction: TupleActionABC): Promise<Tuple[]>;
    /** Make Payload
     *
     * This make the payload that we send to the server.
     *
     */
    protected makePayload(tupleAction: TupleActionABC): Payload;
}
