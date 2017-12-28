import { Payload } from "../Payload";
import { TupleActionABC } from "../TupleAction";
export declare abstract class TupleActionStorageServiceABC {
    abstract storeAction(scope: string, tupleAction: TupleActionABC, payload: Payload): Promise<void>;
    abstract loadNextAction(): Promise<Payload>;
    abstract countActions(): Promise<number>;
    abstract deleteAction(scope: string, actionUuid: number): Promise<void>;
}