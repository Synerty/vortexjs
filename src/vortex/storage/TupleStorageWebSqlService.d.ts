import { WebSqlFactoryService } from "../../websql/WebSqlService";
import { TupleStorageServiceABC, TupleStorageTransaction } from "./TupleStorageServiceABC";
import { TupleOfflineStorageNameService } from "../TupleOfflineStorageNameService";
export declare class TupleStorageWebSqlService extends TupleStorageServiceABC {
    private webSql;
    private openInProgressPromise;
    constructor(webSqlFactory: WebSqlFactoryService, name: TupleOfflineStorageNameService);
    open(): Promise<void>;
    isOpen(): boolean;
    close(): void;
    truncateStorage(): Promise<void>;
    transaction(forWrite: boolean): Promise<TupleStorageTransaction>;
}
