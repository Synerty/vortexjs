import {Injectable} from "@angular/core";
import {WebSqlFactoryService} from "../../websql/WebSqlService";
import {TupleStorageServiceABC} from "../storage/TupleStorageServiceABC";
import {TupleOfflineStorageNameService} from "../TupleOfflineStorageNameService";
import {TupleStorageWebSqlService} from "../storage/TupleStorageWebSqlService";
import {TupleStorageFactoryService} from "./TupleStorageFactoryService";

@Injectable()
export class TupleStorageFactoryServiceNs extends TupleStorageFactoryService {
    constructor(webSqlFactory: WebSqlFactoryService) {
        super(webSqlFactory);

    }

    create(name: TupleOfflineStorageNameService): TupleStorageServiceABC {
        return new TupleStorageWebSqlService(this.webSqlFactory, name);
    }
}

