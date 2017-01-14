import {WebSqlFactory, WebSql, WebSqlTransaction, WebSQLAbstract} from "./WebSq";
declare let openDatabase: any;

export class WebSqlBrowserFactory implements WebSqlFactory {
    createWebSql(dbName: string, dbSchema: string[]): WebSql {
        return new WebSqlBrowserAdaptor(dbName, dbSchema);
    }
}
export class WDBException {
    constructor(public message: string) {
    }

    toString(): string {
        return 'WDBException: ' + this.message;
    }
}

class WebSqlBrowserAdaptor extends WebSQLAbstract {

    open(): Promise<true> {
        return new Promise<boolean>((resolve, reject) => {
            if (this.isOpen()) {
                resolve(this.db);
                return;
            }

            this.db = openDatabase(this.dbName, "1", this.dbName, 4 * 1024 * 1024);
            if (this.schemaInstalled) {
                resolve(true);
                return;
            }

            this.installSchema()
                .catch(reject)
                .then(() => resolve(true));
        });
    }

    isOpen(): boolean {
        return this.db !== null;
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
                if (retries >= 0 && err.message.indexOf("there was not enough remaining storage space") !== -1) {
                    this.retryExecuteSql(retries - 1, sql, bindParams, resolve, reject);
                    return;
                }

                // Otherwise, REJECT
                reject(err == null ? tx : err);

            }
        );

    }

}
