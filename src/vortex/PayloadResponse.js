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
var PayloadResponse = (function () {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGF5bG9hZFJlc3BvbnNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiUGF5bG9hZFJlc3BvbnNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEscURBQWtEO0FBRWxELHVDQUFtQztBQUVuQyxtRkFBZ0Y7QUFFaEY7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FtQkc7QUFDSDtJQW9CSTs7Ozs7T0FLRztJQUNILHlCQUFZLGFBQTRCLEVBQ3BCLE9BQWdCLEVBQ2hCLE9BQTBELEVBQzFELFdBQTJCO1FBRDNCLHdCQUFBLEVBQUEsVUFBa0IsZUFBZSxDQUFDLHdCQUF3QjtRQUMxRCw0QkFBQSxFQUFBLGtCQUEyQjtRQUgvQyxpQkF5Q0M7UUF4Q21CLFlBQU8sR0FBUCxPQUFPLENBQVM7UUFDaEIsWUFBTyxHQUFQLE9BQU8sQ0FBbUQ7UUFDMUQsZ0JBQVcsR0FBWCxXQUFXLENBQWdCO1FBdkJ0QyxlQUFVLEdBQUcsWUFBWSxDQUFDO1FBQ25DLDhCQUE4QjtRQUNyQixXQUFNLEdBQUcsUUFBUSxDQUFDO1FBQ2xCLFlBQU8sR0FBRyxTQUFTLENBQUM7UUFDcEIsY0FBUyxHQUFHLFdBQVcsQ0FBQztRQUV6QixlQUFVLEdBQVcsaUNBQWUsQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUNoRCxZQUFPLEdBQVcsSUFBSSxDQUFDLFVBQVUsQ0FBQztRQUVsQyxlQUFVLEdBQ1osSUFBSSwrREFBOEIsRUFBRSxDQUFDO1FBY3ZDLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxPQUFPLENBQVUsVUFBQyxPQUFPLEVBQUUsTUFBTTtZQUVwRCxrQkFBa0I7WUFDbEIsSUFBSSxLQUFLLEdBQUcsVUFBVSxDQUFDO2dCQUNuQixJQUFJLE9BQU8sR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ2hELElBQUksR0FBRyxHQUFHLDJCQUF5QixPQUFTLENBQUM7Z0JBQzdDLE9BQU8sQ0FBQyxHQUFHLENBQUksa0JBQU8sRUFBRSxjQUFTLEdBQUssQ0FBQyxDQUFDO2dCQUN4QyxLQUFJLENBQUMsT0FBTyxHQUFHLEtBQUksQ0FBQyxTQUFTLENBQUM7Z0JBQzlCLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDWixLQUFJLENBQUMsVUFBVSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDckQsQ0FBQyxFQUFFLE9BQU8sQ0FBRSxDQUFDO1lBRWIsc0JBQXNCO1lBQ3RCLEtBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxZQUFZLENBQUMsR0FBRyxLQUFJLENBQUMsVUFBVSxDQUFDO1lBQ2xFLElBQUksUUFBUSxHQUFHLGFBQWEsQ0FBQyxjQUFjLENBQ3ZDLEtBQUksQ0FBQyxVQUFVLEVBQWlCLEtBQUksQ0FBQyxPQUFPLENBQUMsSUFBSyxDQUFDLENBQUM7WUFFeEQsWUFBWTtZQUNaLFFBQVEsQ0FBQyxVQUFVLENBQUMsU0FBUyxDQUFDLFVBQUMsT0FBTztnQkFDbEMsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDO2dCQUNwQixRQUFRLENBQUMsUUFBUSxFQUFFLENBQUM7Z0JBRXBCLElBQUksQ0FBQyxHQUFHLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQywwQkFBMEI7Z0JBQ2xELEVBQUUsQ0FBQyxDQUFDLEtBQUksQ0FBQyxXQUFXLElBQUksQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDakQsS0FBSSxDQUFDLE9BQU8sR0FBRyxLQUFJLENBQUMsTUFBTSxDQUFDO29CQUMzQixNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO2dCQUV0QyxDQUFDO2dCQUFDLElBQUksQ0FBQyxDQUFDO29CQUNKLEtBQUksQ0FBQyxPQUFPLEdBQUcsS0FBSSxDQUFDLE9BQU8sQ0FBQztvQkFDNUIsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDO2dCQUNyQixDQUFDO2dCQUVELEtBQUksQ0FBQyxVQUFVLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsQ0FBQztZQUNyRCxDQUFDLENBQUMsQ0FBQztZQUVILGFBQWEsQ0FBQyxXQUFXLENBQUMsS0FBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQ3hDLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0gsOEJBQUksR0FBSixVQUFLLFdBQVcsRUFBRSxVQUFpQjtRQUFqQiwyQkFBQSxFQUFBLGlCQUFpQjtRQUMvQixNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLFVBQVUsQ0FBQyxDQUFDO0lBQ3RELENBQUM7SUFJRDs7OztPQUlHO0lBQ0gsK0JBQUssR0FBTCxVQUFNLFVBQVU7UUFDWixNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDMUMsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0ksaUNBQWlCLEdBQXhCLFVBQXlCLE9BQU87UUFDNUIsTUFBTSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLGVBQWUsQ0FBQyxZQUFZLENBQUMsQ0FBQztJQUNyRSxDQUFDO0lBRUQsc0JBQUksbUNBQU07YUFBVjtZQUNJLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDO1FBQ3hCLENBQUM7OztPQUFBO0lBbkdzQix3Q0FBd0IsR0FBRyxLQUFLLENBQUMsQ0FBQyxlQUFlO0lBQ3pELDRCQUFZLEdBQUcsMkJBQTJCLENBQUM7SUFtRzlELHNCQUFDO0NBQUEsQUF2R0QsSUF1R0M7QUF2R1ksMENBQWUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1ZvcnRleENsaWVudEFCQ30gZnJvbSBcIi4vVm9ydGV4Q2xpZW50QUJDXCI7XG5pbXBvcnQge1BheWxvYWQsIElQYXlsb2FkRmlsdH0gZnJvbSBcIi4vUGF5bG9hZFwiO1xuaW1wb3J0IHtkYXRlU3RyfSBmcm9tIFwiLi9VdGlsTWlzY1wiO1xuaW1wb3J0IHtWb3J0ZXhTZXJ2aWNlfSBmcm9tIFwiLi9Wb3J0ZXhTZXJ2aWNlXCI7XG5pbXBvcnQge0NvbXBvbmVudExpZmVjeWNsZUV2ZW50RW1pdHRlcn0gZnJvbSBcIi4vQ29tcG9uZW50TGlmZWN5Y2xlRXZlbnRFbWl0dGVyXCI7XG5cbi8qKiBQYXlsb2FkIFJlc3BvbnNlXG4gKlxuICogICAgVGhpcyBjbGFzcyBpcyB1c2VkIHRvIGNhdGNoIHJlc3BvbnNlcyBmcm9tIGEgc2VudCBwYXlsb2FkLlxuICogICAgSWYgdGhlIHJlbW90ZSBlbmQgaXMgZ29pbmcgdG8gc2VuZCBiYWNrIGEgcGF5bG9hZCwgd2l0aCB0aGUgc2FtZSBmaWx0LFxuICogICAgdGhpcyBjbGFzcyBjYXRjaGVzIHRoaXMgdGhlbiBlaXRoZXIgcmVzb2x2ZXMgb3IgcmVqZWN0cyB0aGUgcHJvbWlzZS5cbiAqXG4gKiAgICBJZiB0aGUgcmVzcG9uc2UgaXMgbm90IHJlY2VpdmVkIHdpdGhpbiB0aGUgdGltZW91dCwgdGhlIGVycmJhY2sgaXMgY2FsbGVkLlxuICpcbiAqICAgICoqIFRoZSBQYXlsb2FkUmVzcG9uc2UgaW4gVm9ydGV4SlMgU2VuZHMgdGhlIFBheWxvYWQgKipcbiAqXG4gKiAgICBIZXJlIGlzIHNvbWUgZXhhbXBsZSB1c2FnZS5cbiAqXG4gKiAgICA6OlxuICpcbiAqICAgICAgICBwYXlsb2FkID0gUGF5bG9hZChmaWx0PXtcInJhcHVpU2VydmVyRWNob1wiOlRydWV9KVxuICogICAgICAgIHJlc3BvbnNlUHJvbWlzZSA9IFBheWxvYWRSZXNwb25zZSh2b3J0ZXhTZXJ2aWNlLCBwYXlsb2FkKVxuICogICAgICAgICAgLnRoZW4oKHBheWxvYWQpID0+IGNvbnNvbGUubG9nKGBSZWNlaXZlZCBwYXlsb2FkICR7cGF5bG9hZH1gKSlcbiAqICAgICAgICAgIC5jYXRjaCgoZXJyKSA9PiBjb25zb2xlLmxvZyhlcnIpKTtcbiAqXG4gKi9cbmV4cG9ydCBjbGFzcyBQYXlsb2FkUmVzcG9uc2Uge1xuXG5cbiAgICBwdWJsaWMgc3RhdGljIHJlYWRvbmx5IFJFU1BPTlNFX1RJTUVPVVRfU0VDT05EUyA9IDEwMDAwOyAvLyBtaWxsaXNlY29uZHNcbiAgICBwcml2YXRlIHN0YXRpYyBtZXNzYWdlSWRLZXkgPSBcIlBheWxvYWRSZXNwb25zZS5tZXNzYWdlSWRcIjtcblxuICAgIHJlYWRvbmx5IFBST0NFU1NJTkcgPSBcIlByb2Nlc3NpbmdcIjtcbiAgICAvLyBOT19FTkRQT0lOVCA9IFwiTm8gRW5kcG9pbnRcIlxuICAgIHJlYWRvbmx5IEZBSUxFRCA9IFwiRmFpbGVkXCI7XG4gICAgcmVhZG9ubHkgU1VDQ0VTUyA9IFwiU3VjY2Vzc1wiO1xuICAgIHJlYWRvbmx5IFRJTUVEX09VVCA9IFwiVGltZWQgT3V0XCI7XG5cbiAgICBwcml2YXRlIF9tZXNzYWdlSWQ6IHN0cmluZyA9IFZvcnRleENsaWVudEFCQy5tYWtlVXVpZCgpO1xuICAgIHByaXZhdGUgX3N0YXR1czogc3RyaW5nID0gdGhpcy5QUk9DRVNTSU5HO1xuXG4gICAgcHJpdmF0ZSBfbGNFbWl0dGVyOiBDb21wb25lbnRMaWZlY3ljbGVFdmVudEVtaXR0ZXJcbiAgICAgICAgPSBuZXcgQ29tcG9uZW50TGlmZWN5Y2xlRXZlbnRFbWl0dGVyKCk7XG5cbiAgICBwcml2YXRlIHByb21pc2U6IFByb21pc2U8UGF5bG9hZD47XG5cbiAgICAvKiogQ29uc3RydWN0b3JcbiAgICAgKiBAcGFyYW0gdm9ydGV4U2VydmljZTpcbiAgICAgKiBAcGFyYW0gcGF5bG9hZDogVGhlIHBheWxvYWQgdG8gbWFyayBhbmQgc2VuZC5cbiAgICAgKiBAcGFyYW0gdGltZW91dDogVGhlIHRpbWVvdXQgdG8gd2FpdCBmb3IgYSByZXNwb25zZSAtIGluIHNlY29uZHM7XG4gICAgICogQHBhcmFtIHJlc3VsdENoZWNrOiBTaG91bGQgdGhlIHJlc3VsdCBvZiB0aGUgcGF5bG9hZCByZXNwb25zZSBiZSBjaGVja2VkLlxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKHZvcnRleFNlcnZpY2U6IFZvcnRleFNlcnZpY2UsXG4gICAgICAgICAgICAgICAgcHJpdmF0ZSBwYXlsb2FkOiBQYXlsb2FkLFxuICAgICAgICAgICAgICAgIHByaXZhdGUgdGltZW91dDogbnVtYmVyID0gUGF5bG9hZFJlc3BvbnNlLlJFU1BPTlNFX1RJTUVPVVRfU0VDT05EUyxcbiAgICAgICAgICAgICAgICBwcml2YXRlIHJlc3VsdENoZWNrOiBib29sZWFuID0gdHJ1ZSkge1xuICAgICAgICB0aGlzLnByb21pc2UgPSBuZXcgUHJvbWlzZTxQYXlsb2FkPigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cbiAgICAgICAgLy8gU3RhcnQgdGhlIHRpbWVyXG4gICAgICAgIGxldCB0aW1lciA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgICAgbGV0IGZpbHRTdHIgPSBKU09OLnN0cmluZ2lmeSh0aGlzLnBheWxvYWQuZmlsdCk7XG4gICAgICAgICAgICBsZXQgbXNnID0gYFRpbWVkIG91dCBmb3IgcGF5bG9hZCAke2ZpbHRTdHJ9YDtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKGAke2RhdGVTdHIoKX0gRVJSOiAke21zZ31gKTtcbiAgICAgICAgICAgIHRoaXMuX3N0YXR1cyA9IHRoaXMuVElNRURfT1VUO1xuICAgICAgICAgICAgcmVqZWN0KG1zZyk7XG4gICAgICAgICAgICB0aGlzLl9sY0VtaXR0ZXIub25EZXN0cm95RXZlbnQuZW1pdChcIk9uRGVzdHJveVwiKTtcbiAgICAgICAgfSwgdGltZW91dCApO1xuXG4gICAgICAgIC8vIENyZWF0ZSB0aGUgZW5kcG9pbnRcbiAgICAgICAgdGhpcy5wYXlsb2FkLmZpbHRbUGF5bG9hZFJlc3BvbnNlLm1lc3NhZ2VJZEtleV0gPSB0aGlzLl9tZXNzYWdlSWQ7XG4gICAgICAgIGxldCBlbmRwb2ludCA9IHZvcnRleFNlcnZpY2UuY3JlYXRlRW5kcG9pbnQoXG4gICAgICAgICAgICB0aGlzLl9sY0VtaXR0ZXIsICg8SVBheWxvYWRGaWx0PnRoaXMucGF5bG9hZC5maWx0KSk7XG5cbiAgICAgICAgLy8gU3Vic2NyaWJlXG4gICAgICAgIGVuZHBvaW50Lm9ic2VydmFibGUuc3Vic2NyaWJlKChwYXlsb2FkKSA9PiB7XG4gICAgICAgICAgICBjbGVhclRpbWVvdXQodGltZXIpO1xuICAgICAgICAgICAgZW5kcG9pbnQuc2h1dGRvd24oKTtcblxuICAgICAgICAgICAgbGV0IHIgPSBwYXlsb2FkLnJlc3VsdDsgLy8gc3VjY2VzcyBpcyBudWxsIG9yIHRydWVcbiAgICAgICAgICAgIGlmICh0aGlzLnJlc3VsdENoZWNrICYmICEociA9PSBudWxsIHx8IHIgPT09IHRydWUpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fc3RhdHVzID0gdGhpcy5GQUlMRUQ7XG4gICAgICAgICAgICAgICAgcmVqZWN0KHBheWxvYWQucmVzdWx0LnRvU3RyaW5nKCkpO1xuXG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHRoaXMuX3N0YXR1cyA9IHRoaXMuU1VDQ0VTUztcbiAgICAgICAgICAgICAgICByZXNvbHZlKHBheWxvYWQpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLl9sY0VtaXR0ZXIub25EZXN0cm95RXZlbnQuZW1pdChcIk9uRGVzdHJveVwiKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdm9ydGV4U2VydmljZS5zZW5kUGF5bG9hZCh0aGlzLnBheWxvYWQpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBdHRhY2hlcyBjYWxsYmFja3MgZm9yIHRoZSByZXNvbHV0aW9uIGFuZC9vciByZWplY3Rpb24gb2YgdGhlIFByb21pc2UuXG4gICAgICogQHBhcmFtIG9uZnVsZmlsbGVkIFRoZSBjYWxsYmFjayB0byBleGVjdXRlIHdoZW4gdGhlIFByb21pc2UgaXMgcmVzb2x2ZWQuXG4gICAgICogQHBhcmFtIG9ucmVqZWN0ZWQgVGhlIGNhbGxiYWNrIHRvIGV4ZWN1dGUgd2hlbiB0aGUgUHJvbWlzZSBpcyByZWplY3RlZC5cbiAgICAgKiBAcmV0dXJucyBBIFByb21pc2UgZm9yIHRoZSBjb21wbGV0aW9uIG9mIHdoaWNoIGV2ZXIgY2FsbGJhY2sgaXMgZXhlY3V0ZWQuXG4gICAgICovXG4gICAgdGhlbihvbmZ1bGZpbGxlZCwgb25yZWplY3RlZCA9IG51bGwpOiBQcm9taXNlPFBheWxvYWQ+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMucHJvbWlzZS50aGVuKG9uZnVsZmlsbGVkLCBvbnJlamVjdGVkKTtcbiAgICB9XG5cblxuXG4gICAgLyoqXG4gICAgICogQXR0YWNoZXMgYSBjYWxsYmFjayBmb3Igb25seSB0aGUgcmVqZWN0aW9uIG9mIHRoZSBQcm9taXNlLlxuICAgICAqIEBwYXJhbSBvbnJlamVjdGVkIFRoZSBjYWxsYmFjayB0byBleGVjdXRlIHdoZW4gdGhlIFByb21pc2UgaXMgcmVqZWN0ZWQuXG4gICAgICogQHJldHVybnMgQSBQcm9taXNlIGZvciB0aGUgY29tcGxldGlvbiBvZiB0aGUgY2FsbGJhY2suXG4gICAgICovXG4gICAgY2F0Y2gob25yZWplY3RlZCk6IFByb21pc2U8UGF5bG9hZD4ge1xuICAgICAgICByZXR1cm4gdGhpcy5wcm9taXNlLmNhdGNoKG9ucmVqZWN0ZWQpO1xuICAgIH1cblxuICAgIC8qKiBJcyBSZXNwb25zZSBQYXlsb2FkXG4gICAgICpcbiAgICAgKiBUaGUgUGF5bG9hZFJlc3BvbnNlIHRhZ3MgdGhlIHBheWxvYWRzLCBzbyBpdCBleHBlY3RzIGEgdW5pcXVlIG1lc3NhZ2UgYmFjay5cbiAgICAgKlxuICAgICAqIEByZXR1cm5zIFRydWUgaWYgdGhpcyBwYXlsb2FkIGhhcyBiZWVuIHRhZ2dlZCBieSBhIFBheWxvYWRSZXNwb25zZSBjbGFzc1xuICAgICAqL1xuICAgIHN0YXRpYyBpc1Jlc3BvbnNlUGF5bG9hZChwYXlsb2FkKSB7XG4gICAgICAgIHJldHVybiBwYXlsb2FkLmZpbHQuaGFzT3duUHJvcGVydHkoUGF5bG9hZFJlc3BvbnNlLm1lc3NhZ2VJZEtleSk7XG4gICAgfVxuXG4gICAgZ2V0IHN0YXR1cyh0aGlzKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9zdGF0dXM7XG4gICAgfVxufVxuXG4iXX0=