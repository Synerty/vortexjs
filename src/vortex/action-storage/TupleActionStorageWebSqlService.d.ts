import { TupleActionABC } from "../TupleAction";
import { WebSqlFactoryService } from "../../websql/WebSqlService";
import { Payload } from "../Payload";
import { TupleActionStorageServiceABC } from "./TupleActionStorageServiceABC";
export declare class TupleActionStorageWebSqlService extends TupleActionStorageServiceABC {
    private webSqlFactory;
    private webSql;
    constructor(webSqlFactory: WebSqlFactoryService);
    storeAction(scope: string, tupleAction: TupleActionABC, payload: Payload): Promise<void>;
    loadNextAction(): Promise<Payload>;
    countActions(): Promise<number>;
    deleteAction(scope: string, actionUuid: number): Promise<void>;
}
