import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {WebSqlFactoryService} from "../../vortex/storage/websql/WebSqlService";
import {WebSqlBrowserFactoryService} from "../../vortex/storage/websql/WebSqlBrowserAdaptorService";
import {
    TupleOfflineStorageService,
    TupleOfflineStorageNameService
} from "../../vortex/TupleOfflineStorageService";
import {TupleOfflineObserverComponent} from "./tuple-offline-observer.component";
import {TupleDataOfflineObserverService} from "../../vortex/TupleDataOfflineObserverService";

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [TupleOfflineObserverComponent],
    exports: [TupleOfflineObserverComponent],
    providers: [
        {
            provide: WebSqlFactoryService,
            useValue: new WebSqlBrowserFactoryService()
        },
        {
            provide: TupleOfflineStorageNameService,
            useValue: new TupleOfflineStorageNameService("tuple-offline-test")
        },
        TupleOfflineStorageService,
        TupleDataOfflineObserverService
    ]
})
export class TupleOfflineObserverModule {
}
