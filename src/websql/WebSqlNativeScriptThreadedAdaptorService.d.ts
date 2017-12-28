import { WebSqlFactoryService, WebSqlService } from "./WebSqlService";
export declare class WebSqlNativeScriptThreadedFactoryService implements WebSqlFactoryService {
    hasStorageLimitations(): boolean;
    supportsWebSql(): boolean;
    createWebSql(dbName: string, dbSchema: string[]): WebSqlService;
}
