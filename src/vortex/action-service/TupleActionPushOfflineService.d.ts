import { VortexStatusService } from "../VortexStatusService";
import { TupleActionABC } from "../TupleAction";
import { Tuple } from "../Tuple";
import { TupleActionPushNameService, TupleActionPushService } from "./TupleActionPushService";
import { VortexService } from "../VortexService";
import { TupleActionPushOfflineSingletonService } from "./TupleActionPushOfflineSingletonService";
export declare class TupleActionPushOfflineService extends TupleActionPushService {
    private singleton;
    constructor(tupleActionName: TupleActionPushNameService, vortexService: VortexService, vortexStatus: VortexStatusService, singleton: TupleActionPushOfflineSingletonService);
    pushAction(tupleAction: TupleActionABC): Promise<Tuple[]>;
}
