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
var Payload_1 = require("../../vortex/Payload");
var tuple_component_1 = require("../tuple/tuple.component");
var VortexService_1 = require("../../vortex/VortexService");
var UtilMisc_1 = require("../../vortex/UtilMisc");
var PayloadComponent = (function () {
    function PayloadComponent(vortexService) {
        this.vortexService = vortexService;
    }
    PayloadComponent.prototype.ngOnInit = function () {
    };
    PayloadComponent.prototype.testMakePayload = function () {
        var payload = new Payload_1.Payload();
        payload.tuples = [tuple_component_1.TupleComponent.testMakeTuple()];
        return payload;
    };
    PayloadComponent.prototype.testPayloadEcho2Hop = function () {
        var payload = this.testMakePayload();
        payload.filt['key'] = 'rapuiServerEcho';
        this.vortexService.sendPayload(payload);
        console.log("testPayloadEcho2Hop");
        return true;
    };
    PayloadComponent.prototype.testPayloadToFromVortexMsg = function () {
        var origPayload = this.testMakePayload();
        var origVortexMsg = origPayload.toVortexMsg();
        var payload = Payload_1.Payload.fromVortexMsg(origVortexMsg);
        var vortexMsg = payload.toVortexMsg();
        console.log(vortexMsg);
        console.log(origVortexMsg);
        UtilMisc_1.assert(origPayload.equals(payload), "testPayloadToFromVortexMsg, Payload objects do not match");
        UtilMisc_1.assert(origVortexMsg == vortexMsg, "testPayloadToFromVortexMsg, Payload vortex msg strings do not match");
        return true;
    };
    return PayloadComponent;
}());
PayloadComponent = __decorate([
    core_1.Component({
        selector: 'app-payload',
        templateUrl: './payload.component.html',
        styleUrls: ['./payload.component.css']
    }),
    __metadata("design:paramtypes", [VortexService_1.VortexService])
], PayloadComponent);
exports.PayloadComponent = PayloadComponent;
//# sourceMappingURL=/home/peek/project/vortexjs/src/app/payload/payload.component.js.map