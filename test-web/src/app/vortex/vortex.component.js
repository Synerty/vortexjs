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
var VortexService_1 = require("../../vortex/VortexService");
var ng2_balloon_msg_1 = require("@synerty/ng2-balloon-msg");
var VortexStatusService_1 = require("../../vortex/VortexStatusService");
var VortexComponent = (function () {
    function VortexComponent(statusService, zone, balloonMsg) {
        this.statusService = statusService;
        this.zone = zone;
        this.balloonMsg = balloonMsg;
        this.httpService = new VortexService_1.VortexService(statusService, zone, balloonMsg);
        var host = location.host.split(':')[0];
        VortexService_1.VortexService.setVortexUrl("ws://" + host + ":8344");
        this.webSocketService = new VortexService_1.VortexService(statusService, zone, balloonMsg);
    }
    VortexComponent.prototype.ngOnInit = function () {
    };
    VortexComponent.prototype.testVortexHttpReconnect = function () {
        this.httpService.reconnect();
        console.log("HTTP Reconnect sent");
        return true;
    };
    VortexComponent.prototype.testVortexWebSocketReconnect = function () {
        this.webSocketService.reconnect();
        console.log("WebSocket Reconnect sent");
        return true;
    };
    return VortexComponent;
}());
VortexComponent = __decorate([
    core_1.Component({
        selector: 'app-vortex',
        templateUrl: './vortex.component.html',
        styleUrls: ['./vortex.component.css']
    }),
    __metadata("design:paramtypes", [VortexStatusService_1.VortexStatusService,
        core_1.NgZone,
        ng2_balloon_msg_1.Ng2BalloonMsgService])
], VortexComponent);
exports.VortexComponent = VortexComponent;
//# sourceMappingURL=/home/peek/project/vortexjs/src/app/vortex/vortex.component.js.map