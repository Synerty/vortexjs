import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {TupleActionOfflineComponent} from "./tuple-action-offline.component";
import {TupleActionNameService} from "../../vortex/TupleActionService";
import {TupleActionOfflineService} from "../../vortex/TupleActionOfflineService";
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
            provide: TupleActionNameService,
            useValue: new TupleActionNameService("vortexTestActions")
        },
        TupleActionOfflineService
    ]
})
export class TupleActionOfflineModule {
}
