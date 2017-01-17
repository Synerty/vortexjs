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
var VortexStatusService_1 = require("../vortex/VortexStatusService");
var AppComponent = (function () {
    function AppComponent(vortexStatusService) {
        var _this = this;
        this.vortexStatusService = vortexStatusService;
        this.title = "Synerty's VortexJS - testbed app";
        this.vortexIsOnline = false;
        vortexStatusService.isOnline.subscribe(function (online) { return _this.vortexIsOnline = online; });
    }
    return AppComponent;
}());
AppComponent = __decorate([
    core_1.Component({
        selector: 'app-root',
        templateUrl: './app.component.html',
        styleUrls: ['./app.component.css']
    }),
    __metadata("design:paramtypes", [VortexStatusService_1.VortexStatusService])
], AppComponent);
exports.AppComponent = AppComponent;
//# sourceMappingURL=/home/peek/project/vortexjs/src/app/app.component.js.map