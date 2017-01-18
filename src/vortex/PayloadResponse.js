"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var VortexClientABC_1 = require("./VortexClientABC");
var UtilMisc_1 = require("./UtilMisc");
var ComponentLifecycleEventEmitter_1 = require("./ComponentLifecycleEventEmitter");
/** Payload Response
 *
 *    This class is used to catch responses from a sent payload.
 *    If the remote end is going to send back a payload, with the same filt,
 *    this class catches this then either resolves or rejects the promise.
 *
 *    If the response is not received within the timeout, the errback is called.
 *
 *    ** The PayloadResponse in VortexJS Sends the Payload **
 *
 *    Here is some example usage.
 *
 *    ::
 *
 *        payload = Payload(filt={"rapuiServerEcho":True})
 *        responsePromise = PayloadResponse(vortexService, payload)
 *          .then((payload) => console.log(`Received payload ${payload}`))
 *          .catch((err) => console.log(err));
 *
 */
var PayloadResponse = (function (_super) {
    __extends(PayloadResponse, _super);
    /** Constructor
     * @param payload: The payload to mark and send.
     * @param timeout: The timeout to wait for a response - in seconds;
     * @param resultCheck: Should the result of the payload response be checked.
     */
    function PayloadResponse(vortexService, payload, timeout, resultCheck) {
        if (timeout === void 0) { timeout = 10.000; }
        if (resultCheck === void 0) { resultCheck = true; }
        var _this = _super.call(this, function (resolve, reject) {
            // Start the timer
            var timer = setTimeout(function () {
                var msg = "Timed out for payload " + payload.filt.toString();
                console.log(UtilMisc_1.dateStr() + " ERR: " + msg);
                _this._status = _this.TIMED_OUT;
                reject(msg);
                _this._lcEmitter.onDestroyEvent.emit("OnDestroy");
            }, timeout * 1000);
            // Create the endpoint
            payload.filt[PayloadResponse.messageIdKey] = _this._messageId;
            var endpoint = vortexService.createEndpoint(_this._lcEmitter, payload.filt);
            // Subscribe
            endpoint.observable.subscribe(function (payload) {
                clearTimeout(timer);
                endpoint.shutdown();
                var r = payload.result; // success is null or true
                if (_this.resultCheck && !(r == null || r === true)) {
                    _this._status = _this.FAILED;
                    reject(payload.result.toString());
                }
                else {
                    _this._status = _this.SUCCESS;
                    resolve(payload);
                }
                _this._lcEmitter.onDestroyEvent.emit("OnDestroy");
            });
            vortexService.sendPayload(payload);
        }) || this;
        _this.payload = payload;
        _this.timeout = timeout;
        _this.resultCheck = resultCheck;
        _this.PROCESSING = "Processing";
        // NO_ENDPOINT = "No Endpoint"
        _this.FAILED = "Failed";
        _this.SUCCESS = "Success";
        _this.TIMED_OUT = "Timed Out";
        _this._messageId = VortexClientABC_1.VortexClientABC.makeUuid();
        _this._status = _this.PROCESSING;
        _this._lcEmitter = new ComponentLifecycleEventEmitter_1.ComponentLifecycleEventEmitter();
        return _this;
    }
    /* Is Response Payload
     *
     * The PayloadResponse tags the payloads, so it expects a unique message back.
     *
     * :returns: True if this payload has been tagged by a PayloadResponse class
     */
    PayloadResponse.isResponsePayload = function (payload) {
        return payload.filt.hasOwnProperty(PayloadResponse.messageIdKey);
    };
    PayloadResponse.prototype.status = function () {
        return this._status;
    };
    return PayloadResponse;
}(Promise));
PayloadResponse.messageIdKey = "PayloadResponse.messageId";
exports.PayloadResponse = PayloadResponse;
//# sourceMappingURL=/home/peek/project/vortexjs/src/vortex/PayloadResponse.js.map