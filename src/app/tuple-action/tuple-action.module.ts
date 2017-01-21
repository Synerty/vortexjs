import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {TupleActionComponent} from "./tuple-action.component";
import {
    TupleActionNameService,
    TupleActionService
} from "../../vortex/TupleActionService";
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
            provide: TupleActionNameService,
            useValue: new TupleActionNameService("vortexTestActions")
        },
        TupleActionService
    ]
})
export class TupleActionModule {
}
