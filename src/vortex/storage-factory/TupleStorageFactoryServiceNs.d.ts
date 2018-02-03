import { WebSqlFactoryService } from "../../websql/WebSqlService";
import { TupleStorageServiceABC } from "../storage/TupleStorageServiceABC";
import { TupleOfflineStorageNameService } from "../storage/TupleOfflineStorageNameService";
import { TupleStorageFactoryService } from "./TupleStorageFactoryService";
import { TupleActionStorageServiceABC } from "../action-storage/TupleActionStorageServiceABC";
export declare class TupleStorageFactoryServiceNs extends TupleStorageFactoryService {
    constructor(webSqlFactory: WebSqlFactoryService);
    create(name: TupleOfflineStorageNameService): TupleStorageServiceABC;
    createActionStorage(): TupleActionStorageServiceABC;
}
