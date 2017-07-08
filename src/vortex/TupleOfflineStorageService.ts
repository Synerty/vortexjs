import {TupleSelector} from "./TupleSelector";
import {Tuple} from "./Tuple";
import {Injectable} from "@angular/core";
import {TupleStorageFactoryService} from "./storage/TupleStorageFactoryService";
import {
    TupleStorageServiceABC,
    TupleStorageTransaction
} from "./storage/TupleStorageServiceABC";
import {TupleOfflineStorageNameService} from "./TupleOfflineStorageNameService";


@Injectable()
export class TupleOfflineStorageService {
    private storage: TupleStorageServiceABC;

    constructor(storageFactory: TupleStorageFactoryService,
                tupleOfflineStorageServiceName: TupleOfflineStorageNameService) {
        this.storage = storageFactory.create(tupleOfflineStorageServiceName);

    }

    transaction(forWrite: boolean): Promise<TupleStorageTransaction> {
        return this.storage.transaction(forWrite);
    }

    loadTuples(tupleSelector: TupleSelector): Promise<Tuple[]> {
        return this.storage.transaction(false)
            .then(tx => tx.loadTuples(tupleSelector));
    }

    saveTuples(tupleSelector: TupleSelector, tuples: Tuple[]): Promise<boolean> {
        return this.storage.transaction(true)
            .then(tx => tx.saveTuples(tupleSelector, tuples));
    }


}
