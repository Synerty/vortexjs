"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var SerialiseUtil_1 = require("./SerialiseUtil");
var Jsonable_1 = require("./Jsonable");
var UtilMisc_1 = require("./UtilMisc");
require("./UtilArray");
var pako = require("pako");
var base64 = require("base-64");
// ----------------------------------------------------------------------------
// Typescript date - date fooler
function now() {
    return new Date();
}
// ----------------------------------------------------------------------------
// Payload class
/**
 *
 * This class is serialised and transferred over the vortex to the server.
 */
var Payload = (function (_super) {
    __extends(Payload, _super);
    /**
     * Payload
     * This class is serialised and tranferred over the vortex to the server.
     * @param filt The filter that the server handler is listening for
     * @param tuples: The tuples to init the Payload with
     * different location @depreciated
     */
    function Payload(filt, tuples) {
        if (filt === void 0) { filt = {}; }
        if (tuples === void 0) { tuples = []; }
        var _this = _super.call(this) || this;
        _this.result = null;
        _this.date = null;
        var self = _this;
        self.__rst = SerialiseUtil_1.default.T_RAPUI_PAYLOAD;
        self.filt = filt;
        self.tuples = tuples;
        return _this;
    }
    Payload.prototype.isEmpty = function () {
        var self = this;
        // Ignore the connection start vortexUuid value
        // It's sent as the first response when we connect.
        for (var property in self.filt) {
            if (property === Payload.vortexUuidKey)
                continue;
            // Anything else, return false
            return false;
        }
        return (self.tuples.length === 0 && self.result == null);
    };
    // -------------------------------------------
    // JSON Related method
    Payload.prototype._fromJson = function (jsonStr) {
        var self = this;
        var jsonDict = JSON.parse(jsonStr);
        UtilMisc_1.assert(jsonDict[Jsonable_1.default.JSON_CLASS_TYPE] === self.__rst);
        return self.fromJsonDict(jsonDict);
    };
    Payload.prototype._toJson = function () {
        var self = this;
        var jsonDict = self.toJsonDict();
        return JSON.stringify(jsonDict);
    };
    Payload.fromVortexMsg = function (vortexStr) {
        var start = now();
        return new Promise(function (resolve, reject) {
            var complete = function (jsonStr) {
                console.log("Payload.fromVortexMsg decode+inflate took " + (now() - start));
                start = now();
                var payload = new Payload()._fromJson(jsonStr);
                console.log("Payload.fromVortexMsg _fromJson took " + (now() - start));
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
            var compressedData = window["atob"] != null
                ? atob(vortexStr)
                : base64.decode(vortexStr);
            var jsonStr = pako.inflate(compressedData, { to: "string" });
            complete(jsonStr);
        });
    };
    Payload.prototype.toVortexMsg = function () {
        var _this = this;
        var start = now();
        return new Promise(function (resolve, reject) {
            var jsonStr = _this._toJson();
            console.log("Payload.toVortexMsg _toJson took " + (now() - start));
            start = now();
            var complete = function (jsonStr) {
                console.log("Payload.toVortexMsg deflate+encode took " + (now() - start));
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
            var compressedData = pako.deflate(jsonStr, { to: "string" });
            var encodedData = window["btoa"] != null
                ? btoa(compressedData)
                : base64.encode(compressedData);
            complete(encodedData);
        });
    };
    return Payload;
}(Jsonable_1.default));
Payload.vortexUuidKey = "__vortexUuid__";
Payload.vortexNameKey = "__vortexName__";
exports.Payload = Payload;
//# sourceMappingURL=/home/peek/project/vortexjs/src/vortex/Payload.js.map