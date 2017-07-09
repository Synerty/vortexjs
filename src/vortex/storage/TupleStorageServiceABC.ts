import {Injectable} from "@angular/core";
import {Tuple} from "../Tuple";
import {TupleSelector} from "../TupleSelector";
import {TupleOfflineStorageNameService} from "../TupleOfflineStorageNameService";


export interface TupleStorageTransaction {

    loadTuples(tupleSelector: TupleSelector): Promise<Tuple[]> ;

    saveTuples(tupleSelector: TupleSelector, tuples: Tuple[]): Promise<boolean> ;
}


@Injectable()
export abstract class TupleStorageServiceABC {

    protected dbName: string;

    constructor(name: TupleOfflineStorageNameService) {
        this.dbName = name.name;

    }

    abstract open(): Promise<void>;

    abstract isOpen(): boolean;

    abstract close(): void;

    // NOTE: I'm looking at the WebSQL and IndexedDb implementation and both
    // appear to only provide single use transactions like this.
    // Considering that fact, The "TupleTransaction" api seems useless.
    // See TupleIndexedDbTransaction.saveTuples
    abstract transaction(forWrite: boolean): Promise<TupleStorageTransaction>;

}