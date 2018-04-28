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
var Payload = /** @class */ (function (_super) {
    __extends(Payload, _super);
    /**
     * Payload
     * This class is serialised and tranferred over the vortex to the server.
     * @param filt The filter that the server handler is listening for
     * @param tuples: The tuples to init the Payload with
     * different location @depreciated
     * @param date The date for this envelope, it should match the payload.
     */
    function Payload(filt, tuples, date) {
        if (filt === void 0) { filt = {}; }
        if (tuples === void 0) { tuples = []; }
        if (date === void 0) { date = null; }
        var _this = _super.call(this) || this;
        _this.date = null;
        _this.__rst = SerialiseUtil_1.default.T_RAPUI_PAYLOAD;
        _this.filt = filt;
        _this.tuples = tuples;
        _this.date = date == null ? new Date() : _this.date;
        return _this;
    }
    Payload.setWorkerDelegate = function (delegate) {
        Payload.workerDelegate = delegate;
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
    Payload.fromEncodedPayload = function (encodedPayloadStr) {
        var start = PayloadDelegateABC_1.now();
        return new Promise(function (resolve, reject) {
            Payload.workerDelegate.decodeAndInflate(encodedPayloadStr)
                .then(function (jsonStr) {
                PayloadDelegateABC_1.logLong("Payload.fromEncodedPayload decode+inflate len=" + encodedPayloadStr.length, start);
                start = PayloadDelegateABC_1.now();
                var payload = new Payload()._fromJson(jsonStr);
                PayloadDelegateABC_1.logLong("Payload.fromEncodedPayload _fromJson len=" + encodedPayloadStr.length, start, payload);
                resolve(payload);
            })
                .catch(function (err) {
                console.log("ERROR: fromEncodedPayload " + err);
                reject(err);
            });
        });
    };
    Payload.prototype.toEncodedPayload = function () {
        var _this = this;
        var start = PayloadDelegateABC_1.now();
        return new Promise(function (resolve, reject) {
            var jsonStr = _this._toJson();
            PayloadDelegateABC_1.logLong("Payload.toEncodedPayload _toJson len=" + jsonStr.length, start, _this);
            start = PayloadDelegateABC_1.now();
            Payload.workerDelegate.deflateAndEncode(jsonStr)
                .then(function (jsonStr) {
                PayloadDelegateABC_1.logLong("Payload.toEncodedPayload deflate+encode len=" + jsonStr.length, start, _this);
                resolve(jsonStr);
            })
                .catch(function (err) {
                console.log("ERROR: toEncodedPayload " + err);
                reject(err);
            });
        });
    };
    Payload.prototype.makePayloadEnvelope = function () {
        var _this = this;
        var PayloadEnvelopeMod = require("./PayloadEnvelope");
        return this.toEncodedPayload()
            .then(function (encodedThis) { return new PayloadEnvelopeMod.PayloadEnvelope(_this.filt, encodedThis, _this.date); });
    };
    Payload.workerDelegate = new PayloadDelegateInMain_1.PayloadDelegateInMain();
    return Payload;
}(Jsonable_1.default));
exports.Payload = Payload;
//# sourceMappingURL=/Users/jchesney/project/vortexjs/src/vortex/Payload.js.map