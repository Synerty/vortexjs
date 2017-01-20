import {Injectable} from "@angular/core";
import {VortexStatusService} from "./VortexStatusService";
import {TupleAction} from "./TupleAction";
import {WebSqlFactoryService, WebSqlService} from "../websql/WebSqlService";
import {TupleActionNameService, TupleActionService} from "./TupleActionService";
import {Payload} from "./Payload";
import {VortexService} from "./VortexService";
import {assert} from "./UtilMisc";

let datbaseName = "tupleActions.sqlite";

const tableName = "tupleActions";
let databaseSchema = [
    `CREATE TABLE IF NOT EXISTS ${tableName}
     (
        id PRIMARY KEY AUTOINCREMENT,
        scope TEXT,
        uuid REAL,
        payload TEXT,
        UNIQUE (scope, uuid)
     )`];


@Injectable()
export class TupleActionOfflineService extends TupleActionService {
    private readonly tableName = "tupleActions";
    private webSql: WebSqlService;
    private storageName: string;
    private sendingTuple = false;

    private SEND_FAIL_RETRY_TIMEOUT = 5000;// milliseconds

    constructor(tupleActionName: TupleActionNameService,
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
    }


    pushAction(tupleAction: TupleAction): Promise<TupleAction> {
        let p = this.storeAction(tupleAction);
        this.sendNextAction();
        return p;
    }

    private sendNextAction() {
        if (this.sendingTuple)
            return;

        // Get the next tuple from the persistent queue
        this.loadNextAction()

        // If this was successfull?
            .then(tupleAction => {
                // Is the end the end of the queue?
                if (tupleAction == null)
                    return;

                // No?, ok, lets send the action to the server
                return this.sendAction(tupleAction)

                // Upon a successfull reply from the server...
                    .then(tupleAction => {
                        this.deleteAction(tupleAction.uuid);
                        this.sendingTuple = false;
                        this.sendNextAction();
                    })

            })

            // Or catch and handle any of the errors from either loading or sending
            .catch(err => {
                this.vortexStatus.logError(`Failed to send TupleAction : ${err}`);
                this.sendingTuple = false;
                setTimeout(() => this.sendNextAction(), this.SEND_FAIL_RETRY_TIMEOUT);
                return null; // Handle the error
            });
    }

    private storeAction(tupleAction: TupleAction): Promise < TupleAction > {
        // The payload is a convenient way to serialise and compress the data
        let payloadData = new Payload({}, [tupleAction]).toVortexMsg();

        let sql = `INSERT INTO ${tableName}
                    (scope, uuid, payload)
                    VALUES (?, ?, ?)`;
        let bindParams = [this.storageName, tupleAction.uuid, payloadData];

        return this.webSql.runSql(sql, bindParams)
            .then(() => tupleAction); //
    }

    private loadNextAction(): Promise<TupleAction> {
        let sql = `SELECT payload
                    FROM ${tableName}
                    WHERE scope = ?
                    ORDER BY id
                    LIMIT 1`;
        let bindParams = [this.storageName];

        return this.webSql.querySql(sql, bindParams)
            .then((rows: any[]) => {
                if (rows.length === 0) {
                    return [];
                }

                let row1 = rows[0];
                let payload = Payload.fromVortexMsg(row1.payload);

                assert(payload.tuples.length === 1,
                    `Expected 1 tuple, got ${payload.tuples.length}`);

                return payload.tuples[0];
            });
    }

    private deleteAction(actionUuid: number): Promise < void > {
        let sql = `DELETE FROM ${tableName}
                    WHERE scope=? AND uuid=?`;
        let bindParams = [this.storageName, actionUuid];

        return this.webSql.runSql(sql, bindParams)
            .then(() => {
                return;
            });

    }

}
