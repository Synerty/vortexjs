declare let openDatabase: any;

export class WDBException {
    constructor(public message: string) {
    }

    toString(): string {
        return 'WDBException: ' + this.message;
    }
}

class WebSqlBrowserAdaptor implements WebSql {
    private db: any = null;

    constructor(private dbName: string) {

    }

    open(): Promise<true> {
        return new Promise<boolean>((resolve, reject) => {
            this.db = openDatabase(this.dbName, "1", this.dbName, 4 * 1024 * 1024);
            resolve(true);
        });
    }

    close():void{
        this.db = null;
    }

    transaction(): Promise<WebSqlTransaction> {
        return new Promise<WebSqlTransaction>((resolve, reject) => {
            this.db.transaction((t) => {
                resolve(new WebSqlBrowserTransactionWrapper(t));
            }, (tx, err) => {
                reject(err == null ? tx : err);
            });
        });
    }
}

class WebSqlBrowserTransactionWrapper implements WebSqlTransaction {
    constructor(private websqlTransaction: any) {

    }

    executeSql(sql: string, bindParams: any[]|null): Promise<null | any[]> {
        return new Promise<null | any[]>((resolve, reject) => {
            this.retryExecuteSql(5, sql, bindParams, resolve, reject);
        });
    }

    private retryExecuteSql(retries: number, sql: string,
                            bindParams: any[]|null, resolve: any, reject: any) {

        this.websqlTransaction.executeSql(sql, bindParams,
            (transaction, results) => {
                // ALL GOOD, Return the rows
                resolve(results.rows);

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
