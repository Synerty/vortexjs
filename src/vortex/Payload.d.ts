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
    filt: {};
    tuples: Array<Tuple | any>;
    date: Date | null;
    /**
     * Payload
     * This class is serialised and tranferred over the vortex to the server.
     * @param filt The filter that the server handler is listening for
     * @param tuples: The tuples to init the Payload with
     * different location @depreciated
     * @param date The date for this envelope, it should match the payload.
     */
    constructor(filt?: {}, tuples?: Array<Tuple | any>, date?: Date | null);
    static setWorkerDelegate(delegate: PayloadDelegateABC): void;
    private _fromJson;
    private _toJson;
    static fromEncodedPayload(encodedPayloadStr: string): Promise<Payload>;
    toEncodedPayload(): Promise<string>;
    makePayloadEnvelope(): Promise<any>;
}
