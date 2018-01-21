import { TupleSelector } from "./TupleSelector";
import { Tuple } from "./Tuple";
import { TupleStorageFactoryService } from "./storage-factory/TupleStorageFactoryService";
import { TupleStorageTransaction } from "./storage/TupleStorageServiceABC";
import { TupleOfflineStorageNameService } from "./TupleOfflineStorageNameService";
export declare class TupleOfflineStorageService {
    private storage;
    constructor(storageFactory: TupleStorageFactoryService, tupleOfflineStorageServiceName: TupleOfflineStorageNameService);
    transaction(forWrite: boolean): Promise<TupleStorageTransaction>;
    loadTuples(tupleSelector: TupleSelector): Promise<Tuple[]>;
    loadTuplesEncoded(tupleSelector: TupleSelector): Promise<string | null>;
    saveTuples(tupleSelector: TupleSelector, tuples: Tuple[]): Promise<void>;
    saveTuplesEncoded(tupleSelector: TupleSelector, vortexMsg: string): Promise<void>;
    deleteTuples(tupleSelector: TupleSelector): Promise<void>;
    deleteOldTuples(deleteDataBeforeDate: Date): Promise<void>;
    truncateStorage(): Promise<void>;
}
