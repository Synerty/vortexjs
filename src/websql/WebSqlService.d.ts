export declare abstract class WebSqlFactoryService {
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
    protected installSchema(): Promise<true>;
    abstract open(): Promise<true>;
    abstract isOpen(): boolean;
    abstract close(): void;
    abstract transaction(): Promise<WebSqlTransaction>;
    runSql(sql: string, bindParams?: any[]): Promise<boolean>;
    querySql(sql: string, bindParams?: any[]): Promise<any[]>;
    private openTransRunSql(sql, bindParams);
}
