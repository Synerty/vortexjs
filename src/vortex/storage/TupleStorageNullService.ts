import {TupleSelector} from "../TupleSelector";
import {Tuple} from "../Tuple";
import {Injectable} from "@angular/core";
import {TupleStorageServiceABC, TupleStorageTransaction} from "./TupleStorageServiceABC";
import {TupleOfflineStorageNameService} from "../TupleOfflineStorageNameService";
import {dateStr} from "../UtilMisc";

// ----------------------------------------------------------------------------

@Injectable()
export class TupleStorageNullService extends TupleStorageServiceABC {

    constructor(name: TupleOfflineStorageNameService) {
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

    saveTuples(tupleSelector: TupleSelector, tuples: Tuple[]): Promise<void> {

        if (!this.txForWrite) {
            let msg = "Null Storage: saveTuples attempted on read only TX";
            console.log(`${dateStr()} ${msg}`);
            return Promise.reject(msg)
        }

        console.log(`TupleStorageNullService.saveTuples ${tupleSelector.toOrderedJsonStr()}`);
        return Promise.resolve();

    }

    close(): Promise<void> {
        return Promise.resolve();
    }
}
