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
import {
    TupleDataObserverService,
    TupleDataObservableNameService
} from "../vortex/TupleDataObserverService";
import {TupleOfflineModule} from "./tuple-offline/tuple-offline.module";
import {WebsqlModule} from "./websql/websql.module";
import {TupleOfflineObserverModule} from "./tuple-offline-observer/tuple-offline-observer.module";

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        Ng2BalloonMsgModule,
        TupleOfflineModule,
        TupleOfflineObserverModule,
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
            provide: TupleDataObservableNameService,
            useValue: new TupleDataObservableNameService("vortexTestObservable")
        },
        TupleDataObserverService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}



