import { VortexStatusService } from "./VortexStatusService";
import { TupleActionABC } from "./TupleAction";
import { Tuple } from "./Tuple";
import { WebSqlFactoryService } from "../websql/WebSqlService";
import { TupleActionPushNameService, TupleActionPushService } from "./TupleActionPushService";
import { VortexService } from "./VortexService";
export declare class TupleActionPushOfflineService extends TupleActionPushService {
    private readonly tableName;
    private webSql;
    private storageName;
    private sendingTuple;
    private lastSendFailTime;
    private SEND_FAIL_RETRY_TIMEOUT;
    private SERVER_PROCESSING_TIMEOUT;
    private SEND_FAIL_RETRY_BACKOFF;
    constructor(tupleActionName: TupleActionPushNameService, vortexService: VortexService, vortexStatus: VortexStatusService, webSqlFactory: WebSqlFactoryService);
    pushAction(tupleAction: TupleActionABC): Promise<Tuple[]>;
    private sendNextAction();
    private storeAction(tupleAction);
    private loadNextAction();
    private countActions();
    private deleteAction(actionUuid);
}
