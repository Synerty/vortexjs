import { Inject, Injectable } from "@angular/core"

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
    
    abstract supportsWebSql(): boolean;
    
    abstract createWebSql(
        dbName: string,
        dbSchema: string[]
    ): WebSqlService;
}

export interface WebSqlTransaction {
    executeSql(
        sql: string,
        bindParams?: any[] | null
    ): Promise<null | any[]>;
}

@Injectable()
export abstract class WebSqlService {
    
    protected db: any
    protected schemaInstalled: boolean = false
    
    constructor(
        @Inject("") protected dbName: string,
        @Inject([]) protected dbSchema: string[]
    ) {
    }
    
    protected installSchema(): Promise<void> {
        // Open Transaction promise
        return this.transaction()
            .then((tx: WebSqlTransaction) => {
                
                // Run SQL Promise
                // TODO, Handle more than one SQL statement
                return tx.executeSql(this.dbSchema[0])
                    .then((data) => {
                        this.schemaInstalled = true
                    })
            })
    }
    
    abstract open(): Promise<void>;
    
    abstract isOpen(): boolean;
    
    abstract close(): void;
    
    abstract transaction(): Promise<WebSqlTransaction>;
    
    runSql(
        sql: string,
        bindParams: any[] = []
    ): Promise<boolean> {
        
        return new Promise<boolean>((
            resolve,
            reject
        ) => {
            this.openTransRunSql(sql, bindParams)
                .catch((err) => {
                    reject(err)
                    throw new Error(err)
                })
                .then((result) => {
                    // if (typeof result === 'number')
                    //     resolve(result);
                    // else
                    resolve(true)
                })
        })
    }
    
    querySql(
        sql: string,
        bindParams: any[] = []
    ): Promise<any[]> {
        
        return new Promise<any[]>((
            resolve,
            reject
        ) => {
            this.openTransRunSql(sql, bindParams)
                .catch((err) => {
                    reject(err)
                    throw new Error(err)
                })
                .then((rows: any[]) => resolve(rows))
        })
    }
    
    private openTransRunSql(
        sql: string,
        bindParams: any[]
    ): Promise<null | any[]> {
        return this.open()
            .then(() => {
                
                // Open Transaction promise
                return this.transaction()
                    .then((tx: WebSqlTransaction) => {
                        
                        // Run SQL Promise
                        return tx.executeSql(sql, bindParams)
                            .then((data) => <null | any[]>data)
                    })
            })
    }
    
}
