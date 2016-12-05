import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";
import {AppComponent} from "./app.component";
import {VortexService} from "../vortex/Vortex";
import {Ng2BalloonMsgService, Ng2BalloonMsgModule} from "@synerty/ng2-balloon-msg";
import {PayloadComponent} from "./payload/payload.component";
import {VortexComponent} from "./vortex/vortex.component";
import {TupleComponent} from "./tuple/tuple.component";
import {PayloadEndpointComponent} from "./payload-endpoint/payload-endpoint.component";
import { TupleLoaderComponent } from './tuple-loader/tuple-loader.component';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        Ng2BalloonMsgModule
    ],
    declarations: [
        AppComponent,
        PayloadComponent,
        VortexComponent,
        TupleComponent,
        PayloadEndpointComponent,
        TupleLoaderComponent
    ],
    providers: [VortexService, Ng2BalloonMsgService],
    bootstrap: [AppComponent]
})
export class AppModule {
}



