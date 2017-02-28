import { WebSqlFactoryService, WebSqlService } from "./WebSqlService";
export declare class WebSqlNativeScriptFactoryService implements WebSqlFactoryService {
    createWebSql(dbName: string, dbSchema: string[]): WebSqlService;
}
