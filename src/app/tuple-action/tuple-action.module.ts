import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {TupleActionComponent} from "./tuple-action.component";
import {
    TupleActionPushNameService,
    TupleActionPushService
} from "../../vortex/TupleActionPushService";
import {FormsModule} from "@angular/forms";

@NgModule({
    imports: [
        CommonModule,
        FormsModule
    ],
    exports:[
        TupleActionComponent
    ],
    declarations: [TupleActionComponent],
    providers: [
        {
            provide: TupleActionPushNameService,
            useValue: new TupleActionPushNameService("vortexTestActions")
        },
        TupleActionPushService
    ]
})
export class TupleActionModule {
}
