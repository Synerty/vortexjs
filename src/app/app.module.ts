import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";
import {AppComponent} from "./app.component";
import {VortexService} from "../vortex/Vortex";
import {Ng2BalloonMsgService} from "@synerty/ng2-balloon-msg";

@NgModule({
    declarations: [
        AppComponent
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
