"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var TupleActionPushService_1 = require("./TupleActionPushService");
var VortexService_1 = require("../VortexService");
var TupleActionPushOfflineSingletonService_1 = require("./TupleActionPushOfflineSingletonService");
var TupleActionPushOfflineService = /** @class */ (function (_super) {
    __extends(TupleActionPushOfflineService, _super);
    function TupleActionPushOfflineService(tupleActionName, vortexService, vortexStatus, singleton) {
        var _this = _super.call(this, tupleActionName, vortexService, vortexStatus) || this;
        _this.singleton = singleton;
        return _this;
    }
    TupleActionPushOfflineService.prototype.pushAction = function (tupleAction) {
        var payload = this.makePayload(tupleAction);
        return this.singleton
            .queueAction(this.tupleActionProcessorName.name, tupleAction, payload)
            .then(function () { return []; });
    };
    TupleActionPushOfflineService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [TupleActionPushService_1.TupleActionPushNameService,
            VortexService_1.VortexService,
            VortexStatusService_1.VortexStatusService,
            TupleActionPushOfflineSingletonService_1.TupleActionPushOfflineSingletonService])
    ], TupleActionPushOfflineService);
    return TupleActionPushOfflineService;
}(TupleActionPushService_1.TupleActionPushService));
exports.TupleActionPushOfflineService = TupleActionPushOfflineService;
//# sourceMappingURL=TupleActionPushOfflineService.js.map