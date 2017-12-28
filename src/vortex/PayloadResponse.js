"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
var PayloadResponse = /** @class */ (function () {
    /** Constructor
     * @param vortexService:
     * @param payload: The payload to mark and send.
     * @param timeout: The timeout to wait for a response - in seconds;
     * @param resultCheck: Should the result of the payload response be checked.
     */
    function PayloadResponse(vortexService, payload, timeout, resultCheck) {
        if (timeout === void 0) { timeout = PayloadResponse.RESPONSE_TIMEOUT_SECONDS; }
        if (resultCheck === void 0) { resultCheck = true; }
        var _this = this;
        this.payload = payload;
        this.timeout = timeout;
        this.resultCheck = resultCheck;
        this.PROCESSING = "Processing";
        // NO_ENDPOINT = "No Endpoint"
        this.FAILED = "Failed";
        this.SUCCESS = "Success";
        this.TIMED_OUT = "Timed Out";
        this._messageId = VortexClientABC_1.VortexClientABC.makeUuid();
        this._status = this.PROCESSING;
        this._lcEmitter = new ComponentLifecycleEventEmitter_1.ComponentLifecycleEventEmitter();
        this.promise = new Promise(function (resolve, reject) {
            // Start the timer
            var timer = setTimeout(function () {
                var filtStr = JSON.stringify(_this.payload.filt);
                var msg = "Timed out for payload " + filtStr;
                console.log(UtilMisc_1.dateStr() + " ERR: " + msg);
                _this._status = _this.TIMED_OUT;
                reject(msg);
                _this._lcEmitter.onDestroyEvent.emit("OnDestroy");
            }, timeout);
            // Create the endpoint
            _this.payload.filt[PayloadResponse.messageIdKey] = _this._messageId;
            var endpoint = vortexService.createEndpoint(_this._lcEmitter, _this.payload.filt);
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
            vortexService.sendPayload(_this.payload);
        });
    }
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    PayloadResponse.prototype.then = function (onfulfilled, onrejected) {
        if (onrejected === void 0) { onrejected = null; }
        return this.promise.then(onfulfilled, onrejected);
    };
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    PayloadResponse.prototype.catch = function (onrejected) {
        return this.promise.catch(onrejected);
    };
    /** Is Response Payload
     *
     * The PayloadResponse tags the payloads, so it expects a unique message back.
     *
     * @returns True if this payload has been tagged by a PayloadResponse class
     */
    PayloadResponse.isResponsePayload = function (payload) {
        return payload.filt.hasOwnProperty(PayloadResponse.messageIdKey);
    };
    Object.defineProperty(PayloadResponse.prototype, "status", {
        get: function () {
            return this._status;
        },
        enumerable: true,
        configurable: true
    });
    PayloadResponse.RESPONSE_TIMEOUT_SECONDS = 10000; // milliseconds
    PayloadResponse.messageIdKey = "PayloadResponse.messageId";
    return PayloadResponse;
}());
exports.PayloadResponse = PayloadResponse;
//# sourceMappingURL=/Users/jchesney/project/vortexjs/src/vortex/PayloadResponse.js.map