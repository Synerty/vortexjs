import {Injectable} from "@angular/core";
import {WebSqlFactoryService} from "../../websql/WebSqlService";
import {TupleStorageServiceABC} from "../storage/TupleStorageServiceABC";
import {TupleOfflineStorageNameService} from "../TupleOfflineStorageNameService";
import {TupleStorageIndexedDbService} from "../storage/TupleStorageIndexedDbService";
import {TupleStorageWebSqlService} from "../storage/TupleStorageWebSqlService";
import {TupleStorageNullService} from "../storage/TupleStorageNullService";
import {TupleStorageFactoryService} from "./TupleStorageFactoryService";
import {TupleActionStorageServiceABC} from "../action-storage/TupleActionStorageServiceABC";
import {supportsIndexedDb} from "../storage/IndexedDb";
import {TupleActionStorageWebSqlService} from "../action-storage/TupleActionStorageWebSqlService";
// import {TupleActionStorageIndexedDbService} from "../action-storage/TupleActionStorageIndexedDbService";

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
            return new TupleStorageIndexedDbService(name);
        }

        // Otheriwse, the null service just silently does nothing.
        console.log("TupleStorageFactoryService: Choosing Null Storage");
        return new TupleStorageNullService(name);
    }

    createActionStorage(): TupleActionStorageServiceABC {
                console.log("TupleStorageFactoryService: FORCING WebSQL Storage");
                return new TupleActionStorageWebSqlService(this.webSqlFactory);
        /*
            // Prefer Web SQL
            if (this.webSqlFactory.supportsWebSql()
                && !this.webSqlFactory.hasStorageLimitations()) {
                console.log("TupleStorageFactoryService: Choosing WebSQL Storage");
                return new TupleActionStorageWebSqlService(this.webSqlFactory);
            }

            // Fallback to Indexed DB, It gives mega space on mobile iOS
            if (supportsIndexedDb()) {
                console.log("TupleStorageFactoryService: Choosing IndexedDB Storage");
                return new TupleActionStorageIndexedDbService();
            }

            // Otheriwse, raise an exception.
            console.log("TupleStorageFactoryService: Choosing Null Storage");
            throw new Error("Failed to choose a suitable storage backend for" +
                " offline TupleActions");

            // Maybe we could have an in memory tuple action cache, but it wouldn't be the
            // same.
            */
    }
}

