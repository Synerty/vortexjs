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
var common_1 = require("@angular/common");
var tuple_action_offline_component_1 = require("./tuple-action-offline.component");
var TupleActionPushService_1 = require("../../vortex/TupleActionPushService");
var TupleActionPushOfflineService_1 = require("../../vortex/TupleActionPushOfflineService");
var forms_1 = require("@angular/forms");
var TupleActionOfflineModule = (function () {
    function TupleActionOfflineModule() {
    }
    return TupleActionOfflineModule;
}());
TupleActionOfflineModule = __decorate([
    core_1.NgModule({
        imports: [
            common_1.CommonModule,
            forms_1.FormsModule
        ],
        exports: [
            tuple_action_offline_component_1.TupleActionOfflineComponent
        ],
        declarations: [tuple_action_offline_component_1.TupleActionOfflineComponent],
        providers: [
            {
                provide: TupleActionPushService_1.TupleActionPushNameService,
                useValue: new TupleActionPushService_1.TupleActionPushNameService("vortexTestActions")
            },
            TupleActionPushOfflineService_1.TupleActionPushOfflineService
        ]
    }),
    __metadata("design:paramtypes", [])
], TupleActionOfflineModule);
exports.TupleActionOfflineModule = TupleActionOfflineModule;
//# sourceMappingURL=/home/peek/project/vortexjs/src/app/tuple-action-offline/tuple-action-offline.module.js.map