import Jsonable from "./Jsonable";
import "./UtilArray";
import { PayloadDelegateABC } from "./payload/PayloadDelegateABC";
import { Payload } from "./Payload";
/**
 *
 * This class is serialised and transferred over the vortex to the server.
 */
export declare class PayloadEnvelope extends Jsonable {
    private static workerDelegate;
    static readonly vortexUuidKey = "__vortexUuid__";
    static readonly vortexNameKey = "__vortexName__";
    filt: {};
    encodedPayload: string | null;
    result: string | {} | null;
    date: Date | null;
    /**
     * Payload Envelope
     * This class is serialised and tranferred over the vortex to the server.
     * @param filt The filter that the server handler is listening for
     * @param encodedPayload: The encoded payload to go into this envelope
     * different location @depreciated
     * @param date The date for this envelope, it should match the payload.
     */
    constructor(filt?: {}, encodedPayload?: string | null, date?: Date | null);
    static setWorkerDelegate(delegate: PayloadDelegateABC): void;
    isEmpty(): boolean;
    decodePayload(): Promise<Payload>;
    private _fromJson;
    private _toJson;
    static fromVortexMsg(vortexStr: string): Promise<PayloadEnvelope>;
    toVortexMsg(): Promise<string>;
}
