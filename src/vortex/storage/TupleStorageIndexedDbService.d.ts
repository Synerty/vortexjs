import { TupleStorageServiceABC, TupleStorageTransaction } from "./TupleStorageServiceABC";
import { TupleOfflineStorageNameService } from "../TupleOfflineStorageNameService";
/** Tuple Storage IndexedDB
 *
 * This class handles storing and retrieving tuples to/from indexed db.
 *
 */
export declare class TupleStorageIndexedDbService extends TupleStorageServiceABC {
    db: any;
    private openInProgressPromise;
    constructor(name: TupleOfflineStorageNameService);
    open(): Promise<void>;
    isOpen(): boolean;
    close(): void;
    truncateStorage(): Promise<void>;
    transaction(forWrite: boolean): Promise<TupleStorageTransaction>;
}
