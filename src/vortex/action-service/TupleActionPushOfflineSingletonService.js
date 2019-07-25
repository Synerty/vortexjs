"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var VortexStatusService_1 = require("../VortexStatusService");
var VortexService_1 = require("../VortexService");
var UtilMisc_1 = require("../UtilMisc");
var PayloadResponse_1 = require("../PayloadResponse");
var TupleStorageFactoryService_1 = require("../storage-factory/TupleStorageFactoryService");
var operators_1 = require("rxjs/operators");
var TupleActionPushOfflineSingletonService = /** @class */ (function () {
    function TupleActionPushOfflineSingletonService(vortexService, vortexStatus, factoryService) {
        var _this = this;
        this.vortexService = vortexService;
        this.vortexStatus = vortexStatus;
        this.sendingTuple = false;
        this.lastSendFailTime = null;
        this.SEND_FAIL_RETRY_TIMEOUT = 5000; // milliseconds
        this.SERVER_PROCESSING_TIMEOUT = 5000; // milliseconds
        this.SEND_FAIL_RETRY_BACKOFF = 5000; // milliseconds
        this.storage = factoryService.createActionStorage();
        // This is a global service, there is no point unsubscribing it
        this.vortexStatus.isOnline
            .pipe(operators_1.filter(function (online) { return online === true; }))
            .subscribe(function (online) { return _this.sendNextAction(); });
        this.storage.countActions()
            .then(function (count) {
            _this.vortexStatus.setQueuedActionCount(count);
        })
            .catch(function (err) {
            var errStr = UtilMisc_1.errToStr(err);
            var msg = "Failed to count actions : " + errStr;
            _this.vortexStatus.logError(msg);
        })
            .then(function () { return _this.sendNextAction(); });
    }
    TupleActionPushOfflineSingletonService.prototype.queueAction = function (scope, tupleAction, payload) {
        var _this = this;
        return this.storage.storeAction(scope, tupleAction, payload)
            .then(function () {
            _this.vortexStatus.incrementQueuedActionCount();
            _this.sendNextAction();
        })
            .catch(function (err) {
            var errStr = UtilMisc_1.errToStr(err);
            var msg = "Failed to store action : " + errStr;
            console.log(msg);
            throw new Error(msg);
        });
    };
    TupleActionPushOfflineSingletonService.prototype.sendNextAction = function () {
        var _this = this;
        if (this.sendingTuple)
            return;
        if (!this.vortexStatus.snapshot.isOnline)
            return;
        // Don't continually retry, if we have a last send fail, ensure we wait
        // {SEND_FAIL_RETRY_BACKOFF} before sending again.
        if (this.lastSendFailTime != null) {
            var reconnectDiffMs = Date.now() - this.lastSendFailTime;
            if (reconnectDiffMs < this.SEND_FAIL_RETRY_BACKOFF) {
                // +10ms to ensure we're just out of the backoff time.
                setTimeout(function () { return _this.sendNextAction(); }, this.SEND_FAIL_RETRY_BACKOFF - reconnectDiffMs + 10);
                return;
            }
            else {
                this.lastSendFailTime = null;
            }
        }
        this.sendingTuple = true;
        // Get the next tuple from the persistent queue
        this.storage.loadNextAction()
            // If this was successful?
            .then(function (sendPayload) {
            // Is the end the end of the queue?
            if (sendPayload == null) {
                _this.sendingTuple = false;
                return;
            }
            return sendPayload.makePayloadEnvelope()
                .then(function (sendPayloadEnvelope) {
                var uuid = sendPayload.tuples[0].uuid;
                var scope = sendPayload.filt["name"];
                return new PayloadResponse_1.PayloadResponse(_this.vortexService, sendPayloadEnvelope, PayloadResponse_1.PayloadResponse.RESPONSE_TIMEOUT_SECONDS, // Timeout
                false // don't check result, only reject if it times out
                ).then(function (responsePayload) {
                    // If we received a payload, but it has an error message
                    // Log an error, it's out of our hands, move on.
                    var r = responsePayload.result; // success is null or true
                    if (!(r == null || r === true)) {
                        _this.vortexStatus.logError('Server failed to process Action: ' + responsePayload.result.toString());
                    }
                    _this.storage.deleteAction(scope, uuid).then(function () {
                        _this.vortexStatus.decrementQueuedActionCount();
                    });
                    _this.sendingTuple = false;
                    _this.sendNextAction();
                });
            });
        })
            // Or catch and handle any of the errors from either loading or sending
            .catch(function (err) {
            _this.lastSendFailTime = Date.now();
            var errStr = UtilMisc_1.errToStr(err);
            _this.vortexStatus.logError("Failed to send TupleAction : " + errStr);
            _this.sendingTuple = false;
            setTimeout(function () { return _this.sendNextAction(); }, _this.SEND_FAIL_RETRY_TIMEOUT);
            return null; // Handle the error
        });
    };
    TupleActionPushOfflineSingletonService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [VortexService_1.VortexService,
            VortexStatusService_1.VortexStatusService,
            TupleStorageFactoryService_1.TupleStorageFactoryService])
    ], TupleActionPushOfflineSingletonService);
    return TupleActionPushOfflineSingletonService;
}());
exports.TupleActionPushOfflineSingletonService = TupleActionPushOfflineSingletonService;
//# sourceMappingURL=TupleActionPushOfflineSingletonService.js.map