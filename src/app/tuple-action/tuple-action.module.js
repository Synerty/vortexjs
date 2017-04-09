"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var common_1 = require("@angular/common");
var tuple_action_component_1 = require("./tuple-action.component");
var TupleActionPushService_1 = require("../../vortex/TupleActionPushService");
var forms_1 = require("@angular/forms");
var TupleActionModule = (function () {
    function TupleActionModule() {
    }
    return TupleActionModule;
}());
TupleActionModule = __decorate([
    core_1.NgModule({
        imports: [
            common_1.CommonModule,
            forms_1.FormsModule
        ],
        exports: [
            tuple_action_component_1.TupleActionComponent
        ],
        declarations: [tuple_action_component_1.TupleActionComponent],
        providers: [
            {
                provide: TupleActionPushService_1.TupleActionPushNameService,
                useValue: new TupleActionPushService_1.TupleActionPushNameService("vortexTestActions")
            },
            TupleActionPushService_1.TupleActionPushService
        ]
    })
], TupleActionModule);
exports.TupleActionModule = TupleActionModule;
//# sourceMappingURL=/home/peek/project/vortexjs/src/app/tuple-action/tuple-action.module.js.map