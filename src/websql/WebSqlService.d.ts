export declare abstract class WebSqlFactoryService {
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
    abstract createWebSql(dbName: string, dbSchema: string[]): WebSqlService;
}
export interface WebSqlTransaction {
    executeSql(sql: string, bindParams?: any[] | null): Promise<null | any[]>;
}
export declare abstract class WebSqlService {
    protected dbName: string;
    protected dbSchema: string[];
    protected db: any;
    protected schemaInstalled: boolean;
    constructor(dbName: string, dbSchema: string[]);
    protected installSchema(): Promise<void>;
    abstract open(): Promise<void>;
    abstract isOpen(): boolean;
    abstract close(): void;
    abstract transaction(): Promise<WebSqlTransaction>;
    runSql(sql: string, bindParams?: any[]): Promise<boolean>;
    querySql(sql: string, bindParams?: any[]): Promise<any[]>;
    private openTransRunSql(sql, bindParams);
}
