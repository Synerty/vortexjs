import {Injectable} from "@angular/core";
import {Tuple} from "../Tuple";
import {TupleSelector} from "../TupleSelector";
import {TupleOfflineStorageNameService} from "../TupleOfflineStorageNameService";


export interface TupleStorageTransaction {

    loadTuples(tupleSelector: TupleSelector): Promise<Tuple[]> ;

    loadTuplesEncoded(tupleSelector: TupleSelector): Promise<string | null> ;

    saveTuples(tupleSelector: TupleSelector, tuples: Tuple[]): Promise<void> ;

    saveTuplesEncoded(tupleSelector: TupleSelector, vortexMsg: string): Promise<void> ;

    /** Close
     *
     * This will close the transaction, comitting if required.
     */
    close(): Promise<void> ;
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
