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
var PayloadDelegateInMainWeb_1 = require("./payload/PayloadDelegateInMainWeb");
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
        var _this = this;
        return Promise.resolve(JSON.parse(jsonStr))
            .then(function (jsonDict) {
            UtilMisc_1.assert(jsonDict[Jsonable_1.default.JSON_CLASS_TYPE] === _this.__rst);
            return _this.fromJsonDict(jsonDict);
        });
    };
    Payload.prototype._toJson = function () {
        return Promise.resolve(this.toJsonDict())
            .then(function (jsonDict) { return JSON.stringify(jsonDict); });
    };
    Payload.fromEncodedPayload = function (encodedPayloadStr) {
        return Payload.workerDelegate.decodeAndInflate(encodedPayloadStr)
            .then(function (jsonStr) { return new Payload()._fromJson(jsonStr); });
    };
    Payload.prototype.toEncodedPayload = function () {
        return this._toJson()
            .then(function (jsonStr) { return Payload.workerDelegate.deflateAndEncode(jsonStr); });
    };
    Payload.prototype.makePayloadEnvelope = function () {
        var _this = this;
        var PayloadEnvelopeMod = require("./PayloadEnvelope");
        return this.toEncodedPayload()
            .then(function (encodedThis) { return new PayloadEnvelopeMod.PayloadEnvelope(_this.filt, encodedThis, _this.date); });
    };
    Payload.workerDelegate = new PayloadDelegateInMainWeb_1.PayloadDelegateInMainWeb();
    return Payload;
}(Jsonable_1.default));
exports.Payload = Payload;
//# sourceMappingURL=/Users/jchesney/dev-peek-util/vortexjs/src/vortex/Payload.js.map