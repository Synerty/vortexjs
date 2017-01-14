
interface WebSql {
    open(): Promise<true>;
    close():void;
    transaction(): Promise<WebSqlTransaction>;
}


interface WebSqlTransaction {
    executeSql(sql: string, bindParams: any[]|null): Promise<null | any[]>;
}

