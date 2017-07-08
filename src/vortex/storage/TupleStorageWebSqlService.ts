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
let databaseSchema = [
    `CREATE TABLE IF NOT EXISTS tuples
     (
        tupleSelector TEXT,
        dateTime REAL,
        payload TEXT,
        PRIMARY KEY (tupleSelector)
     )`
];


let insertSql = `INSERT OR REPLACE INTO tuples
                 (tupleSelector, dateTime, payload)
                 VALUES (?, ?, ?)`;


let selectSql = `SELECT tupleSelector, dateTime, payload
                 FROM tuples
                 WHERE tupleSelector = ?`;


@Injectable()
export class TupleStorageWebSqlService extends TupleStorageServiceABC {
    private webSql: WebSqlService;

    constructor(webSqlFactory: WebSqlFactoryService,
                name: TupleOfflineStorageNameService) {
        super(name);
        this.webSql = webSqlFactory.createWebSql(this.dbName, databaseSchema);
    }

    open(): Promise<void> {
        return this.webSql.open();
    }

    isOpen(): boolean {
        return this.webSql.isOpen();
    }

    close(): void {
        this.webSql.close()
    }

    transaction(forWrite: boolean): Promise<TupleStorageTransaction> {
        return this.webSql.transaction()
            .then(t => new TupleWebSqlTransaction(t, forWrite));
    }
}


class TupleWebSqlTransaction implements TupleStorageTransaction {

    constructor(private tx: WebSqlTransaction, private txForWrite: boolean) {

    }

    loadTuples(tupleSelector: TupleSelector): Promise<Tuple[]> {

        let bindParams = [tupleSelector.toOrderedJsonStr()];

        return this.tx.executeSql(selectSql, bindParams)
            .then((rows: any[]) => {
                if (rows.length === 0) {
                    return [];
                }

                let row1 = rows[0];
                let payload = Payload.fromVortexMsg(row1.payload);
                return payload.tuples;
            });
    }

    saveTuples(tupleSelector: TupleSelector, tuples: Tuple[]): Promise<boolean> {

        if (!this.txForWrite) {
            let msg = "WebSQL: saveTuples attempted on read only TX";
            console.log(`${dateStr()} ${msg}`);
            return Promise.reject(msg)
        }

        // The payload is a convenient way to serialise and compress the data
        let payloadData = new Payload({}, tuples).toVortexMsg();
        let tupleSelectorStr = tupleSelector.toOrderedJsonStr();
        let bindParams = [tupleSelectorStr, Date.now(), payloadData];

        return this.tx.executeSql(insertSql, bindParams)
            .then(() => true); // Convert the result

    }


}
