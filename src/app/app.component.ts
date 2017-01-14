import {Component} from "@angular/core";
import {VortexStatusService} from "../vortex/VortexStatusService";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    title = "Synerty's VortexJS - testbed app";
    vortexIsOnline: boolean = false;

    constructor(private vortexStatusService: VortexStatusService) {
        vortexStatusService.isOnline.subscribe(online => this.vortexIsOnline = online);

    }
}
