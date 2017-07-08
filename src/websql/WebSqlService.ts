import {Injectable} from "@angular/core";


@Injectable()
export abstract class WebSqlFactoryService {

    /** Has Storage Limitations
     *
     * Returns true if this SQL storage has a small limitation on storage.
     *
     * This was implemented to return true on iOS mobile devices, as they have a
     * 50mb storage limit.
     *
     */
    abstract hasStorageLimitations(): boolean;

    abstract supportsWebSql():boolean;

    abstract createWebSql(dbName: string, dbSchema: string[]): WebSqlService;
}

export interface WebSqlTransaction {
    executeSql(sql: string, bindParams?: any[]|null): Promise<null | any[]>;
}


@Injectable()
export abstract class WebSqlService {

    protected db: any;
    protected schemaInstalled: boolean = false;

    constructor(protected dbName: string, protected dbSchema: string[]) {

    }

    protected installSchema(): Promise<true> {
        // Open Transaction promise
        return new Promise<boolean>((resolve, reject) => {
            this.transaction()
                .catch((err) => {
                    reject(err);
                    throw new Error(err);
                })
                .then((tx: WebSqlTransaction) => {

                    // Run SQL Promise
                    // TODO, Handle more than one SQL statement
                    tx.executeSql(this.dbSchema[0])
                        .catch((err) => {
                            reject(err);
                            throw new Error(err);
                        })
                        .then((data) => {
                            this.schemaInstalled = true;
                            resolve(true)
                        });
                });
        });
    }

    abstract open(): Promise<void>;

    abstract isOpen(): boolean;

    abstract close(): void;

    abstract transaction(): Promise<WebSqlTransaction>;

    runSql(sql: string, bindParams: any[] = []): Promise<boolean> {

        return new Promise<boolean>((resolve, reject) => {
            this.openTransRunSql(sql, bindParams)
                .catch((err) => {
                    reject(err);
                    throw new Error(err);
                })
                .then((result) => {
                    // if (typeof result === 'number')
                    //     resolve(result);
                    // else
                    resolve(true);
                });
        });
    }

    querySql(sql: string, bindParams: any[] = []): Promise<any[]> {

        return new Promise<any[]>((resolve, reject) => {
            this.openTransRunSql(sql, bindParams)
                .catch((err) => {
                    reject(err);
                    throw new Error(err);
                })
                .then((rows: any[]) => resolve(rows));
        });
    }


    private openTransRunSql(sql: string, bindParams: any[]): Promise<null | any[]> {
        return new Promise<null | any[]>((resolve, reject) => {

            // Open DB Promise
            this.open()
                .catch((err) => {
                    reject(err);
                    throw new Error(err);
                })
                .then(() => {

                    // Open Transaction promise
                    this.transaction()
                        .catch((err) => {
                            reject(err);
                            throw new Error(err);
                        })
                        .then((tx: WebSqlTransaction) => {

                            // Run SQL Promise
                            tx.executeSql(sql, bindParams)
                                .catch((err) => {
                                    reject(err);
                                    throw new Error(err);
                                })
                                .then((data) => resolve((<null | any[]>data)));
                        });
                });
        });
    }
}