import { WebSqlFactoryService } from "../../websql/WebSqlService";
import { TupleStorageServiceABC } from "../storage/TupleStorageServiceABC";
import { TupleOfflineStorageNameService } from "../storage/TupleOfflineStorageNameService";
import { TupleActionStorageServiceABC } from "../action-storage/TupleActionStorageServiceABC";
export declare abstract class TupleStorageFactoryService {
    protected webSqlFactory: WebSqlFactoryService;
    constructor(webSqlFactory: WebSqlFactoryService);
    abstract create(name: TupleOfflineStorageNameService): TupleStorageServiceABC;
    abstract createActionStorage(): TupleActionStorageServiceABC;
}
