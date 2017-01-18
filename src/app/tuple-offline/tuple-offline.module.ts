import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {WebSqlFactoryService} from "../../websql/WebSqlService";
import {WebSqlBrowserFactoryService} from "../../websql/WebSqlBrowserAdaptorService";
import {
    TupleOfflineStorageService,
    TupleOfflineStorageNameService
} from "../../vortex/TupleOfflineStorageService";

import {TupleOfflineComponent} from "./tuple-offline.component";

@NgModule({
    imports: [
        CommonModule
    ],
    exports: [TupleOfflineComponent],
    declarations: [TupleOfflineComponent],
    providers: [
        {
            provide: WebSqlFactoryService,
            useValue: new WebSqlBrowserFactoryService()
        },
        {
            provide: TupleOfflineStorageNameService,
            useValue: new TupleOfflineStorageNameService("tuple-offline-test")
        },
        TupleOfflineStorageService
    ]
})
export class TupleOfflineModule {
}