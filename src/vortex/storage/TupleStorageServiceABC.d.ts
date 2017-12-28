import { Tuple } from "../Tuple";
import { TupleSelector } from "../TupleSelector";
import { TupleOfflineStorageNameService } from "../TupleOfflineStorageNameService";
export interface TupleStorageTransaction {
    loadTuples(tupleSelector: TupleSelector): Promise<Tuple[]>;
    loadTuplesEncoded(tupleSelector: TupleSelector): Promise<string | null>;
    saveTuples(tupleSelector: TupleSelector, tuples: Tuple[]): Promise<void>;
    saveTuplesEncoded(tupleSelector: TupleSelector, vortexMsg: string): Promise<void>;
    /** Close
     *
     * This will close the transaction, comitting if required.
     */
    close(): Promise<void>;
}
export declare abstract class TupleStorageServiceABC {
    protected dbName: string;
    constructor(name: TupleOfflineStorageNameService);
    abstract open(): Promise<void>;
    abstract isOpen(): boolean;
    abstract close(): void;
    abstract transaction(forWrite: boolean): Promise<TupleStorageTransaction>;
}
