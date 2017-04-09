"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var platform_browser_1 = require("@angular/platform-browser");
var core_1 = require("@angular/core");
var forms_1 = require("@angular/forms");
var http_1 = require("@angular/http");
var app_component_1 = require("./app.component");
var VortexService_1 = require("../vortex/VortexService");
var VortexStatusService_1 = require("../vortex/VortexStatusService");
var ng2_balloon_msg_1 = require("@synerty/ng2-balloon-msg");
var payload_component_1 = require("./payload/payload.component");
var vortex_component_1 = require("./vortex/vortex.component");
var tuple_component_1 = require("./tuple/tuple.component");
var payload_endpoint_component_1 = require("./payload-endpoint/payload-endpoint.component");
var tuple_loader_component_1 = require("./tuple-loader/tuple-loader.component");
var tuple_observer_component_1 = require("./tuple-observer/tuple-observer.component");
var TupleDataObserverService_1 = require("../vortex/TupleDataObserverService");
var tuple_offline_module_1 = require("./tuple-offline/tuple-offline.module");
var websql_module_1 = require("./websql/websql.module");
var tuple_offline_observer_module_1 = require("./tuple-offline-observer/tuple-offline-observer.module");
var tuple_action_module_1 = require("./tuple-action/tuple-action.module");
var tuple_action_offline_module_1 = require("./tuple-action-offline/tuple-action-offline.module");
var AppModule = (function () {
    function AppModule() {
    }
    return AppModule;
}());
AppModule = __decorate([
    core_1.NgModule({
        imports: [
            platform_browser_1.BrowserModule,
            forms_1.FormsModule,
            http_1.HttpModule,
            ng2_balloon_msg_1.Ng2BalloonMsgModule,
            tuple_offline_module_1.TupleOfflineModule,
            tuple_offline_observer_module_1.TupleOfflineObserverModule,
            websql_module_1.WebsqlModule,
            tuple_action_module_1.TupleActionModule,
            tuple_action_offline_module_1.TupleActionOfflineModule
        ],
        declarations: [
            app_component_1.AppComponent,
            payload_component_1.PayloadComponent,
            vortex_component_1.VortexComponent,
            tuple_component_1.TupleComponent,
            payload_endpoint_component_1.PayloadEndpointComponent,
            tuple_loader_component_1.TupleLoaderComponent,
            tuple_observer_component_1.TupleObserverComponent,
        ],
        providers: [VortexService_1.VortexService, VortexStatusService_1.VortexStatusService,
            ng2_balloon_msg_1.Ng2BalloonMsgService,
            {
                provide: TupleDataObserverService_1.TupleDataObservableNameService,
                useValue: new TupleDataObserverService_1.TupleDataObservableNameService("vortexTestObservable")
            },
            TupleDataObserverService_1.TupleDataObserverService
        ],
        bootstrap: [app_component_1.AppComponent]
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=/home/peek/project/vortexjs/src/app/app.module.js.map