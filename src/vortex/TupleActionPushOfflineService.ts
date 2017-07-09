import {Injectable} from "@angular/core";
import {VortexStatusService} from "./VortexStatusService";
import {TupleActionABC} from "./TupleAction";
import {Tuple} from "./Tuple";
import {WebSqlFactoryService, WebSqlService} from "../websql/WebSqlService";
import {TupleActionPushNameService, TupleActionPushService} from "./TupleActionPushService";
import {Payload} from "./Payload";
import {VortexService} from "./VortexService";
import {assert} from "./UtilMisc";
import {PayloadResponse} from "./PayloadResponse";

let datbaseName = "tupleActions.sqlite";

const tableName = "tupleActions";
let databaseSchema = [
    `CREATE TABLE IF NOT EXISTS ${tableName}
     (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        scope TEXT,
        uuid REAL,
        payload TEXT,
        UNIQUE (scope, uuid)
     )`];


@Injectable()
export class TupleActionPushOfflineService extends TupleActionPushService {
    private readonly tableName = "tupleActions";
    private webSql: WebSqlService;
    private storageName: string;
    private sendingTuple = false;
    private lastSendFailTime:null | number = null;

    private SEND_FAIL_RETRY_TIMEOUT = 5000;// milliseconds
    private SERVER_PROCESSING_TIMEOUT = 5000;// milliseconds
    private SEND_FAIL_RETRY_BACKOFF = 5000; // milliseconds

    constructor(tupleActionName: TupleActionPushNameService,
                vortexService: VortexService,
                vortexStatus: VortexStatusService,
                webSqlFactory: WebSqlFactoryService) {
        super(tupleActionName, vortexService, vortexStatus);

        this.webSql = webSqlFactory.createWebSql(datbaseName, databaseSchema);
        this.storageName = tupleActionName.name;


        // TODO: Unsubscribe this
        this.vortexStatus.isOnline
            .filter(online => online === true)
            .subscribe(online => this.sendNextAction());

        this.countActions()
            .then(() => this.sendNextAction());
    }


    pushAction(tupleAction: TupleActionABC): Promise<Tuple[]> {
        let p = this.storeAction(tupleAction);
        this.sendNextAction();
        return p;
    }

    private sendNextAction() {
        if (this.sendingTuple)
            return;

        if (!this.vortexStatus.snapshot.isOnline)
            return;

            // Don't continually retry, if we have a last send fail, ensure we wait
            // {SEND_FAIL_RETRY_BACKOFF} before sending again.
        if (this.lastSendFailTime != null) {
            let reconnectDiffMs = Date.now() - this.lastSendFailTime;

            if (reconnectDiffMs < this.SEND_FAIL_RETRY_BACKOFF) {
                // +10ms to ensure we're just out of the backoff time.
                setTimeout(() => this.sendNextAction(),
                    this.SEND_FAIL_RETRY_BACKOFF - reconnectDiffMs + 10);
                return;

            } else {
                this.lastSendFailTime = null;

            }
        }

        this.sendingTuple = true;

        // Get the next tuple from the persistent queue
        this.loadNextAction()

        // If this was successful?
            .then(tupleAction => {
                // Is the end the end of the queue?
                if (tupleAction == null) {
                    this.sendingTuple = false;
                    return;
                }

                let actionUuid = tupleAction.uuid;

                return new PayloadResponse(this.vortexService,
                    this.makePayload(tupleAction),
                    PayloadResponse.RESPONSE_TIMEOUT_SECONDS, // Timeout
                    false // don't check result, only reject if it times out
                ) .then(payload => {
                    // If we received a payload, but it has an error message
                    // Log an error, it's out of our hands, move on.
                    let r = payload.result; // success is null or true
                    if (!(r == null || r === true)) {
                        this.vortexStatus.logError(
                            'Server failed to process Action: ' + payload.result.toString());
                    }

                    this.deleteAction(actionUuid);
                    this.sendingTuple = false;
                    this.sendNextAction();
                })

            })

            // Or catch and handle any of the errors from either loading or sending
            .catch(err => {
                this.lastSendFailTime = Date.now();

                let errStr = JSON.stringify(err);
                this.vortexStatus.logError(`Failed to send TupleAction : ${errStr}`);
                this.sendingTuple = false;
                setTimeout(() => this.sendNextAction(), this.SEND_FAIL_RETRY_TIMEOUT);
                return null; // Handle the error
            });
    }

    private storeAction(tupleAction: TupleActionABC): Promise < Tuple[] > {
        // The payload is a convenient way to serialise and compress the data
        let payloadData = new Payload({}, [tupleAction]).toVortexMsg();

        let sql = `INSERT INTO ${tableName}
                    (scope, uuid, payload)
                    VALUES (?, ?, ?)`;
        let bindParams = [this.storageName, tupleAction.uuid, payloadData];

        return this.webSql.runSql(sql, bindParams)
            .then((val) => {
                this.vortexStatus.incrementQueuedActionCount();
                return val;
            })
            .then(() => [tupleAction]); //
    }

    private loadNextAction(): Promise<TupleActionABC | null> {
        let sql = `SELECT payload
                    FROM ${tableName}
                    WHERE scope = ?
                    ORDER BY id
                    LIMIT 1`;
        let bindParams = [this.storageName];

        return this.webSql.querySql(sql, bindParams)
            .then((rows: any[]) => {
                if (rows.length === 0) {
                    return;
                }

                let row1 = rows[0];
                let payload = Payload.fromVortexMsg(row1.payload);

                assert(payload.tuples.length === 1,
                    `Expected 1 tuple, got ${payload.tuples.length}`);

                return payload.tuples[0];
            });
    }

    private countActions(): Promise<void> {
        let sql = `SELECT count(payload) as count
                    FROM ${tableName}
                    WHERE scope = ?`;
        let bindParams = [this.storageName];

        return this.webSql.querySql(sql, bindParams)
            .then((rows: any[]) => {
                this.vortexStatus.setQueuedActionCount(rows[0].count);

            }).catch(err => {
                let errStr = JSON.stringify(err);
                this.vortexStatus.logError(`Failed to count TupleActions : ${errStr}`);
                // Consume error
            });
    }

    private deleteAction(actionUuid: number): Promise < void > {
        let sql = `DELETE FROM ${tableName}
                    WHERE scope=? AND uuid=?`;
        let bindParams = [this.storageName, actionUuid];

        return this.webSql.runSql(sql, bindParams)
            .then(() => {
                this.vortexStatus.decrementQueuedActionCount();
                return;
            });

    }

}
