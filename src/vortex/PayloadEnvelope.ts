import {SerialiseUtil} from "./exports";
import {assert} from "./UtilMisc";
import "./UtilArray";
import {PayloadDelegateABC} from "./payload/PayloadDelegateABC";
import {PayloadDelegateInMainWeb} from "./payload/PayloadDelegateInMainWeb";
import {Payload} from "./Payload";
import {Jsonable} from './exports';


// ----------------------------------------------------------------------------
// Payload class

/**
 *
 * This class is serialised and transferred over the vortex to the server.
 */
export class PayloadEnvelope extends Jsonable {

    private static workerDelegate = new PayloadDelegateInMainWeb();

    static readonly vortexUuidKey = "__vortexUuid__";
    static readonly vortexNameKey = "__vortexName__";

    filt: {};
    encodedPayload: string | null;
    result: string | {} | null = null;
    date: Date | null = null;

    /**
     * Payload Envelope
     * This class is serialised and tranferred over the vortex to the server.
     * @param filt The filter that the server handler is listening for
     * @param encodedPayload: The encoded payload to go into this envelope
     * different location @depreciated
     * @param date The date for this envelope, it should match the payload.
     */
    constructor(filt: {} = {},
                encodedPayload: string | null = null,
                date: Date | null = null) {
        super();

        this.__rst = SerialiseUtil.T_RAPUI_PAYLOAD_ENVELOPE;

        this.filt = filt;
        this.encodedPayload = encodedPayload;

        this.date = date == null ? new Date() : this.date;

    }

    static setWorkerDelegate(delegate: PayloadDelegateABC) {
        PayloadEnvelope.workerDelegate = delegate;
    }

    // -------------------------------------------
    // Envelope method

    isEmpty() {
        // Ignore the connection start vortexUuid value
        // It's sent as the first response when we connect.
        for (let property in this.filt) {
            if (property === PayloadEnvelope.vortexUuidKey)
                continue;
            // Anything else, return false
            return false;
        }

        return (this.encodedPayload == null || this.encodedPayload.length === 0)
            && this.result == null;
    }

    decodePayload(): Promise<Payload> {
        if (this.encodedPayload == null || this.encodedPayload.length == 0)
            return Promise.reject("PayloadEnvelope: encodedPayload is empty");

        return Payload.fromEncodedPayload(this.encodedPayload);
    }

    // -------------------------------------------
    // JSON Related method

    private _fromJson(jsonStr: string): Promise<PayloadEnvelope> {
        return Promise.resolve(JSON.parse(jsonStr))
            .then((jsonDict) => {
                assert(jsonDict[Jsonable.JSON_CLASS_TYPE] === this.__rst);
                return this.fromJsonDict(jsonDict);
            });
    }

    private _toJson(): Promise<string> {
        return Promise.resolve(this.toJsonDict())
            .then((jsonDict) => JSON.stringify(jsonDict));
    }

    static fromVortexMsg(vortexStr: string): Promise<PayloadEnvelope> {
        const result = PayloadEnvelope.workerDelegate.decodeEnvelope(vortexStr)
            .then((jsonStr) => new PayloadEnvelope()._fromJson(jsonStr));
        return result;
    }

    toVortexMsg(): Promise<string> {
        return this._toJson()
            .then((jsonStr) => PayloadEnvelope.workerDelegate.encodeEnvelope(jsonStr));
    }

}
