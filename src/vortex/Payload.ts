import {Tuple} from "./Tuple";
import SerialiseUtil from "./SerialiseUtil";
import Jsonable from "./Jsonable";
import {assert} from "./UtilMisc";
import "./UtilArray";

var base64 = require('base-64');

// Typedef for require
declare let require: any;

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
export class Payload extends Jsonable {

    static readonly vortexUuidKey = "__vortexUuid__";
    static readonly vortexNameKey = "__vortexName__";

    filt: {};
    tuples: Array<Tuple|any>;
    result: string | {} | null = null;
    date: Date | null = null;

    /**
     * Payload
     * This class is serialised and tranferred over the vortex to the server.
     * @param filt The filter that the server handler is listening for
     * @param tuples: The tuples to init the Payload with
     * different location @depreciated
     */
    constructor(filt: {} = {}, tuples: Array<Tuple|any> = []) {
        super();
        let self = this;

        self.__rapuiSerialiseType__ = SerialiseUtil.T_RAPUI_PAYLOAD;

        self.filt = filt;
        self.tuples = tuples;

    }

    isEmpty() {
        let self = this;

        // Ignore the connection start vortexUuid value
        // It's sent as the first response when we connect.
        for (let property in self.filt) {
            if (property === Payload.vortexUuidKey)
                continue;
            // Anything else, return false
            return false;
        }

        return (self.tuples.length === 0 && self.result == null);
    }

// -------------------------------------------
// JSON Related method

    private _fromJson(jsonStr: string): Payload {
        let self = this;
        let jsonDict = JSON.parse(jsonStr);

        assert(jsonDict[Jsonable.JSON_CLASS_TYPE] === self.__rapuiSerialiseType__);
        return self.fromJsonDict(jsonDict);
    }

    private _toJson(): string {
        let self = this;
        let jsonDict = self.toJsonDict();
        return JSON.stringify(jsonDict);
    }

    static fromVortexMsg(vortexStr: string): Payload {

        // Convert the string to binary
        let compressedData = base64.decode(vortexStr);

        // Decompress the payload string
        let pako = require("pako");
        let payloadStr = pako.inflate(compressedData, {to: "string"});

        /* Log compression sizes
         console.log(dateStr() + 'Payload: Payload Compression ' + compressedData.length
         + ' -> ' + payloadStr.length
         + ' ('
         + (100 * compressedData.length / payloadStr.length).toFixed(1)
         + '%)');
         */

        // return Payload()._fromXmlDocStr(payloadStr);
        return new Payload()._fromJson(payloadStr);
    }

    toVortexMsg(): string {
        let self = this;

        // Serialise it to string
        // var payloadStr = self._toXmlDocStr();
        let payloadStr = self._toJson();

        // Compress it
        let pako = require("pako");
        let compressedData = pako.deflate(payloadStr, {to: "string"});
        return base64.encode(compressedData);
    }
}