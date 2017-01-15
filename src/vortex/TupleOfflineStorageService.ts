import {WebSqlService, WebSqlFactoryService} from "../websql/WebSqlService";
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
    private webSql: WebSqlService;

    constructor(webSqlFactory: WebSqlFactoryService) {
        this.webSql = webSqlFactory.createWebSql(datbaseName, databaseSchema);

    }

    loadTuples(tupleSelector: TupleSelector): Promise<Tuple[]> {

        let tupleSelectorStr = tupleSelector.toOrderedJsonStr();
        let sql = `SELECT tupleSelector, dateTime, payload
                    FROM tuples
                    WHERE tupleSelector = ?`;
        let bindParams = [tupleSelectorStr];


        return new Promise<Tuple[]>((resolve, reject) => {
            this.webSql.querySql(sql, bindParams)
                .catch(reject)
                .then((rows: any[]) => {
                    if (rows.length === 0) {
                        resolve([]);
                        return;
                    }

                    let row1 = rows[0];
                    let payload = Payload.fromVortexMsg(row1.payload);
                    resolve(payload.tuples);
                });
        });
    }

    saveTuples(tupleSelector: TupleSelector, tuples: Tuple[]): Promise < boolean > {
        // The payload is a convenient way to serialise and compress the data
        let payloadData = new Payload({}, tuples).toVortexMsg();
        let tupleSelectorStr = tupleSelector.toOrderedJsonStr();
        let sql = 'INSERT OR REPLACE INTO tuples VALUES (?, ?, ?)';
        let bindParams = [tupleSelectorStr, Date.now(), payloadData];

        return this.webSql.runSql(sql, bindParams);

    }


}
