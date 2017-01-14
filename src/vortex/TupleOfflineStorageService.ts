import {WebSql, WebSqlFactory, WebSqlTransaction} from "../websql/WebSq";
import {TupleSelector} from "./TupleSelector";
import {Tuple} from "./Tuple";
import {Payload} from "./Payload";

let datbaseName = "offlineTuples.sqlite";
let databaseSchema = [
    `CREATE TABLE IF NOT EXISTS tuples
     (
        tupleSelector TEXT PRIMARY KEY ASC,
        dateTime REAL,
        payload TEXT
     )`];

export class TupleOfflineStorageService {
    private webSql: WebSql;

    constructor(webSqlFactory: WebSqlFactory) {
        this.webSql = webSqlFactory.createWebSql(datbaseName, databaseSchema);

    }

    loadTuples(tupleSelector: TupleSelector): Promise<Tuple[]> {

        let tupleSelectorStr = tupleSelector.toOrderedJsonStr();
        let sql = `SELECT tupleSelector, dateTime, payload
                    FROM tuples
                    WHERE tupleSelector = ?`;
        let bindParams = [tupleSelectorStr];

        return new Promise<Tuple[]>((resolve, reject) => {
            this.webSql.runSql(sql, bindParams)
                .catch(reject)
                .then((rows) => {
                    if (rows == null || (<any[]>rows).length) {
                        resolve([]);
                        return;
                    }
                    let row1 = rows[0];
                    let payload = Payload.fromVortexMsg(row1.payload);
                    resolve(payload.tuples)
                });
        });
    }

    saveTuples(tupleSelector: TupleSelector, tuples: Tuple[]): Promise<true> {
        // The payload is a convenient way to serialise and compress the data
        let payloadData = new Payload({}, tuples).toVortexMsg();
        let tupleSelectorStr = tupleSelector.toOrderedJsonStr();
        let sql = 'INSERT OR REPLACE INTO tuples VALUES (?, ?, ?)';
        let bindParams = [tupleSelectorStr, Date.now(), payloadData];

        return new Promise<true>((resolve, reject) => {
            this.webSql.runSql(sql, bindParams)
                .catch(reject)
                .then(() => resolve(true))
        });

    }


}
