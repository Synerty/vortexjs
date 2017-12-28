declare let NsSqlite: any;
declare let global: any;
declare let db: any;
declare let schemaInstalled: any;
declare function postError(call: number, callNumber: number, err: any): void;
declare function postResult(call: number, callNumber: number, result: any): void;
declare const CALL_DB_OPEN = 1;
declare const CALL_DB_EXECUTE = 3;
declare function openDb(dbName: string, dbSchema: string, dbVersion: string): void;
declare function executeSql(callNumber: number, sql: string, bindParams: any): void;