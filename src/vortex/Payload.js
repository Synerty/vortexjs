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
var PayloadDelegateInMain_1 = require("./payload/PayloadDelegateInMain");
var PayloadDelegateABC_1 = require("./payload/PayloadDelegateABC");
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
    Payload.setWorkerDelegate = function (delegate) {
        Payload.workerDelegate = delegate;
    };
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
        var start = PayloadDelegateABC_1.now();
        return new Promise(function (resolve, reject) {
            Payload.workerDelegate.decodeAndInflate(vortexStr)
                .then(function (jsonStr) {
                PayloadDelegateABC_1.logLong('Payload.fromVortexMsg decode+inflate', start);
                return jsonStr;
            })
                .then(function (jsonStr) {
                start = PayloadDelegateABC_1.now();
                var payload = new Payload()._fromJson(jsonStr);
                PayloadDelegateABC_1.logLong('Payload.fromVortexMsg _fromJson', start, payload);
                resolve(payload);
            })
                .catch(function (e) { return console.log("ERROR: toVortexMsg " + e); });
        });
    };
    Payload.prototype.toVortexMsg = function () {
        var _this = this;
        var start = PayloadDelegateABC_1.now();
        return new Promise(function (resolve, reject) {
            var jsonStr = _this._toJson();
            PayloadDelegateABC_1.logLong('Payload.toVortexMsg _toJson', start, _this);
            start = PayloadDelegateABC_1.now();
            Payload.workerDelegate.deflateAndEncode(jsonStr)
                .then(function (jsonStr) {
                PayloadDelegateABC_1.logLong('Payload.toVortexMsg deflate+encode', start, _this);
                resolve(jsonStr);
            })
                .catch(function (e) { return console.log("ERROR: toVortexMsg " + e); });
        });
    };
    return Payload;
}(Jsonable_1.default));
Payload.workerDelegate = new PayloadDelegateInMain_1.PayloadDelegateInMain();
Payload.vortexUuidKey = "__vortexUuid__";
Payload.vortexNameKey = "__vortexName__";
exports.Payload = Payload;
//# sourceMappingURL=/Users/jchesney/project/vortexjs/src/vortex/Payload.js.map