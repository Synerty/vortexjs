import {TupleSelector} from "../TupleSelector";
import {Tuple} from "../exports";
import {Inject, Injectable} from '@angular/core';
import {TupleStorageServiceABC, TupleStorageTransaction} from "./TupleStorageServiceABC";
import {TupleOfflineStorageNameService} from "./TupleOfflineStorageNameService";
import {dateStr} from "../UtilMisc";

// ----------------------------------------------------------------------------

@Injectable()
export class TupleStorageNullService extends TupleStorageServiceABC {
    constructor(
        @Inject(TupleOfflineStorageNameService) public name
    ) {
        super(name);
    }

    open(): Promise<void> {
        return Promise.resolve();
    }

    isOpen(): boolean {
        return true; // sure
    }

    close(): void {

    }

    truncateStorage(): Promise<void> {
        return Promise.resolve();
    }


    transaction(forWrite: boolean): Promise<TupleStorageTransaction> {
        return Promise.resolve(new TupleNullTransaction(forWrite));
    }
}


class TupleNullTransaction implements TupleStorageTransaction {

    constructor(private txForWrite: boolean) {

    }

    loadTuples(tupleSelector: TupleSelector): Promise<Tuple[]> {
        console.log(`TupleStorageNullService.tupleSelector ${tupleSelector.toOrderedJsonStr()}`);
        return Promise.resolve([]);
    }

    loadTuplesEncoded(tupleSelector: TupleSelector): Promise<string | null> {
        console.log(`TupleStorageNullService.tupleSelector ${tupleSelector.toOrderedJsonStr()}`);
        return Promise.resolve(null);
    }

    saveTuples(tupleSelector: TupleSelector, tuples: Tuple[]): Promise<void> {
        return this.saveTuplesEncoded(tupleSelector, 'TupleStorageNullService');
    }

    saveTuplesEncoded(tupleSelector: TupleSelector, vortexMsg: string): Promise<void> {

        if (!this.txForWrite) {
            let msg = "Null Storage: saveTuples attempted on read only TX";
            console.log(`${dateStr()} ${msg}`);
            return Promise.reject(msg)
        }

        console.log(`TupleStorageNullService.saveTuples ${tupleSelector.toOrderedJsonStr()}`);
        return Promise.resolve();

    }

    deleteTuples(tupleSelector: TupleSelector): Promise<void> {
        console.log(`TupleStorageNullService.deleteTuples ${tupleSelector.toOrderedJsonStr()}`);
        return Promise.resolve();
    }

    deleteOldTuples(deleteDataBeforeDate: Date): Promise<void> {
        console.log(`TupleStorageNullService.deleteOldTuples ${deleteDataBeforeDate}`);
        return Promise.resolve();
    }

    close(): Promise<void> {
        return Promise.resolve();
    }
}
