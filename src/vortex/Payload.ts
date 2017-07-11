import {Tuple} from "./Tuple";
import SerialiseUtil from "./SerialiseUtil";
import Jsonable from "./Jsonable";
import {assert} from "./UtilMisc";
import "./UtilArray";

let base64 = require('base-64');
let pako = require("pako");

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
function now(): any {
    return new Date();
}
/**
 *
 * This class is serialised and transferred over the vortex to the server.
 */
export class Payload extends Jsonable {

    static readonly vortexUuidKey = "__vortexUuid__";
    static readonly vortexNameKey = "__vortexName__";

    filt: {};
    tuples: Array<Tuple | any>;
    result: string | {} | null = null;
    date: Date | null = null;

    /**
     * Payload
     * This class is serialised and tranferred over the vortex to the server.
     * @param filt The filter that the server handler is listening for
     * @param tuples: The tuples to init the Payload with
     * different location @depreciated
     */
    constructor(filt: {} = {}, tuples: Array<Tuple | any> = []) {
        super();
        let self = this;

        self.__rst = SerialiseUtil.T_RAPUI_PAYLOAD;

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

        assert(jsonDict[Jsonable.JSON_CLASS_TYPE] === self.__rst);
        return self.fromJsonDict(jsonDict);
    }

    private _toJson(): string {
        let self = this;
        let jsonDict = self.toJsonDict();
        return JSON.stringify(jsonDict);
    }

    static fromVortexMsg(vortexStr: string): Payload {

        let start = now();
        // Convert the string to binary
        let compressedData = base64.decode(vortexStr);
        console.log(`Payload.fromVortexMsg decode took ${now() - start}`);
        start = now();

        // Decompress the payload string
        let payloadStr = pako.inflate(compressedData, {to: "string"});
        console.log(`Payload.fromVortexMsg inflate took ${now() - start}`);
        start = now();

        /* Log compression sizes
         console.log(dateStr() + 'Payload: Payload Compression ' + compressedData.length
         + ' -> ' + payloadStr.length
         + ' ('
         + (100 * compressedData.length / payloadStr.length).toFixed(1)
         + '%)');
         */
        let j = new Payload()._fromJson(payloadStr);
        console.log(`Payload.fromVortexMsg _fromJson took ${now() - start}`);
        start = now();

        return j;
    }

    toVortexMsg(): string {
        let self = this;

        let start = now();
        // Serialise it to string

        let payloadStr = self._toJson();
        console.log(`Payload.toVortexMsg toJson took ${now() - start}`);
        start = now();
        // Compress it
        let compressedData = pako.deflate(payloadStr, {to: "string"});
        console.log(`Payload.toVortexMsg deflate took ${now() - start}`);
        start = now();
        let enc = base64.encode(compressedData);
        console.log(`Payload.toVortexMsg encode took ${now() - start}`);
        return enc;
    }
}