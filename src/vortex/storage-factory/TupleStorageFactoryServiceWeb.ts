import {Injectable} from "@angular/core";
import {WebSqlFactoryService} from "../../websql/WebSqlService";
import {TupleStorageServiceABC} from "../storage/TupleStorageServiceABC";
import {TupleOfflineStorageNameService} from "../TupleOfflineStorageNameService";
import { TupleIndexedDbService} from "../storage/TupleIndexedDbService";
import {TupleStorageWebSqlService} from "../storage/TupleStorageWebSqlService";
import {TupleStorageNullService} from "../storage/TupleStorageNullService";
import {TupleStorageFactoryService} from "./TupleStorageFactoryService";
import {TupleActionStorageServiceABC} from "../action-storage/TupleActionStorageServiceABC";
import {TueplWebSqlActionStorageService} from "../action-storage/TupleWebSqlActionStorageService";
import {supportsIndexedDb} from "../storage/IndexedDb";

@Injectable()
export class TupleStorageFactoryServiceWeb extends TupleStorageFactoryService {
    constructor(webSqlFactory: WebSqlFactoryService) {
        super(webSqlFactory);
    }

    create(name: TupleOfflineStorageNameService): TupleStorageServiceABC {

        // Prefer Web SQL
        if (this.webSqlFactory.supportsWebSql()
            && !this.webSqlFactory.hasStorageLimitations()) {
            console.log("TupleStorageFactoryService: Choosing WebSQL Storage");
            return new TupleStorageWebSqlService(this.webSqlFactory, name);
        }

        // Fallback to Indexed DB, It gives mega space on mobile iOS
        if (supportsIndexedDb()) {
            console.log("TupleStorageFactoryService: Choosing IndexedDB Storage");
            return new TupleIndexedDbService(name);
        }

        // Otheriwse, the null service just silently does nothing.
        console.log("TupleStorageFactoryService: Choosing Null Storage");
        return new TupleStorageNullService(name);
    }

    createActionStorage(): TupleActionStorageServiceABC {
        // TODO, Implement IndexedDB storage for
        return new TueplWebSqlActionStorageService(this.webSqlFactory);
    }
}

