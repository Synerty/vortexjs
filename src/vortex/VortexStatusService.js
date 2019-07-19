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
var rxjs_1 = require("rxjs");
var UtilMisc_1 = require("./UtilMisc");
// Node compatibility
var logDebug = console.debug ? UtilMisc_1.bind(console, console.debug) : UtilMisc_1.bind(console, console.log);
var logInfo = UtilMisc_1.bind(console, console.log);
var logError = console.error ? UtilMisc_1.bind(console, console.error) : UtilMisc_1.bind(console, console.log);
var VortexStatusService = /** @class */ (function () {
    function VortexStatusService(zone) {
        this.zone = zone;
        this.isOnline = new rxjs_1.Subject();
        this.info = new rxjs_1.Subject();
        this.errors = new rxjs_1.Subject();
        this.wasOnline = false;
        this.queuedActionCount = new rxjs_1.Subject();
        this.lastQueuedTupleActions = 0;
    }
    Object.defineProperty(VortexStatusService.prototype, "snapshot", {
        get: function () {
            return {
                isOnline: this.wasOnline,
                queuedActionCount: this.lastQueuedTupleActions
            };
        },
        enumerable: true,
        configurable: true
    });
    VortexStatusService.prototype.setOnline = function (online) {
        var _this = this;
        if (online === this.wasOnline)
            return;
        logDebug(UtilMisc_1.dateStr() + "Vortex Status - online: " + online);
        this.wasOnline = online;
        this.zone.run(function () {
            _this.isOnline.next(online);
        });
    };
    VortexStatusService.prototype.incrementQueuedActionCount = function () {
        this.setQueuedActionCount(this.lastQueuedTupleActions + 1);
    };
    VortexStatusService.prototype.decrementQueuedActionCount = function () {
        this.setQueuedActionCount(this.lastQueuedTupleActions - 1);
    };
    VortexStatusService.prototype.setQueuedActionCount = function (count) {
        var _this = this;
        if (count === this.lastQueuedTupleActions)
            return;
        this.lastQueuedTupleActions = count;
        this.zone.run(function () {
            _this.queuedActionCount.next(count);
        });
    };
    VortexStatusService.prototype.logInfo = function (message) {
        var _this = this;
        logInfo(UtilMisc_1.dateStr() + "Vortex Status - info: " + message);
        this.zone.run(function () {
            _this.info.next(message);
        });
    };
    VortexStatusService.prototype.logError = function (message) {
        var _this = this;
        logError(UtilMisc_1.dateStr() + "Vortex Status - error: " + message);
        this.zone.run(function () {
            _this.errors.next(message);
        });
    };
    VortexStatusService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [typeof (_a = typeof core_1.NgZone !== "undefined" && core_1.NgZone) === "function" && _a || Object])
    ], VortexStatusService);
    return VortexStatusService;
    var _a;
}());
exports.VortexStatusService = VortexStatusService;
//# sourceMappingURL=/Users/jchesney/dev-peek-util/vortexjs/src/vortex/VortexStatusService.js.map