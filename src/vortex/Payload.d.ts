import { Tuple } from "./Tuple";
import Jsonable from "./Jsonable";
import "./UtilArray";
import { PayloadDelegateABC } from "./payload/PayloadDelegateABC";
/**
 * IPayloadFilt
 * This interface defines the structure for a valid payload filter.
 */
export interface IPayloadFilt {
    key: string;
    [more: string]: any;
}
/**
 *
 * This class is serialised and transferred over the vortex to the server.
 */
export declare class Payload extends Jsonable {
    private static workerDelegate;
    static readonly vortexUuidKey: string;
    static readonly vortexNameKey: string;
    filt: {};
    tuples: Array<Tuple | any>;
    result: string | {} | null;
    date: Date | null;
    /**
     * Payload
     * This class is serialised and tranferred over the vortex to the server.
     * @param filt The filter that the server handler is listening for
     * @param tuples: The tuples to init the Payload with
     * different location @depreciated
     */
    constructor(filt?: {}, tuples?: Array<Tuple | any>);
    static setWorkerDelegate(delegate: PayloadDelegateABC): void;
    isEmpty(): boolean;
    private _fromJson(jsonStr);
    private _toJson();
    static fromVortexMsg(vortexStr: string): Promise<Payload>;
    toVortexMsg(): Promise<string>;
}
