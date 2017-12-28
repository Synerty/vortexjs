import { TupleStorageServiceABC, TupleStorageTransaction } from "./TupleStorageServiceABC";
import { TupleOfflineStorageNameService } from "../TupleOfflineStorageNameService";
export declare class TupleStorageNullService extends TupleStorageServiceABC {
    constructor(name: TupleOfflineStorageNameService);
    open(): Promise<void>;
    isOpen(): boolean;
    close(): void;
    transaction(forWrite: boolean): Promise<TupleStorageTransaction>;
}
