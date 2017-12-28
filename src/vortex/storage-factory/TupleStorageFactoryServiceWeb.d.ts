import { WebSqlFactoryService } from "../../websql/WebSqlService";
import { TupleStorageServiceABC } from "../storage/TupleStorageServiceABC";
import { TupleOfflineStorageNameService } from "../TupleOfflineStorageNameService";
import { TupleStorageFactoryService } from "./TupleStorageFactoryService";
import { TupleActionStorageServiceABC } from "../action-storage/TupleActionStorageServiceABC";
export declare class TupleStorageFactoryServiceWeb extends TupleStorageFactoryService {
    constructor(webSqlFactory: WebSqlFactoryService);
    create(name: TupleOfflineStorageNameService): TupleStorageServiceABC;
    createActionStorage(): TupleActionStorageServiceABC;
}
