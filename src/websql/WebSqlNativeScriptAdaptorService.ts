import {Injectable} from "@angular/core";

import {WebSqlFactoryService, WebSqlService, WebSqlTransaction} from "./WebSqlService";
let NsSqlite = require("nativescript-sqlite");

@Injectable()
export class WebSqlNativeScriptFactoryService implements WebSqlFactoryService {
    createWebSql(dbName: string, dbSchema: string[]): WebSqlService {
        return new WebSqlNativeScriptAdaptorService(dbName, dbSchema);
    }
}

@Injectable()
class WebSqlNativeScriptAdaptorService extends WebSqlService {

    constructor(protected dbName: string, protected dbSchema: string[]) {
        super(dbName, dbSchema);
    }

    open(): Promise<true> {
        return new Promise<boolean>((resolve, reject) => {
            if (this.isOpen()) {
                resolve(this.db);
                return;
            }

            let dbPromise = new NsSqlite(this.dbName);
            dbPromise.then((db) => {
                this.db = db;
                if (!NsSqlite.isSqlite(db)) {
                    reject("The thing we opened isn't a DB");
                    return;
                }
                this.db.resultType(NsSqlite.RESULTSASOBJECT);
                this.db.version("1"); // MATCHES Browser Adaptor
                if (this.schemaInstalled) {
                    resolve(true);
                    return;
                }

                this.installSchema()
                    .catch((err) => {
                        reject(err);
                        throw new Error(err);
                    })
                    .then(() => resolve(true));
            });
            dbPromise.catch((err) => {
                reject(err);
                throw new Error(err);
            });
        });
    }

    isOpen(): boolean {
        return this.db !== null && NsSqlite.isSqlite(this.db) && this.db.isOpen();
    }

    close(): void {
        this.db.close();
        this.db = null;
    }

    transaction(): Promise<WebSqlTransaction> {
        // NOT THE COMMERCIAL VERSION, NO TRANSACTION SUPPORT IS AVAILABLE
        if (!this.db && this.db.isOpen())
            throw new Error("The database is not open");

        return new Promise<WebSqlTransaction>((resolve, reject) => {
            resolve(new WebSqlNativeScriptTransactionAdaptor(this.db));
        });
    }
}

class WebSqlNativeScriptTransactionAdaptor implements WebSqlTransaction {
    constructor(private db: any) {

    }

    executeSql(sql: string, bindParams: any[]|null = []): Promise<null | any[]> {
        return this.db.all(sql, bindParams);
    }


}
