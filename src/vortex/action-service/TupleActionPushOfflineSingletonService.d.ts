import { VortexStatusService } from "../VortexStatusService";
import { TupleActionABC } from "../TupleAction";
import { Payload } from "../Payload";
import { VortexService } from "../VortexService";
import { TupleStorageFactoryService } from "../storage-factory/TupleStorageFactoryService";
export declare class TupleActionPushOfflineSingletonService {
    private vortexService;
    private vortexStatus;
    private storage;
    private sendingTuple;
    private lastSendFailTime;
    private SEND_FAIL_RETRY_TIMEOUT;
    private SERVER_PROCESSING_TIMEOUT;
    private SEND_FAIL_RETRY_BACKOFF;
    constructor(vortexService: VortexService, vortexStatus: VortexStatusService, factoryService: TupleStorageFactoryService);
    queueAction(scope: string, tupleAction: TupleActionABC, payload: Payload): Promise<void>;
    private sendNextAction();
}
