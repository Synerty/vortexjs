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
var WebSqlService_1 = require("../../websql/WebSqlService");
var WebSqlBrowserAdaptorService_1 = require("../../websql/WebSqlBrowserAdaptorService");
var TupleOfflineStorageService_1 = require("../../vortex/TupleOfflineStorageService");
var tuple_offline_component_1 = require("./tuple-offline.component");
var TupleOfflineModule = (function () {
    function TupleOfflineModule() {
    }
    return TupleOfflineModule;
}());
TupleOfflineModule = __decorate([
    core_1.NgModule({
        imports: [
            common_1.CommonModule
        ],
        exports: [tuple_offline_component_1.TupleOfflineComponent],
        declarations: [tuple_offline_component_1.TupleOfflineComponent],
        providers: [
            {
                provide: WebSqlService_1.WebSqlFactoryService,
                useValue: new WebSqlBrowserAdaptorService_1.WebSqlBrowserFactoryService()
            },
            {
                provide: TupleOfflineStorageService_1.TupleOfflineStorageNameService,
                useValue: new TupleOfflineStorageService_1.TupleOfflineStorageNameService("tuple-offline-test")
            },
            TupleOfflineStorageService_1.TupleOfflineStorageService
        ]
    })
], TupleOfflineModule);
exports.TupleOfflineModule = TupleOfflineModule;
//# sourceMappingURL=/home/peek/project/vortexjs/src/app/tuple-offline/tuple-offline.module.js.map