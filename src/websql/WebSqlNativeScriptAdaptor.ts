let NsSqlite = require("nativescript-sqlite");


class WebSqlNativeScriptAdaptor implements WebSql {
    private db: any;

    constructor(private dbName: string) {

    }

    open(): Promise<true> {
        return new Promise<boolean>((resolve, reject) => {
            let dbPromise = new NsSqlite("MyTable");
            dbPromise.then((db) => {
                this.db = db;
                if (!NsSqlite.isSqlite(db)) {
                    reject("The thing we opened isn't a DB");
                    return;
                }

                this.db.version("1"); // MATCHES Browser Adaptor
                resolve(true);
            });
            dbPromise.catch(reject);
        });
    }

    close(): void {
        this.db.close();
    }

    transaction(): Promise<WebSqlTransaction> {
        // NOT THE COMMERCIAL VERSION, NO TRANSACTION SUPPORT IS AVAILIBLE
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

    executeSql(sql: string, bindParams: any[]|null): Promise<null | any[]> {
        return this.db.all(sql, bindParams);
    }


}
