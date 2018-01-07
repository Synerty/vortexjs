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
        this.SEND_FAILED = "Send Failed";
        this.SUCCESS = "Success";
        this.TIMED_OUT = "Timed Out";
        this._messageId = VortexClientABC_1.VortexClientABC.makeUuid();
        this._status = this.PROCESSING;
        this._lcEmitter = new ComponentLifecycleEventEmitter_1.ComponentLifecycleEventEmitter();
        this.promise = new Promise(function (resolve, reject) {
            // Start the timer
            var timer = null;
            // Create the endpoint
            _this.payload.filt[PayloadResponse.messageIdKey] = _this._messageId;
            var endpoint = vortexService
                .createEndpoint(_this._lcEmitter, _this.payload.filt);
            var finish = function (status) {
                _this._status = status;
                _this._lcEmitter.onDestroyEvent.emit("OnDestroy");
                if (timer != null) {
                    clearTimeout(timer);
                    timer = null;
                }
            };
            var callFail = function (status, msgArg) {
                if (msgArg === void 0) { msgArg = ''; }
                var filtStr = JSON.stringify(_this.payload.filt);
                var msg = UtilMisc_1.dateStr() + " PayloadEndpoing " + status + " Failed : " + msgArg + "\n" + filtStr;
                console.log(msg);
                finish(status);
                reject(msgArg);
            };
            // Subscribe
            endpoint.observable
                .takeUntil(_this._lcEmitter.onDestroyEvent)
                .subscribe(function (payload) {
                var r = payload.result; // success is null or true
                if (_this.resultCheck && !(r == null || r === true)) {
                    callFail(_this.FAILED, r.toString());
                }
                else {
                    finish(_this.SUCCESS);
                    resolve(payload);
                }
            });
            vortexService.sendPayload(_this.payload)
                .then(function () {
                timer = setTimeout(function () { return callFail(_this.TIMED_OUT); }, timeout);
            })
                .catch(function (err) {
                callFail(_this.SEND_FAILED, err);
            });
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
    PayloadResponse.RESPONSE_TIMEOUT_SECONDS = 30000; // milliseconds
    PayloadResponse.messageIdKey = "PayloadResponse.messageId";
    return PayloadResponse;
}());
exports.PayloadResponse = PayloadResponse;
//# sourceMappingURL=/Users/jchesney/project/vortexjs/src/vortex/PayloadResponse.js.map