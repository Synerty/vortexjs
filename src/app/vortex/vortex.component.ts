import {Component, OnInit} from "@angular/core";
import {VortexService} from "../../vortex/Vortex";

@Component({
    selector: 'app-vortex',
    templateUrl: './vortex.component.html',
    styleUrls: ['./vortex.component.css']
})
export class VortexComponent implements OnInit {

    constructor(public vortexService: VortexService) {
    }

    ngOnInit() {
    }

    testVortexReconnect() {
        this.vortexService.reconnect();
        console.log("Reconnect sent");
        return true;
    }

}

