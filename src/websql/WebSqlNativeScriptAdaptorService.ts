import {Injectable} from "@angular/core";

import {WebSqlFactoryService, WebSqlService, WebSqlTransaction} from "./WebSqlService";
let NsSqlite = require("nativescript-sqlite");

@Injectable()
export class WebSqlNativeScriptFactoryService implements WebSqlFactoryService {

    hasStorageLimitations(): boolean {
        return false; // NOPE :-)
    }

    supportsWebSql(): boolean {
        return true; // Yes :-)
    }

    createWebSql(dbName: string, dbSchema: string[]): WebSqlService {
        return new WebSqlNativeScriptAdaptorService(dbName, dbSchema);
    }
}

@Injectable()
class WebSqlNativeScriptAdaptorService extends WebSqlService {

    private promiseMutexList = [];

    private dbLocked = false;

    constructor(protected dbName: string, protected dbSchema: string[]) {
        super(dbName, dbSchema);
    }

    open(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            if (this.isOpen()) {
                resolve();
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
                    resolve();
                    return;
                }

                this.installSchema()
                    .catch((err) => {
                        reject(err);
                        throw new Error(err);
                    })
                    .then(() => resolve());
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
        if (!this.isOpen())
            throw new Error(`SQLDatabase ${this.dbName} is not open`);

        let prom =  new Promise<WebSqlTransaction>((resolve, reject) => {
          this.promiseMutexList.push(resolve);
        })
          .then((val) => {
          // console.log("==== Query complete =====");
              this.dbLocked = false;
              this.resolveNext();
              return val;
          })
          .catch(e => {
          // console.log("==== Query complete =====");
              this.dbLocked = false;
              this.resolveNext();
              throw new Error(e);
          });

        this.resolveNext();
        return prom;
    }

    private resolveNext() :void {
      if (this.dbLocked || this.promiseMutexList.length == 0)
        return;

        // console.log(`==== Query started ${this.promiseMutexList.length} =====`);
      this.dbLocked = true;
      let resolve = this.promiseMutexList.shift();
      resolve(new WebSqlNativeScriptTransactionAdaptor(this.db));
    }
}

class WebSqlNativeScriptTransactionAdaptor implements WebSqlTransaction {
    constructor(private db: any) {

    }

    executeSql(sql: string, bindParams: any[] | null = []): Promise<null | any[]> {
        return this.db.all(sql, bindParams);
    }


}
