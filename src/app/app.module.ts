import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";
import {AppComponent} from "./app.component";
import {VortexService} from "../vortex/Vortex";
import {Ng2BalloonMsgService} from "@synerty/ng2-balloon-msg";
import { PayloadComponent } from './payload/payload.component';
import { VortexComponent } from './vortex/vortex.component';
import { TupleComponent } from './tuple/tuple.component';
import { PayloadEndpointComponent } from './payload-endpoint/payload-endpoint.component';

@NgModule({
    declarations: [
        AppComponent,
        PayloadComponent,
        VortexComponent,
        TupleComponent,
        PayloadEndpointComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule
    ],
    providers: [VortexService, Ng2BalloonMsgService],
    bootstrap: [AppComponent]
})
export class AppModule {
}

