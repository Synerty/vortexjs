import {Tuple} from "./Tuple";
import SerialiseUtil from "./SerialiseUtil";
import Jsonable from "./Jsonable";
import {assert} from "./UtilMisc";
import "./UtilArray";

import * as pako from "pako";
import * as base64 from "base-64";

/* Blob is undefined in NativeScript

// ----------------------------------------------------------------------------
// Deflate Worker
let deflateWorkerBlob = new Blob([`
importScripts("pako");
importScripts("base-64");


self.addEventListener('message', function (event) {
    let compressedData = pako.deflate(event.data, {to: "string"});
    let encodedData = base64.encode(compressedData);
    self.postMessage(encodedData, null);
}, false);
`], {type: 'text/javascript'});

let deflateWorkerBlobUrl = URL.createObjectURL(deflateWorkerBlob);

// ----------------------------------------------------------------------------
// Inflate Worker
let inflateWorkerBlob = new Blob([`
importScripts("pako");
importScripts("base-64");

self.addEventListener('message', function (event) {
    let compressedData = base64.decode(event.data);
    let jsonStr = pako.inflate(compressedData, {to: "string"});
    self.postMessage(jsonStr, null);
}, false);
`], {type: 'text/javascript'});

let inflateWorkerBlobUrl = URL.createObjectURL(inflateWorkerBlob);

*/


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
// Typescript date - date fooler
function now(): any {
    return new Date();
}


// ----------------------------------------------------------------------------
// Payload class

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

    static fromVortexMsg(vortexStr: string): Promise<Payload> {
        let start = now();

        return new Promise<Payload>((resolve, reject) => {

            let complete = (jsonStr) => {
                console.log(`Payload.fromVortexMsg decode+inflate took ${now() - start}`);
                start = now();

                let payload = new Payload()._fromJson(jsonStr);
                console.log(`Payload.fromVortexMsg _fromJson took ${now() - start}`);

                resolve(payload);
            };

            /*
             let worker = new Worker(inflateWorkerBlobUrl);

             worker.addEventListener('message', (event) => complete(event.data), false);

             worker.addEventListener('error', (error) => {
             let msg = `${dateStr()} ERROR: Payload fromVortexMsg failed : ${error}`;
             console.log(msg);
             reject(msg)
             }, false);

             // DISABLE WEB WORKER :-(
             worker.postMessage(vortexStr); // Send data to our worker.
             */

            let compressedData = base64.decode(vortexStr);
            let jsonStr = pako.inflate(compressedData, {to: "string"});
            complete(jsonStr);

        });
    }

    toVortexMsg(): Promise<string> {
        let start = now();

        return new Promise<string>((resolve, reject) => {

            let jsonStr = this._toJson();
            console.log(`Payload.toVortexMsg _toJson took ${now() - start}`);
            start = now();

            let complete = (jsonStr) => {
                console.log(`Payload.toVortexMsg deflate+encode took ${now() - start}`);
                resolve(jsonStr);
            };

            // DISABLE WEB WORKER :-(
            /*
             let worker = new Worker(deflateWorkerBlobUrl);
             worker.addEventListener('message', (event) => complete(event.data), false);

             worker.addEventListener('error', (error) => {
             let msg = `${dateStr()} ERROR: Payload toVortexMsg failed : ${error.toString()}`;
             console.log(msg);
             reject(msg)
             }, false);

             worker.postMessage(payloadStr); // Send data to our worker.
             */

            let compressedData = pako.deflate(jsonStr, {to: "string"});
            let encodedData = base64.encode(compressedData);
            complete(encodedData);

        });
    }
}