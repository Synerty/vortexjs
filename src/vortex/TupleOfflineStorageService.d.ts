import { WebSqlFactoryService } from "../websql/WebSqlService";
import { TupleSelector } from "./TupleSelector";
import { Tuple } from "./Tuple";
export declare class TupleOfflineStorageNameService {
    name: string;
    constructor(name: string);
}
export declare class TupleOfflineStorageService {
    private webSql;
    private storageName;
    constructor(webSqlFactory: WebSqlFactoryService, tupleOfflineStorageServiceName: TupleOfflineStorageNameService);
    loadTuples(tupleSelector: TupleSelector): Promise<Tuple[]>;
    saveTuples(tupleSelector: TupleSelector, tuples: Tuple[]): Promise<boolean>;
}
