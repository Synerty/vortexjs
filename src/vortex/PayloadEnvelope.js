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
var PayloadDelegateABC_1 = require("./payload/PayloadDelegateABC");
var PayloadDelegateInMain_1 = require("./payload/PayloadDelegateInMain");
var Payload_1 = require("./Payload");
// ----------------------------------------------------------------------------
// Payload class
/**
 *
 * This class is serialised and transferred over the vortex to the server.
 */
var PayloadEnvelope = /** @class */ (function (_super) {
    __extends(PayloadEnvelope, _super);
    /**
     * Payload Envelope
     * This class is serialised and tranferred over the vortex to the server.
     * @param filt The filter that the server handler is listening for
     * @param encodedPayload: The encoded payload to go into this envelope
     * different location @depreciated
     * @param date The date for this envelope, it should match the payload.
     */
    function PayloadEnvelope(filt, encodedPayload, date) {
        if (filt === void 0) { filt = {}; }
        if (encodedPayload === void 0) { encodedPayload = null; }
        if (date === void 0) { date = null; }
        var _this = _super.call(this) || this;
        _this.result = null;
        _this.date = null;
        _this.__rst = SerialiseUtil_1.default.T_RAPUI_PAYLOAD;
        _this.filt = filt;
        _this.encodedPayload = encodedPayload;
        _this.date = date == null ? new Date() : _this.date;
        return _this;
    }
    PayloadEnvelope.setWorkerDelegate = function (delegate) {
        PayloadEnvelope.workerDelegate = delegate;
    };
    // -------------------------------------------
    // Envelope method
    PayloadEnvelope.prototype.isEmpty = function () {
        // Ignore the connection start vortexUuid value
        // It's sent as the first response when we connect.
        for (var property in this.filt) {
            if (property === PayloadEnvelope.vortexUuidKey)
                continue;
            // Anything else, return false
            return false;
        }
        return (this.encodedPayload == null || this.encodedPayload.length === 0)
            && this.result == null;
    };
    PayloadEnvelope.prototype.decodePayload = function () {
        if (this.encodedPayload == null || this.encodedPayload.length == 0)
            return Promise.reject("PayloadEnvelope: encodedPayload is empty");
        return Payload_1.Payload.fromEncodedPayload(this.encodedPayload);
    };
    // -------------------------------------------
    // JSON Related method
    PayloadEnvelope.prototype._fromJson = function (jsonStr) {
        var self = this;
        var jsonDict = JSON.parse(jsonStr);
        UtilMisc_1.assert(jsonDict[Jsonable_1.default.JSON_CLASS_TYPE] === self.__rst);
        return self.fromJsonDict(jsonDict);
    };
    PayloadEnvelope.prototype._toJson = function () {
        var self = this;
        var jsonDict = self.toJsonDict();
        return JSON.stringify(jsonDict);
    };
    PayloadEnvelope.fromVortexMsg = function (vortexStr) {
        var start = PayloadDelegateABC_1.now();
        return new Promise(function (resolve, reject) {
            PayloadEnvelope.workerDelegate.decodeEnvelope(vortexStr)
                .then(function (jsonStr) {
                var payload = new PayloadEnvelope()._fromJson(jsonStr);
                PayloadDelegateABC_1.logLong("PayloadEnvelope.fromVortexMsg _fromJson len=" + vortexStr.length, start, payload);
                resolve(payload);
            })
                .catch(function (err) {
                console.log("ERROR: fromVortexMsg " + err);
                reject(err);
            });
        });
    };
    PayloadEnvelope.prototype.toVortexMsg = function () {
        var _this = this;
        var start = PayloadDelegateABC_1.now();
        return new Promise(function (resolve, reject) {
            var jsonStr = _this._toJson();
            PayloadDelegateABC_1.logLong("PayloadEnvelope.toVortexMsg _toJson len=" + jsonStr.length, start, _this);
            start = PayloadDelegateABC_1.now();
            PayloadEnvelope.workerDelegate.encodeEnvelope(jsonStr)
                .then(function (jsonStr) {
                PayloadDelegateABC_1.logLong("PayloadEnvelope.toVortexMsg encodeEnvelope len=" + jsonStr.length, start, _this);
                resolve(jsonStr);
            })
                .catch(function (err) {
                console.log("ERROR: toVortexMsg " + err);
                reject(err);
            });
        });
    };
    PayloadEnvelope.workerDelegate = new PayloadDelegateInMain_1.PayloadDelegateInMain();
    PayloadEnvelope.vortexUuidKey = "__vortexUuid__";
    PayloadEnvelope.vortexNameKey = "__vortexName__";
    return PayloadEnvelope;
}(Jsonable_1.default));
exports.PayloadEnvelope = PayloadEnvelope;
//# sourceMappingURL=/Users/jchesney/project/vortexjs/src/vortex/PayloadEnvelope.js.map