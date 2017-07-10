import {Injectable} from "@angular/core";
import {WebSqlFactoryService} from "../../websql/WebSqlService";
import {TupleStorageServiceABC} from "./TupleStorageServiceABC";
import {TupleOfflineStorageNameService} from "../TupleOfflineStorageNameService";
import {supportsIndexedDb, TupleIndexedDbService} from "./TupleIndexedDbService";
import {TupleStorageWebSqlService} from "./TupleStorageWebSqlService";
import {TupleStorageNullService} from "./TupleStorageNullService";

@Injectable()
export class TupleStorageFactoryService {
    constructor(private webSqlFactory: WebSqlFactoryService) {

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
}

