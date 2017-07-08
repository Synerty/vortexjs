import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {TupleActionOfflineComponent} from "./tuple-action-offline.component";
import {TupleActionPushNameService} from "../../vortex/TupleActionPushService";
import {TupleActionPushOfflineService} from "../../vortex/TupleActionPushOfflineService";
import {FormsModule} from "@angular/forms";

@NgModule({
    imports: [
        CommonModule,
        FormsModule
    ],
    exports: [
        TupleActionOfflineComponent
    ],
    declarations: [TupleActionOfflineComponent],
    providers: [
        {
            provide: TupleActionPushNameService,
            useValue: new TupleActionPushNameService("vortexTestActions")
        },
        TupleActionPushOfflineService
    ]
})
export class TupleActionOfflineModule {
}
