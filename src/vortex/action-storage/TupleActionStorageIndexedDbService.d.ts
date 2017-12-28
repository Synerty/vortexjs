import { Payload } from "../Payload";
import { TupleActionStorageServiceABC } from "./TupleActionStorageServiceABC";
import { TupleActionABC } from "../TupleAction";
/** Tuple Storage IndexedDB
 *
 * This class handles storing and retrieving tuples to/from indexed db.
 *
 */
export declare class TupleActionStorageIndexedDbService extends TupleActionStorageServiceABC {
    private db;
    private openInProgressPromise;
    constructor();
    storeAction(scope: string, tupleAction: TupleActionABC, payload: Payload): Promise<void>;
    loadNextAction(): Promise<Payload>;
    countActions(): Promise<number>;
    deleteAction(scope: string, actionUuid: number): Promise<void>;
    open(): Promise<void>;
    isOpen(): boolean;
    close(): void;
    transaction(forWrite: boolean): Promise<any>;
}
