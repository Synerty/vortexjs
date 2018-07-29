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
var Payload_1 = require("./Payload");
var core_1 = require("@angular/core");
var PayloadEndpoint_1 = require("./PayloadEndpoint");
var TupleLoader_1 = require("./TupleLoader");
var ng2_balloon_msg_1 = require("@synerty/ng2-balloon-msg");
var VortexStatusService_1 = require("./VortexStatusService");
var VortexClientHttp_1 = require("./VortexClientHttp");
var VortexClientWebsocket_1 = require("./VortexClientWebsocket");
var VortexService = /** @class */ (function () {
    function VortexService(vortexStatusService, balloonMsg) {
        this.vortexStatusService = vortexStatusService;
        this.balloonMsg = balloonMsg;
        this.reconnect();
    }
    VortexService_1 = VortexService;
    /**
     * Set Vortex URL
     *
     * This method should not be used except in rare cases, such as a NativeScript app.
     *
     * @param url: The new URL for the vortex to use.
     */
    VortexService.setVortexUrl = function (url) {
        VortexService_1.vortexUrl = url;
    };
    /**
     * Set Vortex Name
     *
     * @param vortexClientName: The vortexClientName to tell the server that we are.
     */
    VortexService.setVortexClientName = function (vortexClientName) {
        VortexService_1.vortexClientName = vortexClientName;
    };
    VortexService.prototype.reconnect = function () {
        if (VortexService_1.vortexUrl == null) {
            this.vortexStatusService.setOnline(false);
            return;
        }
        if (VortexService_1.vortexClientName == '') {
            throw new Error('VortexService.setVortexClientName() not set yet');
        }
        if (this.vortex != null)
            this.vortex.closed = true;
        if (VortexService_1.vortexUrl.toLowerCase().startsWith("ws")) {
            this.vortex = new VortexClientWebsocket_1.VortexClientWebsocket(this.vortexStatusService, VortexService_1.vortexUrl, VortexService_1.vortexClientName);
        }
        else {
            this.vortex = new VortexClientHttp_1.VortexClientHttp(this.vortexStatusService, VortexService_1.vortexUrl, VortexService_1.vortexClientName);
        }
        this.vortex.reconnect();
    };
    VortexService.prototype.sendTuple = function (filt, tuples) {
        if (typeof filt === "string") {
            filt = { key: filt };
        }
        this.sendPayload(new Payload_1.Payload(filt, tuples));
    };
    VortexService.prototype.sendFilt = function (filt) {
        this.sendPayload(new Payload_1.Payload(filt));
    };
    /** Send Payload
     *
     * @param {Payload[] | Payload} payload
     * @returns {Promise<void>}
     */
    VortexService.prototype.sendPayload = function (payload) {
        var _this = this;
        if (this.vortex == null) {
            throw new Error("The vortex is not initialised yet.");
        }
        var payloads = [];
        if (payload instanceof Array)
            payloads = payload;
        else
            payloads = [payload];
        var promises = [];
        for (var _i = 0, payloads_1 = payloads; _i < payloads_1.length; _i++) {
            var payload_1 = payloads_1[_i];
            promises.push(payload_1.makePayloadEnvelope()
                .then(function (payloadEnvelope) {
                _this.vortex.send(payloadEnvelope);
            }));
        }
        var ret = Promise.all(promises);
        return ret;
    };
    /** Send Payload Envelope(s)
     *
     * @param {PayloadEnvelope[] | PayloadEnvelope} payloadEnvelope
     * @returns {Promise<void>}
     */
    VortexService.prototype.sendPayloadEnvelope = function (payloadEnvelope) {
        if (this.vortex == null) {
            throw new Error("The vortex is not initialised yet.");
        }
        return this.vortex.send(payloadEnvelope);
    };
    VortexService.prototype.createEndpointObservable = function (component, filter, processLatestOnly) {
        if (processLatestOnly === void 0) { processLatestOnly = false; }
        var endpoint = new PayloadEndpoint_1.PayloadEndpoint(component, filter, processLatestOnly);
        return this.createEndpoint(component, filter, processLatestOnly).observable;
    };
    VortexService.prototype.createEndpoint = function (component, filter, processLatestOnly) {
        if (processLatestOnly === void 0) { processLatestOnly = false; }
        return new PayloadEndpoint_1.PayloadEndpoint(component, filter, processLatestOnly);
    };
    VortexService.prototype.createTupleLoader = function (component, filterUpdateCallable) {
        return new TupleLoader_1.TupleLoader(this.vortex, this.vortexStatusService, component, filterUpdateCallable, this.balloonMsg);
    };
    VortexService.vortexUrl = '/vortex';
    VortexService.vortexClientName = '';
    VortexService = VortexService_1 = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [VortexStatusService_1.VortexStatusService,
            ng2_balloon_msg_1.Ng2BalloonMsgService])
    ], VortexService);
    return VortexService;
    var VortexService_1;
}());
exports.VortexService = VortexService;
//# sourceMappingURL=/Users/jchesney/project/vortexjs/src/vortex/VortexService.js.map