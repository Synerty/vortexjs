import SerialiseUtil from "./SerialiseUtil";
import Jsonable from "./Jsonable";
import {assert} from "./UtilMisc";
import "./UtilArray";
import {logLong, now, PayloadDelegateABC} from "./payload/PayloadDelegateABC";
import {PayloadDelegateInMain} from "./payload/PayloadDelegateInMain";
import {Payload} from "./Payload";


// ----------------------------------------------------------------------------
// Payload class

/**
 *
 * This class is serialised and transferred over the vortex to the server.
 */
export class PayloadEnvelope extends Jsonable {

    private static workerDelegate = new PayloadDelegateInMain();

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

    private _fromJson(jsonStr: string): PayloadEnvelope {
        let self = this;
        let jsonDict = JSON.parse(jsonStr);

        assert(jsonDict[Jsonable.JSON_CLASS_TYPE] === self.__rst);
        return self.fromJsonDict(jsonDict);
    }

    private _toJson(): string {
        let self = this;
        let jsonDict = self.toJsonDict();
        return JSON.stringify(jsonDict);
    }

    static fromVortexMsg(vortexStr: string): Promise<PayloadEnvelope> {
        let start = now();

        return new Promise<PayloadEnvelope>((resolve, reject) => {

            PayloadEnvelope.workerDelegate.decodeEnvelope(vortexStr)
                .then((jsonStr) => {

                    let payload = new PayloadEnvelope()._fromJson(jsonStr);
                    logLong(`PayloadEnvelope.fromVortexMsg _fromJson len=${vortexStr.length}`, start, payload);

                    resolve(payload);
                })
                .catch((err) => {
                    console.log(`ERROR: fromVortexMsg ${err}`);
                    reject(err);
                });

        });
    }

    toVortexMsg(): Promise<string> {
        let start = now();

        return new Promise<string>((resolve, reject) => {

            let jsonStr = this._toJson();
            logLong(`PayloadEnvelope.toVortexMsg _toJson len=${jsonStr.length}`, start, this);
            start = now();

            PayloadEnvelope.workerDelegate.encodeEnvelope(jsonStr)
                .then((jsonStr) => {
                    logLong(`PayloadEnvelope.toVortexMsg encodeEnvelope len=${jsonStr.length}`, start, this);
                    resolve(jsonStr);
                })
                .catch((err) => {
                    console.log(`ERROR: toVortexMsg ${err}`);
                    reject(err);
                });

        });
    }

}
