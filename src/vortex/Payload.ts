import {Tuple} from "./Tuple";
import SerialiseUtil from "./SerialiseUtil";
import Jsonable from "./Jsonable";
import {assert} from "./UtilMisc";
import "./UtilArray";
import {PayloadDelegateInMain} from "./payload/PayloadDelegateInMain";
import {logLong, now, PayloadDelegateABC} from "./payload/PayloadDelegateABC";


// ----------------------------------------------------------------------------
// Types

/**
 * IPayloadFilt
 * This interface defines the structure for a valid payload filter.
 */
export interface IPayloadFilt {
    key: string;

    [more: string]: any;
}

// ----------------------------------------------------------------------------
// Payload class

/**
 *
 * This class is serialised and transferred over the vortex to the server.
 */
export class Payload extends Jsonable {

    private static workerDelegate = new PayloadDelegateInMain();

    filt: {};
    tuples: Array<Tuple | any>;
    date: Date | null = null;

    /**
     * Payload
     * This class is serialised and tranferred over the vortex to the server.
     * @param filt The filter that the server handler is listening for
     * @param tuples: The tuples to init the Payload with
     * different location @depreciated
     * @param date The date for this envelope, it should match the payload.
     */
    constructor(filt: {} = {},
                tuples: Array<Tuple | any> = [],
                date: Date | null = null) {
        super();

        this.__rst = SerialiseUtil.T_RAPUI_PAYLOAD;

        this.filt = filt;
        this.tuples = tuples;
        this.date = date == null ? new Date() : this.date;

    }

    static setWorkerDelegate(delegate: PayloadDelegateABC) {
        Payload.workerDelegate = delegate;
    }

    // -------------------------------------------
    // JSON Related method

    private _fromJson(jsonStr: string): Payload {
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

    static fromEncodedPayload(encodedPayloadStr: string): Promise<Payload> {
        let start = now();

        return new Promise<Payload>((resolve, reject) => {

            Payload.workerDelegate.decodeAndInflate(encodedPayloadStr)
                .then((jsonStr) => {
                    logLong(`Payload.fromEncodedPayload decode+inflate len=${encodedPayloadStr.length}`, start);
                    start = now();

                    let payload = new Payload()._fromJson(jsonStr);
                    logLong(`Payload.fromEncodedPayload _fromJson len=${encodedPayloadStr.length}`, start, payload);

                    resolve(payload);
                })
                .catch((err) => {
                    console.log(`ERROR: fromEncodedPayload ${err}`);
                    reject(err);
                });

        });
    }

    toEncodedPayload(): Promise<string> {
        let start = now();

        return new Promise<string>((resolve, reject) => {

            let jsonStr = this._toJson();
            logLong(`Payload.toEncodedPayload _toJson len=${jsonStr.length}`, start, this);
            start = now();

            Payload.workerDelegate.deflateAndEncode(jsonStr)
                .then((jsonStr) => {
                    logLong(`Payload.toEncodedPayload deflate+encode len=${jsonStr.length}`, start, this);
                    resolve(jsonStr);
                })
                .catch((err) => {
                    console.log(`ERROR: toEncodedPayload ${err}`);
                    reject(err);
                });

        });
    }

    makePayloadEnvelope(): Promise<any> {
        let PayloadEnvelopeMod = require("./PayloadEnvelope");
        return this.toEncodedPayload()
            .then(encodedThis => new PayloadEnvelopeMod.PayloadEnvelope(
                this.filt,
                encodedThis,
                this.date
            ));
    }

}
