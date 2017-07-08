import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {WebSqlService, WebSqlFactoryService} from "../../vortex/storage/websql/WebSqlService";
import {WebSqlBrowserFactoryService} from "../../vortex/storage/websql/WebSqlBrowserAdaptorService";
import {WebsqlComponent} from "./websql.component";

@NgModule({
    imports: [
        CommonModule
    ],
    exports:[WebsqlComponent],
    declarations: [WebsqlComponent],
    providers:[{
            provide: WebSqlFactoryService,
            useValue: new WebSqlBrowserFactoryService()
        }
    ]
})
export class WebsqlModule {
}
