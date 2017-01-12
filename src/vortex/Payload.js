"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var SerialiseUtil_1 = require("./SerialiseUtil");
var Jsonable_1 = require("./Jsonable");
var UtilMisc_1 = require("./UtilMisc");
require("./UtilArray");
var base64 = require('base-64');
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
        self.__rapuiSerialiseType__ = SerialiseUtil_1.default.T_RAPUI_PAYLOAD;
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
        UtilMisc_1.assert(jsonDict[Jsonable_1.default.JSON_CLASS_TYPE] === self.__rapuiSerialiseType__);
        return self.fromJsonDict(jsonDict);
    };
    Payload.prototype._toJson = function () {
        var self = this;
        var jsonDict = self.toJsonDict();
        return JSON.stringify(jsonDict);
    };
    Payload.fromVortexMsg = function (vortexStr) {
        // Convert the string to binary
        var compressedData = base64.decode(vortexStr);
        // Decompress the payload string
        var pako = require("pako");
        var payloadStr = pako.inflate(compressedData, { to: "string" });
        /* Log compression sizes
         console.log(dateStr() + 'Payload: Payload Compression ' + compressedData.length
         + ' -> ' + payloadStr.length
         + ' ('
         + (100 * compressedData.length / payloadStr.length).toFixed(1)
         + '%)');
         */
        // return Payload()._fromXmlDocStr(payloadStr);
        return new Payload()._fromJson(payloadStr);
    };
    Payload.prototype.toVortexMsg = function () {
        var self = this;
        // Serialise it to string
        // var payloadStr = self._toXmlDocStr();
        var payloadStr = self._toJson();
        // Compress it
        var pako = require("pako");
        var compressedData = pako.deflate(payloadStr, { to: "string" });
        return base64.encode(compressedData);
    };
    return Payload;
}(Jsonable_1.default));
Payload.vortexUuidKey = "__vortexUuid__";
Payload.vortexNameKey = "__vortexName__";
exports.Payload = Payload;
//# sourceMappingURL=Payload.js.map