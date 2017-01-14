// @Injectable()
export interface WebSqlFactory {
    createWebSql(dbName: string, dbSchema: string[]): WebSql;
}

export interface WebSql {
    open(): Promise<true>;
    isOpen(): boolean;
    close(): void;
    transaction(): Promise<WebSqlTransaction>;
    runSql(sql: string, bindParams?: any[]|null): Promise<null | any[]>;
}


export interface WebSqlTransaction {
    executeSql(sql: string, bindParams?: any[]|null): Promise<null | any[]>;
}

export abstract class WebSQLAbstract implements WebSql {

    protected db: any;
    protected schemaInstalled: boolean = false;

    constructor(protected dbName: string, protected dbSchema: string[]) {

    }

    protected installSchema(): Promise<true> {
        // Open Transaction promise
        return new Promise<boolean>((resolve, reject) => {
            this.transaction()
                .catch(reject)
                .then((tx: WebSqlTransaction) => {

                    // Run SQL Promise
                    // TODO, Handle more than one SQL statement
                    tx.executeSql(this.schemaInstalled[0])
                        .catch(reject)
                        .then((data) => {
                            this.schemaInstalled = true;
                            resolve(true)
                        });
                });
        });
    }


    abstract open(): Promise<true>;

    abstract isOpen(): boolean;

    abstract close(): void;

    abstract transaction(): Promise<WebSqlTransaction>;


    runSql(sql: string, bindParams: any[]|null): Promise<null | any[]> {
        return new Promise<null | any[]>((resolve, reject) => {

            // Open DB Promise
            this.open()
                .catch(reject)
                .then(() => {

                    // Open Transaction promise
                    this.transaction()
                        .catch(reject)
                        .then((tx: WebSqlTransaction) => {

                            // Run SQL Promise
                            tx.executeSql(sql, bindParams)
                                .catch(reject)
                                .then((data) => resolve((<null | any[]>data)));
                        });
                });
        });
    }
}