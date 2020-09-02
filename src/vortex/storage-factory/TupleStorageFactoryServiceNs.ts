import { Injectable } from "@angular/core"
import { WebSqlFactoryService } from "../../websql/WebSqlService"
import { TupleStorageServiceABC } from "../storage/TupleStorageServiceABC"
import { TupleOfflineStorageNameService } from "../storage/TupleOfflineStorageNameService"
import { TupleStorageWebSqlService } from "../storage/TupleStorageWebSqlService"
import { TupleStorageFactoryService } from "./TupleStorageFactoryService"
import { TupleActionStorageServiceABC } from "../action-storage/TupleActionStorageServiceABC"
import { TupleActionStorageWebSqlService } from "../action-storage/TupleActionStorageWebSqlService"

@Injectable()
export class TupleStorageFactoryServiceNs extends TupleStorageFactoryService {
    constructor(webSqlFactory: WebSqlFactoryService) {
        super(webSqlFactory)
        
    }
    
    create(name: TupleOfflineStorageNameService): TupleStorageServiceABC {
        return new TupleStorageWebSqlService(this.webSqlFactory, name)
    }
    
    createActionStorage(): TupleActionStorageServiceABC {
        return new TupleActionStorageWebSqlService(this.webSqlFactory)
    }
}

