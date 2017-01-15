import {WebSqlService, WebSqlFactoryService} from "../websql/WebSqlService";
import {TupleSelector} from "./TupleSelector";
import {Tuple} from "./Tuple";
import {Payload} from "./Payload";
import {Injectable} from "@angular/core";

let datbaseName = "offlineTuples.sqlite";
let databaseSchema = [
    `CREATE TABLE IF NOT EXISTS tuples
     (
        scope TEXT,
        tupleSelector TEXT,
        dateTime REAL,
        payload TEXT,
        PRIMARY KEY (scope, tupleSelector)
     )`];

@Injectable()
export class TupleOfflineStorageNameService {
    constructor(public name: string) {

    }
}


@Injectable()
export class TupleOfflineStorageService {
    private webSql: WebSqlService;
    private storageName: string;

    constructor(webSqlFactory: WebSqlFactoryService,
                tupleOfflineStorageServiceName: TupleOfflineStorageNameService) {
        this.webSql = webSqlFactory.createWebSql(datbaseName, databaseSchema);
        this.storageName = tupleOfflineStorageServiceName.name;

    }

    loadTuples(tupleSelector: TupleSelector): Promise<Tuple[]> {

        let tupleSelectorStr = tupleSelector.toOrderedJsonStr();
        let sql = `SELECT scope, tupleSelector, dateTime, payload
                    FROM tuples
                    WHERE tupleSelector = ? AND scope = ?`;
        let bindParams = [tupleSelectorStr, this.storageName];


        return new Promise<Tuple[]>((resolve, reject) => {
            this.webSql.querySql(sql, bindParams)
                .catch((err) => {
                    reject(err);
                    throw new Error(err);
                })
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
        let sql = `INSERT OR REPLACE INTO tuples
                    (scope, tupleSelector, dateTime, payload)
                    VALUES (?, ?, ?, ?)`;
        let bindParams = [this.storageName, tupleSelectorStr, Date.now(), payloadData];

        return this.webSql.runSql(sql, bindParams);

    }


}
