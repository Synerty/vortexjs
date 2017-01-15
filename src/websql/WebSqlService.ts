import {Injectable} from "@angular/core";


@Injectable()
export abstract class WebSqlFactoryService {
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
                .catch(reject)
                .then((tx: WebSqlTransaction) => {

                    // Run SQL Promise
                    // TODO, Handle more than one SQL statement
                    tx.executeSql(this.dbSchema[0])
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

    runSql(sql: string, bindParams: any[] = []): Promise<boolean> {

        return new Promise<boolean | number>((resolve, reject) => {
            this.openTransRunSql(sql, bindParams)
                .catch(reject)
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
                .catch(reject)
                .then((rows: any[]) => resolve(rows));
        });
    }


    private openTransRunSql(sql: string, bindParams: any[]): Promise<null | any[]> {
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