import {Component} from "@angular/core";
import {PayloadEndpointComponent} from "./payload-endpoint/payload-endpoint.component";
import {TupleComponent} from "./tuple/tuple.component";
import {VortexComponent} from "./vortex/vortex.component";
import {PayloadComponent} from "./payload/payload.component";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    title = "Synerty's VortexJS - testbed app";
}
