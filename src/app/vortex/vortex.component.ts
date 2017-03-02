import {Component, OnInit, NgZone} from "@angular/core";
import {VortexService} from "../../vortex/VortexService";
import {Ng2BalloonMsgService} from "@synerty/ng2-balloon-msg";
import {VortexStatusService} from "../../vortex/VortexStatusService";

@Component({
    selector: 'app-vortex',
    templateUrl: './vortex.component.html',
    styleUrls: ['./vortex.component.css']
})
export class VortexComponent implements OnInit {

    httpService: VortexService;
    webSocketService: VortexService;

    constructor(private statusService: VortexStatusService,
                private balloonMsg: Ng2BalloonMsgService) {

        this.httpService = new VortexService(statusService, balloonMsg);

        let host = location.host.split(':')[0];
        VortexService.setVortexUrl(`ws://${host}:8344`);
        this.webSocketService = new VortexService(statusService, balloonMsg);
    }

    ngOnInit() {
    }

    testVortexHttpReconnect() {
        this.httpService.reconnect();
        console.log("HTTP Reconnect sent");
        return true;
    }

    testVortexWebSocketReconnect() {
        this.webSocketService.reconnect();
        console.log("WebSocket Reconnect sent");
        return true;
    }

}

