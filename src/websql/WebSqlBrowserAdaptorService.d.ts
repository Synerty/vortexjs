import { WebSqlFactoryService, WebSqlService } from "./WebSqlService";
export declare class WebSqlBrowserFactoryService implements WebSqlFactoryService {
    createWebSql(dbName: string, dbSchema: string[]): WebSqlService;
}
export declare class WDBException {
    message: string;
    constructor(message: string);
    toString(): string;
}
