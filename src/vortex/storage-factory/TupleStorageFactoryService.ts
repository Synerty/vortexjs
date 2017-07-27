import {WebSqlFactoryService} from "../../websql/WebSqlService";
import {TupleStorageServiceABC} from "../storage/TupleStorageServiceABC";
import {TupleOfflineStorageNameService} from "../TupleOfflineStorageNameService";
import {TupleActionStorageServiceABC} from "../action-storage/TupleActionStorageServiceABC";

export abstract class TupleStorageFactoryService {
    constructor(protected webSqlFactory: WebSqlFactoryService) {

    }

    abstract create(name: TupleOfflineStorageNameService): TupleStorageServiceABC ;

    abstract createActionStorage(): TupleActionStorageServiceABC ;
}

