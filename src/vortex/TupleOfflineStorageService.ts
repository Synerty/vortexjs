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
            .then(tx => {
                return tx.loadTuples(tupleSelector)
                    .then((tuples: Tuple[]) => {
                        // We have the tuples
                        // close the transaction but disregard it's promise
                        tx.close().catch(e => console.log(`ERROR loadTuples: ${e}`));
                        return tuples;
                    });
            });
    }

    saveTuples(tupleSelector: TupleSelector, tuples: Tuple[]): Promise<void> {
        return this.storage.transaction(true)
            .then(tx => {
                return tx.saveTuples(tupleSelector, tuples)
                    // Call the TX Close when the save promise is resolved
                    .then(() => tx.close());
            });
    }


}
