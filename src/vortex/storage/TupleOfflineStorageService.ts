import { TupleSelector } from "../TupleSelector"
import { Tuple } from "../exports"
import { Inject, Injectable } from "@angular/core"
import { TupleStorageFactoryService } from "../storage-factory/TupleStorageFactoryService"
import { TupleStorageServiceABC, TupleStorageTransaction } from "./TupleStorageServiceABC"
import { TupleOfflineStorageNameService } from "./TupleOfflineStorageNameService"

@Injectable()
export class TupleOfflineStorageService {
    private storage: TupleStorageServiceABC
    
    constructor(
        @Inject(TupleStorageFactoryService) private storageFactory,
        @Inject(TupleOfflineStorageNameService) private tupleOfflineStorageServiceName
    ) {
        this.storage = storageFactory.create(tupleOfflineStorageServiceName)
    }
    
    transaction(forWrite: boolean): Promise<TupleStorageTransaction> {
        if (!this.storage.isOpen())
            return this.storage.open()
                .then(() => this.storage.transaction(forWrite))
        
        return this.storage.transaction(forWrite)
    }
    
    loadTuples(tupleSelector: TupleSelector): Promise<Tuple[]> {
        return this.transaction(false)
            .then(tx => {
                return tx.loadTuples(tupleSelector)
                    .then((tuples: Tuple[]) => {
                        // We have the tuples
                        // close the transaction but disregard it's promise
                        tx.close()
                            .catch(e => console.log(`ERROR loadTuples: ${e}`))
                        return tuples
                    })
            })
    }
    
    loadTuplesEncoded(tupleSelector: TupleSelector): Promise<string | null> {
        return this.transaction(false)
            .then(tx => {
                return tx.loadTuplesEncoded(tupleSelector)
                    .then((vortexMsg: string | null) => {
                        // We have the tuples
                        // close the transaction but disregard it's promise
                        tx.close()
                            .catch(e => console.log(`ERROR loadTuplesEncoded: ${e}`))
                        return vortexMsg
                    })
            })
    }
    
    saveTuples(
        tupleSelector: TupleSelector,
        tuples: Tuple[]
    ): Promise<void> {
        return this.transaction(true)
            .then(tx => {
                return tx.saveTuples(tupleSelector, tuples)
                    // Call the TX Close when the save promise is resolved
                    .then(() => {
                        // Don't add the close to the promise chain
                        tx.close()
                            .catch(e => console.log(`ERROR saveTuples: ${e}`))
                    })
            })
    }
    
    saveTuplesEncoded(
        tupleSelector: TupleSelector,
        vortexMsg: string
    ): Promise<void> {
        return this.transaction(true)
            .then(tx => {
                return tx.saveTuplesEncoded(tupleSelector, vortexMsg)
                    // Call the TX Close when the save promise is resolved
                    .then(() => {
                        // Don't add the close to the promise chain
                        tx.close()
                            .catch(e => console.log(`ERROR saveTuplesEncoded: ${e}`))
                    })
            })
    }
    
    deleteTuples(tupleSelector: TupleSelector): Promise<void> {
        return this.transaction(true)
            .then(tx => {
                return tx.deleteTuples(tupleSelector)
                    .then(() => {
                        tx.close()
                            .catch(e => console.log(`ERROR deleteTuples: ${e}`))
                    })
            })
    }
    
    deleteOldTuples(deleteDataBeforeDate: Date): Promise<void> {
        return this.transaction(true)
            .then(tx => {
                return tx.deleteOldTuples(deleteDataBeforeDate)
                    .then(() => {
                        tx.close()
                            .catch(e => console.log(`ERROR deleteOldTuples: ${e}`))
                    })
            })
    }
    
    truncateStorage(): Promise<void> {
        return this.storage.truncateStorage()
    }
    
}
