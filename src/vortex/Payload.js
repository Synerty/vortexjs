"use strict";
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
                start = PayloadDelegateABC_1.now();
                var payload = new Payload()._fromJson(jsonStr);
                PayloadDelegateABC_1.logLong('Payload.fromVortexMsg _fromJson', start, payload);
                resolve(payload);
            })
                .catch(function (err) {
                console.log("ERROR: toVortexMsg " + err);
                reject(err);
            });
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
                .catch(function (err) {
                console.log("ERROR: toVortexMsg " + err);
                reject(err);
            });
        });
    };
    Payload.workerDelegate = new PayloadDelegateInMain_1.PayloadDelegateInMain();
    Payload.vortexUuidKey = "__vortexUuid__";
    Payload.vortexNameKey = "__vortexName__";
    return Payload;
}(Jsonable_1.default));
exports.Payload = Payload;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGF5bG9hZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIlBheWxvYWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSxpREFBNEM7QUFDNUMsdUNBQWtDO0FBQ2xDLHVDQUFvQztBQUNwQyx1QkFBcUI7QUFDckIseUVBQXdFO0FBQ3hFLG1FQUFnRjtBQWdCaEYsK0VBQStFO0FBQy9FLGdCQUFnQjtBQUVoQjs7O0dBR0c7QUFDSDtJQUE2QiwyQkFBUTtJQVluQzs7Ozs7O09BTUc7SUFDSCxpQkFBWSxJQUFhLEVBQUUsTUFBK0I7UUFBOUMscUJBQUEsRUFBQSxTQUFhO1FBQUUsdUJBQUEsRUFBQSxXQUErQjtRQUExRCxZQUNFLGlCQUFPLFNBUVI7UUFuQkQsWUFBTSxHQUF1QixJQUFJLENBQUM7UUFDbEMsVUFBSSxHQUFnQixJQUFJLENBQUM7UUFXdkIsSUFBSSxJQUFJLEdBQUcsS0FBSSxDQUFDO1FBRWhCLElBQUksQ0FBQyxLQUFLLEdBQUcsdUJBQWEsQ0FBQyxlQUFlLENBQUM7UUFFM0MsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLENBQUM7UUFDakIsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7O0lBRXZCLENBQUM7SUFFTSx5QkFBaUIsR0FBeEIsVUFBeUIsUUFBNEI7UUFDbkQsT0FBTyxDQUFDLGNBQWMsR0FBRyxRQUFRLENBQUM7SUFDcEMsQ0FBQztJQUVELHlCQUFPLEdBQVA7UUFDRSxJQUFJLElBQUksR0FBRyxJQUFJLENBQUM7UUFFaEIsK0NBQStDO1FBQy9DLG1EQUFtRDtRQUNuRCxHQUFHLENBQUMsQ0FBQyxJQUFJLFFBQVEsSUFBSSxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztZQUMvQixFQUFFLENBQUMsQ0FBQyxRQUFRLEtBQUssT0FBTyxDQUFDLGFBQWEsQ0FBQztnQkFDckMsUUFBUSxDQUFDO1lBQ1gsOEJBQThCO1lBQzlCLE1BQU0sQ0FBQyxLQUFLLENBQUM7UUFDZixDQUFDO1FBRUQsTUFBTSxD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SUEwR25ELGNBQUM7Q0FBQSxBQS9HRCxDQUE2QixrQkFBUSxHQStHcEM7QUEvR1ksMEJBQU8iLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBUdXBsZSB9IGZyb20gXCIuL1R1cGxlXCI7XG5pbXBvcnQgU2VyaWFsaXNlVXRpbCBmcm9tIFwiLi9TZXJpYWxpc2VVdGlsXCI7XG5pbXBvcnQgSnNvbmFibGUgZnJvbSBcIi4vSnNvbmFibGVcIjtcbmltcG9ydCB7IGFzc2VydCB9IGZyb20gXCIuL1V0aWxNaXNjXCI7XG5pbXBvcnQgXCIuL1V0aWxBcnJheVwiO1xuaW1wb3J0IHsgUGF5bG9hZERlbGVnYXRlSW5NYWluIH0gZnJvbSBcIi4vcGF5bG9hZC9QYXlsb2FkRGVsZWdhdGVJbk1haW5cIjtcbmltcG9ydCB7IGxvZ0xvbmcsIG5vdywgUGF5bG9hZERlbGVnYXRlQUJDIH0gZnJvbSBcIi4vcGF5bG9hZC9QYXlsb2FkRGVsZWdhdGVBQkNcIjtcblxuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBUeXBlc1xuXG4vKipcbiAqIElQYXlsb2FkRmlsdFxuICogVGhpcyBpbnRlcmZhY2UgZGVmaW5lcyB0aGUgc3RydWN0dXJlIGZvciBhIHZhbGlkIHBheWxvYWQgZmlsdGVyLlxuICovXG5leHBvcnQgaW50ZXJmYWNlIElQYXlsb2FkRmlsdCB7XG4gIGtleTogc3RyaW5nO1xuXG4gIFttb3JlOiBzdHJpbmddOiBhbnk7XG59XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIFBheWxvYWQgY2xhc3NcblxuLyoqXG4gKlxuICogVGhpcyBjbGFzcyBpcyBzZXJpYWxpc2VkIGFuZCB0cmFuc2ZlcnJlZCBvdmVyIHRoZSB2b3J0ZXggdG8gdGhlIHNlcnZlci5cbiAqL1xuZXhwb3J0IGNsYXNzIFBheWxvYWQgZXh0ZW5kcyBKc29uYWJsZSB7XG5cbiAgcHJpdmF0ZSBzdGF0aWMgd29ya2VyRGVsZWdhdGUgPSBuZXcgUGF5bG9hZERlbGVnYXRlSW5NYWluKCk7XG5cbiAgc3RhdGljIHJlYWRvbmx5IHZvcnRleFV1aWRLZXkgPSBcIl9fdm9ydGV4VXVpZF9fXCI7XG4gIHN0YXRpYyByZWFkb25seSB2b3J0ZXhOYW1lS2V5ID0gXCJfX3ZvcnRleE5hbWVfX1wiO1xuXG4gIGZpbHQ6IHt9O1xuICB0dXBsZXM6IEFycmF5PFR1cGxlIHwgYW55PjtcbiAgcmVzdWx0OiBzdHJpbmcgfCB7fSB8IG51bGwgPSBudWxsO1xuICBkYXRlOiBEYXRlIHwgbnVsbCA9IG51bGw7XG5cbiAgLyoqXG4gICAqIFBheWxvYWRcbiAgICogVGhpcyBjbGFzcyBpcyBzZXJpYWxpc2VkIGFuZCB0cmFuZmVycmVkIG92ZXIgdGhlIHZvcnRleCB0byB0aGUgc2VydmVyLlxuICAgKiBAcGFyYW0gZmlsdCBUaGUgZmlsdGVyIHRoYXQgdGhlIHNlcnZlciBoYW5kbGVyIGlzIGxpc3RlbmluZyBmb3JcbiAgICogQHBhcmFtIHR1cGxlczogVGhlIHR1cGxlcyB0byBpbml0IHRoZSBQYXlsb2FkIHdpdGhcbiAgICogZGlmZmVyZW50IGxvY2F0aW9uIEBkZXByZWNpYXRlZFxuICAgKi9cbiAgY29uc3RydWN0b3IoZmlsdDoge30gPSB7fSwgdHVwbGVzOiBBcnJheTxUdXBsZSB8IGFueT4gPSBbXSkge1xuICAgIHN1cGVyKCk7XG4gICAgbGV0IHNlbGYgPSB0aGlzO1xuXG4gICAgc2VsZi5fX3JzdCA9IFNlcmlhbGlzZVV0aWwuVF9SQVBVSV9QQVlMT0FEO1xuXG4gICAgc2VsZi5maWx0ID0gZmlsdDtcbiAgICBzZWxmLnR1cGxlcyA9IHR1cGxlcztcblxuICB9XG5cbiAgc3RhdGljIHNldFdvcmtlckRlbGVnYXRlKGRlbGVnYXRlOiBQYXlsb2FkRGVsZWdhdGVBQkMpIHtcbiAgICBQYXlsb2FkLndvcmtlckRlbGVnYXRlID0gZGVsZWdhdGU7XG4gIH1cblxuICBpc0VtcHR5KCkge1xuICAgIGxldCBzZWxmID0gdGhpcztcblxuICAgIC8vIElnbm9yZSB0aGUgY29ubmVjdGlvbiBzdGFydCB2b3J0ZXhVdWlkIHZhbHVlXG4gICAgLy8gSXQncyBzZW50IGFzIHRoZSBmaXJzdCByZXNwb25zZSB3aGVuIHdlIGNvbm5lY3QuXG4gICAgZm9yIChsZXQgcHJvcGVydHkgaW4gc2VsZi5maWx0KSB7XG4gICAgICBpZiAocHJvcGVydHkgPT09IFBheWxvYWQudm9ydGV4VXVpZEtleSlcbiAgICAgICAgY29udGludWU7XG4gICAgICAvLyBBbnl0aGluZyBlbHNlLCByZXR1cm4gZmFsc2VcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICByZXR1cm4gKHNlbGYudHVwbGVzLmxlbmd0aCA9PT0gMCAmJiBzZWxmLnJlc3VsdCA9PSBudWxsKTtcbiAgfVxuXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gSlNPTiBSZWxhdGVkIG1ldGhvZFxuXG4gIHByaXZhdGUgX2Zyb21Kc29uKGpzb25TdHI6IHN0cmluZyk6IFBheWxvYWQge1xuICAgIGxldCBzZWxmID0gdGhpcztcbiAgICBsZXQganNvbkRpY3QgPSBKU09OLnBhcnNlKGpzb25TdHIpO1xuXG4gICAgYXNzZXJ0KGpzb25EaWN0W0pzb25hYmxlLkpTT05fQ0xBU1NfVFlQRV0gPT09IHNlbGYuX19yc3QpO1xuICAgIHJldHVybiBzZWxmLmZyb21Kc29uRGljdChqc29uRGljdCk7XG4gIH1cblxuICBwcml2YXRlIF90b0pzb24oKTogc3RyaW5nIHtcbiAgICBsZXQgc2VsZiA9IHRoaXM7XG4gICAgbGV0IGpzb25EaWN0ID0gc2VsZi50b0pzb25EaWN0KCk7XG4gICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KGpzb25EaWN0KTtcbiAgfVxuXG4gIHN0YXRpYyBmcm9tVm9ydGV4TXNnKHZvcnRleFN0cjogc3RyaW5nKTogUHJvbWlzZTxQYXlsb2FkPiB7XG4gICAgbGV0IHN0YXJ0ID0gbm93KCk7XG5cbiAgICByZXR1cm4gbmV3IFByb21pc2U8UGF5bG9hZD4oKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXG4gICAgICBQYXlsb2FkLndvcmtlckRlbGVnYXRlLmRlY29kZUFuZEluZmxhdGUodm9ydGV4U3RyKVxuICAgICAgICAudGhlbigoanNvblN0cikgPT4ge1xuICAgICAgICAgIGxvZ0xvbmcoJ1BheWxvYWQuZnJvbVZvcnRleE1zZyBkZWNvZGUraW5mbGF0ZScsIHN0YXJ0KTtcbiAgICAgICAgICBzdGFydCA9IG5vdygpO1xuICAgICAgICAgIFxuICAgICAgICAgIGxldCBwYXlsb2FkID0gbmV3IFBheWxvYWQoKS5fZnJvbUpzb24oanNvblN0cik7XG4gICAgICAgICAgbG9nTG9uZygnUGF5bG9hZC5mcm9tVm9ydGV4TXNnIF9mcm9tSnNvbicsIHN0YXJ0LCBwYXlsb2FkKTtcblxuICAgICAgICAgIHJlc29sdmUocGF5bG9hZCk7XG4gICAgICAgIH0pXG4gICAgICAgIC5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgICAgY29uc29sZS5sb2coYEVSUk9SOiB0b1ZvcnRleE1zZyAke2Vycn1gKTtcbiAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgfSk7XG5cbiAgICB9KTtcbiAgfVxuXG4gIHRvVm9ydGV4TXNnKCk6IFByb21pc2U8c3RyaW5nPiB7XG4gICAgbGV0IHN0YXJ0ID0gbm93KCk7XG5cbiAgICByZXR1cm4gbmV3IFByb21pc2U8c3RyaW5nPigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cbiAgICAgIGxldCBqc29uU3RyID0gdGhpcy5fdG9Kc29uKCk7XG4gICAgICBsb2dMb25nKCdQYXlsb2FkLnRvVm9ydGV4TXNnIF90b0pzb24nLCBzdGFydCwgdGhpcyk7XG4gICAgICBzdGFydCA9IG5vdygpO1xuXG4gICAgICBQYXlsb2FkLndvcmtlckRlbGVnYXRlLmRlZmxhdGVBbmRFbmNvZGUoanNvblN0cilcbiAgICAgICAgLnRoZW4oKGpzb25TdHIpID0+IHtcbiAgICAgICAgICBsb2dMb25nKCdQYXlsb2FkLnRvVm9ydGV4TXNnIGRlZmxhdGUrZW5jb2RlJywgc3RhcnQsIHRoaXMpO1xuICAgICAgICAgIHJlc29sdmUoanNvblN0cik7XG4gICAgICAgIH0pXG4gICAgICAgIC5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgICAgY29uc29sZS5sb2coYEVSUk9SOiB0b1ZvcnRleE1zZyAke2Vycn1gKTtcbiAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgfSk7XG5cbiAgICB9KTtcbiAgfVxuXG59XG4iXX0=