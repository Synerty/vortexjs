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
var VortexService = VortexService_1 = (function () {
    function VortexService(vortexStatusService, zone, balloonMsg) {
        //
        this.vortexStatusService = vortexStatusService;
        this.zone = zone;
        this.balloonMsg = balloonMsg;
        this.reconnect();
    }
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
    VortexService.prototype.reconnect = function () {
        if (this.vortex != null)
            this.vortex.closed = true;
        if (VortexService_1.vortexUrl == null) {
            this.vortexStatusService.setOnline(false);
            return;
        }
        if (VortexService_1.vortexUrl.toLowerCase().startsWith("ws")) {
            this.vortex = new VortexClientWebsocket_1.VortexClientWebsocket(this.vortexStatusService, this.zone, VortexService_1.vortexUrl);
        }
        else {
            this.vortex = new VortexClientHttp_1.VortexClientHttp(this.vortexStatusService, this.zone, VortexService_1.vortexUrl);
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
        if (this.vortex == null) {
            throw new Error("The vortex is not initialised yet.");
        }
        return this.vortex.send(payload);
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
        return new TupleLoader_1.TupleLoader(this.vortex, component, this.zone, filterUpdateCallable, this.balloonMsg);
    };
    return VortexService;
}());
VortexService.vortexUrl = '/vortex';
VortexService = VortexService_1 = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [VortexStatusService_1.VortexStatusService,
        core_1.NgZone,
        ng2_balloon_msg_1.Ng2BalloonMsgService])
], VortexService);
exports.VortexService = VortexService;
var VortexService_1;
//# sourceMappingURL=/Users/jchesney/project/vortexjs/src/vortex/VortexService.js.map