"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
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
var PayloadDelegateInMainWeb_1 = require("./payload/PayloadDelegateInMainWeb");
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
        _this.__rst = SerialiseUtil_1.default.T_RAPUI_PAYLOAD_ENVELOPE;
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
        var _this = this;
        return Promise.resolve(JSON.parse(jsonStr))
            .then(function (jsonDict) {
            UtilMisc_1.assert(jsonDict[Jsonable_1.default.JSON_CLASS_TYPE] === _this.__rst);
            return _this.fromJsonDict(jsonDict);
        });
    };
    PayloadEnvelope.prototype._toJson = function () {
        return Promise.resolve(this.toJsonDict())
            .then(function (jsonDict) { return JSON.stringify(jsonDict); });
    };
    PayloadEnvelope.fromVortexMsg = function (vortexStr) {
        return PayloadEnvelope.workerDelegate.decodeEnvelope(vortexStr)
            .then(function (jsonStr) { return new PayloadEnvelope()._fromJson(jsonStr); });
    };
    PayloadEnvelope.prototype.toVortexMsg = function () {
        return this._toJson()
            .then(function (jsonStr) { return PayloadEnvelope.workerDelegate.encodeEnvelope(jsonStr); });
    };
    PayloadEnvelope.workerDelegate = new PayloadDelegateInMainWeb_1.PayloadDelegateInMainWeb();
    PayloadEnvelope.vortexUuidKey = "__vortexUuid__";
    PayloadEnvelope.vortexNameKey = "__vortexName__";
    return PayloadEnvelope;
}(Jsonable_1.default));
exports.PayloadEnvelope = PayloadEnvelope;
//# sourceMappingURL=PayloadEnvelope.js.map