import {Injectable} from "@angular/core";
import {WebSqlFactoryService, WebSqlService, WebSqlTransaction} from "./WebSqlService";
declare let openDatabase: any;

@Injectable()
export class WebSqlBrowserFactoryService implements WebSqlFactoryService {
    createWebSql(dbName: string, dbSchema: string[]): WebSqlService {
        return new WebSqlBrowserAdaptorService(dbName, dbSchema);
    }
}

export class WDBException {
    constructor(public message: string) {
    }

    toString(): string {
        return 'WDBException: ' + this.message;
    }
}

@Injectable()
class WebSqlBrowserAdaptorService extends WebSqlService {

    constructor(protected dbName: string, protected dbSchema: string[]) {
        super(dbName, dbSchema);
    }

    open(): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            if (this.isOpen()) {
                resolve(true);
                return;
            }

            this.db = openDatabase(this.dbName, "1", this.dbName, 4 * 1024 * 1024);
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
    }

    isOpen(): boolean {
        return this.db != null;
    }

    close(): void {
        this.db = null;
    }

    transaction(): Promise<WebSqlTransaction> {
        return new Promise<WebSqlTransaction>((resolve, reject) => {
            this.db.transaction((t) => {
                resolve(new WebSqlBrowserTransactionAdaptor(t));
            }, (tx, err) => {
                reject(err == null ? tx : err);
            });
        });
    }
}

class WebSqlBrowserTransactionAdaptor implements WebSqlTransaction {
    constructor(private websqlTransaction: any) {

    }

    executeSql(sql: string, bindParams: any[]|null = []): Promise<null | any[]> {
        return new Promise<null | any[]>((resolve, reject) => {
            this.retryExecuteSql(5, sql, bindParams, resolve, reject);
        });
    }

    private retryExecuteSql(retries: number, sql: string,
                            bindParams: any[]|null, resolve: any, reject: any) {

        this.websqlTransaction.executeSql(sql, bindParams,
            (transaction, results) => {
                /*
                 * results:(SQLResultSet) {
                 *      insertId:0,
                 *      rows:(SQLResultSetRowList){
                 *          length:0
                 *      },
                 *      rowsAffected:0
                 *  }
                 */
                // ALL GOOD, Return the rows
                let rowArray = [];
                for (let i = 0; i < results.rows.length; ++i) {
                    rowArray.push(results.rows.item(i));
                }

                resolve(rowArray);

            }, (tx, err) => {
                err = err == null ? tx : err; // Sometimes tx is the err

                // Bug in Safari (at least), when the user approves the storage space
                // The WebSQL still gets the exception
                // "there was not enough remaining storage space, or the storage quota was reached and the user declined to allow more space"
                let noSpaceMsg = "there was not enough remaining storage space";
                if (retries >= 0 && err.message.indexOf(noSpaceMsg) !== -1) {
                    this.retryExecuteSql(retries - 1, sql, bindParams, resolve, reject);
                    return;
                }

                // Otherwise, REJECT
                reject(err);

            }
        );

    }

}
