import { assert } from "./UtilMisc"
import "./UtilArray"
import { PayloadDelegateInMainWeb } from "./payload/PayloadDelegateInMainWeb"
import { PayloadDelegateABC } from "./payload/PayloadDelegateABC"
import { PayloadEnvelope } from "./PayloadEnvelope"
import { Jsonable, SerialiseUtil, Tuple } from "./exports"

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
    
    private static workerDelegate = new PayloadDelegateInMainWeb()
    
    filt: {}
    tuples: Array<Tuple | any>
    date: Date | null = null
    
    /**
     * Payload
     * This class is serialised and tranferred over the vortex to the server.
     * @param filt The filter that the server handler is listening for
     * @param tuples: The tuples to init the Payload with
     * different location @depreciated
     * @param date The date for this envelope, it should match the payload.
     */
    constructor(
        filt: {} = {},
        tuples: Array<Tuple | any> = [],
        date: Date | null = null
    ) {
        super()
        
        this.__rst = SerialiseUtil.T_RAPUI_PAYLOAD
        
        this.filt = filt
        this.tuples = tuples
        this.date = date == null ? new Date() : this.date
        
    }
    
    static setWorkerDelegate(delegate: PayloadDelegateABC) {
        Payload.workerDelegate = delegate
    }
    
    // -------------------------------------------
    // JSON Related method
    
    private _fromJson(jsonStr: string): Promise<Payload> {
        return Promise.resolve(JSON.parse(jsonStr))
            .then((jsonDict) => {
                assert(jsonDict[Jsonable.JSON_CLASS_TYPE] === this.__rst)
                return this.fromJsonDict(jsonDict)
            })
    }
    
    private _toJson(): Promise<string> {
        return Promise.resolve(this.toJsonDict())
            .then((jsonDict) => JSON.stringify(jsonDict))
    }
    
    static fromEncodedPayload(encodedPayloadStr: string): Promise<Payload> {
        const result = Payload.workerDelegate.decodeAndInflate(encodedPayloadStr)
            .then((jsonStr) => new Payload()._fromJson(jsonStr))
        return result
    }
    
    toEncodedPayload(): Promise<string> {
        return this._toJson()
            .then((jsonStr) => Payload.workerDelegate.deflateAndEncode(jsonStr))
    }
    
    makePayloadEnvelope(): Promise<any> {
        return this.toEncodedPayload()
            .then(encodedThis => new PayloadEnvelope(
                this.filt,
                encodedThis,
                this.date
            ))
    }
    
}
