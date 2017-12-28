import { WebSqlFactoryService, WebSqlService } from "./WebSqlService";
export declare class WebSqlNativeScriptFactoryService implements WebSqlFactoryService {
    hasStorageLimitations(): boolean;
    supportsWebSql(): boolean;
    createWebSql(dbName: string, dbSchema: string[]): WebSqlService;
}
