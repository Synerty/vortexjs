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
var core_1 = require("@angular/core");
var VortexStatusService_1 = require("./VortexStatusService");
var VortexService_1 = require("./VortexService");
var PayloadResponse_1 = require("./PayloadResponse");
var Payload_1 = require("./Payload");
var UtilMisc_1 = require("./UtilMisc");
var TupleActionNameService = (function () {
    function TupleActionNameService(name, additionalFilt) {
        if (additionalFilt === void 0) { additionalFilt = {}; }
        this.name = name;
        this.additionalFilt = additionalFilt;
    }
    return TupleActionNameService;
}());
TupleActionNameService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [String, Object])
], TupleActionNameService);
exports.TupleActionNameService = TupleActionNameService;
var TupleActionService = (function () {
    function TupleActionService(tupleActionProcessorName, vortexService, vortexStatus) {
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
    TupleActionService.prototype.pushAction = function (tupleAction) {
        if (!this.vortexStatus.snapshot.isOnline)
            return Promise.reject("Vortex is offline");
        var payloadResponse = new PayloadResponse_1.PayloadResponse(this.vortexService, this.makePayload(tupleAction));
        var convertedPromise = payloadResponse
            .then(function (payload) {
            return payload.tuples[0];
        });
        return convertedPromise;
    };
    /** Make Payload
     *
     * This make the payload that we send to the server.
     *
     */
    TupleActionService.prototype.makePayload = function (tupleAction) {
        var payload = new Payload_1.Payload();
        payload.filt = UtilMisc_1.extend({
            key: "tupleActionProcessorName",
            name: this.tupleActionProcessorName.name
        }, this.tupleActionProcessorName.additionalFilt);
        payload.tuples = [tupleAction];
        return payload;
    };
    return TupleActionService;
}());
TupleActionService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [TupleActionNameService,
        VortexService_1.VortexService,
        VortexStatusService_1.VortexStatusService])
], TupleActionService);
exports.TupleActionService = TupleActionService;
//# sourceMappingURL=/home/peek/project/vortexjs/src/vortex/TupleActionService.js.map