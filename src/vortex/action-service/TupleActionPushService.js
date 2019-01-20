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
var PayloadResponse_1 = require("../PayloadResponse");
var Payload_1 = require("../Payload");
var UtilMisc_1 = require("../UtilMisc");
var TupleActionPushNameService = /** @class */ (function () {
    function TupleActionPushNameService(name, additionalFilt) {
        if (additionalFilt === void 0) { additionalFilt = {}; }
        this.name = name;
        this.additionalFilt = additionalFilt;
    }
    TupleActionPushNameService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [String, Object])
    ], TupleActionPushNameService);
    return TupleActionPushNameService;
}());
exports.TupleActionPushNameService = TupleActionPushNameService;
var TupleActionPushService = /** @class */ (function () {
    function TupleActionPushService(tupleActionProcessorName, vortexService, vortexStatus) {
        this.tupleActionProcessorName = tupleActionProcessorName;
        this.vortexService = vortexService;
        this.vortexStatus = vortexStatus;
    }
    /** Push Action
     *
     * This pushes the action, either locally or to the server, depending on the
     * implementation.
     *
     * If pushed locally, the promise will resolve when the action has been saved.
     * If pushed directly to the server, the promise will resolve when the server has
     * responded.
     */
    TupleActionPushService.prototype.pushAction = function (tupleAction) {
        var _this = this;
        if (!this.vortexStatus.snapshot.isOnline)
            return Promise.reject("Vortex is offline");
        var promise = this.makePayload(tupleAction)
            .makePayloadEnvelope();
        promise = promise.then(function (payloadEnvelope) {
            return new PayloadResponse_1.PayloadResponse(_this.vortexService, payloadEnvelope);
        });
        promise = promise.then(function (payloadEnvelope) {
            return payloadEnvelope.decodePayload();
        });
        promise = promise.then(function (payload) { return payload.tuples; });
        return promise;
    };
    /** Make Payload
     *
     * This make the payload that we send to the server.
     *
     */
    TupleActionPushService.prototype.makePayload = function (tupleAction) {
        var payload = new Payload_1.Payload();
        payload.filt = UtilMisc_1.extend({
            key: "tupleActionProcessorName",
            name: this.tupleActionProcessorName.name
        }, this.tupleActionProcessorName.additionalFilt);
        payload.tuples = [tupleAction];
        return payload;
    };
    TupleActionPushService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [TupleActionPushNameService,
            VortexService_1.VortexService,
            VortexStatusService_1.VortexStatusService])
    ], TupleActionPushService);
    return TupleActionPushService;
}());
exports.TupleActionPushService = TupleActionPushService;
//# sourceMappingURL=/Users/jchesney/dev-peek-util/vortexjs/src/vortex/action-service/TupleActionPushService.js.map