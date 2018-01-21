import {
    WebSqlFactoryService,
    WebSqlService,
    WebSqlTransaction
} from "../../websql/WebSqlService";
import {TupleSelector} from "../TupleSelector";
import {Tuple} from "../Tuple";
import {Payload} from "../Payload";
import {Injectable} from "@angular/core";
import {TupleStorageServiceABC, TupleStorageTransaction} from "./TupleStorageServiceABC";
import {TupleOfflineStorageNameService} from "../TupleOfflineStorageNameService";
import {dateStr} from "../UtilMisc";


// ----------------------------------------------------------------------------
let createTable =
    `CREATE TABLE IF NOT EXISTS tuples
     (
        tupleSelector TEXT,
        dateTime REAL,
        payload TEXT,
        PRIMARY KEY (tupleSelector)
     )`
;


let dropTable = `DROP TABLE IF NOT EXISTS tuples`;


let deleteBySelectorSql = `DELETE
                 FROM tuples
                 WHERE tupleSelector = ?`;


let deleteByDateSql = `DELETE
                 FROM tuples
                 WHERE dateTime < ?`;

let insertSql = `INSERT OR REPLACE INTO tuples
                 (tupleSelector, dateTime, payload)
                 VALUES (?, ?, ?)`;


let selectSql = `SELECT tupleSelector, dateTime, payload
                 FROM tuples
                 WHERE tupleSelector = ?`;


@Injectable()
export class TupleStorageWebSqlService extends TupleStorageServiceABC {
    private webSql: WebSqlService;
    private openInProgressPromise: Promise<void> | null = null;

    constructor(webSqlFactory: WebSqlFactoryService,
                name: TupleOfflineStorageNameService) {
        super(name);
        this.webSql = webSqlFactory.createWebSql(this.dbName, [createTable]);
    }

    open(): Promise<void> {
        if (this.openInProgressPromise != null)
            return this.openInProgressPromise;

        this.openInProgressPromise = this.webSql.open()
            .then(() => this.openInProgressPromise = null)
            .catch(e => {
                this.openInProgressPromise = null;
                throw (e);
            });

        return this.openInProgressPromise;
    }

    isOpen(): boolean {
        return this.webSql.isOpen();
    }

    close(): void {
        this.webSql.close()
    }

    truncateStorage(): Promise<void> {

        let prom: any = this.webSql.transaction()
            .then(tx => {
                let prom2: any = tx.executeSql(dropTable)
                    .then(() => tx.executeSql(createTable))
                    .then(() => {
                        // CLOSE : TODO
                        // tx.close()
                        //     .catch(e => console.log(`ERROR truncateStorage: ${e}`));
                    });
                return prom2;
            });
        return prom;

    }

    transaction(forWrite: boolean): Promise<TupleStorageTransaction> {
        return this.webSql.transaction()
            .then(t => new TupleWebSqlTransaction(t, forWrite));
    }
}


class TupleWebSqlTransaction implements TupleStorageTransaction {

    constructor(private tx: WebSqlTransaction, private txForWrite: boolean) {

    }

    private isLockedMsg(msg: string): boolean {

        let hasNsSqlError = msg.indexOf('SQLITE.ALL - Database Error5') !== -1;
        // unable to begin transaction (5 database is locked)
        let hasWebSqlError = msg.indexOf('5 database is locked') !== -1;

        if (hasNsSqlError || hasWebSqlError)
            return true;

        console.log(`WebSQL: Found error message that isn't a lock : ${msg}`);
        return false;
    }


    loadTuples(tupleSelector: TupleSelector): Promise<Tuple[]> {

        return this.loadTuplesEncoded(tupleSelector)
            .then((vortexMsg: string) => {
                if (vortexMsg == null) {
                    return [];
                }

                return Payload.fromVortexMsg(vortexMsg)
                    .then((payload: Payload) => payload.tuples);
            });
    }

    loadTuplesEncoded(tupleSelector: TupleSelector): Promise<string | null> {

        let bindParams = [tupleSelector.toOrderedJsonStr()];

        return this.tx.executeSql(selectSql, bindParams)
            .then((rows: any[]) => {
                if (rows.length === 0) {
                    return null;
                }

                let row1 = rows[0];
                return row1.payload;
            });
    }

    saveTuples(tupleSelector: TupleSelector, tuples: Tuple[]): Promise<void> {

        // The payload is a convenient way to serialise and compress the data
        return new Payload({}, tuples).toVortexMsg()
            .then((vortexMsg: string) => {
                return this.saveTuplesEncoded(tupleSelector, vortexMsg);
            });

    }


    saveTuplesEncoded(tupleSelector: TupleSelector,
                      vortexMsg: string,
                      retries = 0): Promise<void> {

        if (!this.txForWrite) {
            let msg = "WebSQL: saveTuples attempted on read only TX";
            console.log(`${dateStr()} ${msg}`);
            return Promise.reject(msg)
        }

        // The payload is a convenient way to serialise and compress the data
        let tupleSelectorStr = tupleSelector.toOrderedJsonStr();
        let bindParams = [tupleSelectorStr, Date.now(), vortexMsg];

        return this.tx.executeSql(insertSql, bindParams)
            .catch(err => {
                if (this.isLockedMsg(err)) {
                    if (retries == 5) {
                        throw new Error(`${err}\nRetried ${retries} times`);
                    }
                    return this.saveTuplesEncoded(tupleSelector, vortexMsg, retries + 1);
                }
                throw new Error(err);
            })
            .then(() => null); // Convert the result

    }

    deleteTuples(tupleSelector: TupleSelector, retries = 0): Promise<void> {

        if (!this.txForWrite) {
            let msg = "WebSQL: deleteTuples attempted on read only TX";
            console.log(`${dateStr()} ${msg}`);
            return Promise.reject(msg)
        }

        let tupleSelectorStr = tupleSelector.toOrderedJsonStr();

        return this.tx.executeSql(deleteBySelectorSql, [tupleSelectorStr])
            .catch(err => {
                if (this.isLockedMsg(err)) {
                    if (retries == 5) {
                        throw new Error(`${err}\nRetried ${retries} times`);
                    }
                    return this.deleteTuples(tupleSelector, retries + 1);
                }
                throw new Error(err);
            })
            .then(() => null); // Convert the result
    }

    deleteOldTuples(deleteDataBeforeDate: Date, retries = 0): Promise<void> {

        if (!this.txForWrite) {
            let msg = "WebSQL: deleteOldTuples attempted on read only TX";
            console.log(`${dateStr()} ${msg}`);
            return Promise.reject(msg)
        }

        return this.tx.executeSql(deleteByDateSql, [deleteDataBeforeDate.getTime()])
            .catch(err => {
                if (this.isLockedMsg(err)) {
                    if (retries == 5) {
                        throw new Error(`${err}\nRetried ${retries} times`);
                    }
                    return this.deleteOldTuples(deleteDataBeforeDate, retries + 1);
                }
                throw new Error(err);
            })
            .then(() => null); // Convert the result
    }

    close(): Promise<void> {
        return Promise.resolve();
    }


}
