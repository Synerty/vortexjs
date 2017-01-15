import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";
import {AppComponent} from "./app.component";
import {VortexService} from "../vortex/VortexService";
import {VortexStatusService} from "../vortex/VortexStatusService";
import {Ng2BalloonMsgService, Ng2BalloonMsgModule} from "@synerty/ng2-balloon-msg";
import {PayloadComponent} from "./payload/payload.component";
import {VortexComponent} from "./vortex/vortex.component";
import {TupleComponent} from "./tuple/tuple.component";
import {PayloadEndpointComponent} from "./payload-endpoint/payload-endpoint.component";
import {TupleLoaderComponent} from "./tuple-loader/tuple-loader.component";
import {TupleObserverComponent} from "./tuple-observer/tuple-observer.component";
import {TupleDataObservableName, TupleDataObserver} from "../vortex/TupleDataObserver";
import {TupleOfflineModule} from "./tuple-offline/tuple-offline.module";
import {WebsqlModule} from "./websql/websql.module";

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        Ng2BalloonMsgModule,
        TupleOfflineModule,
        WebsqlModule
    ],
    declarations: [
        AppComponent,
        PayloadComponent,
        VortexComponent,
        TupleComponent,
        PayloadEndpointComponent,
        TupleLoaderComponent,
        TupleObserverComponent,
    ],
    providers: [VortexService, VortexStatusService,
        Ng2BalloonMsgService,
        {
            provide: TupleDataObservableName,
            useValue: new TupleDataObservableName("vortexTestObservable")
        },
        TupleDataObserver
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}



