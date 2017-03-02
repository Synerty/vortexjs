import { OnInit } from "@angular/core";
import { VortexService } from "../../vortex/VortexService";
import { Ng2BalloonMsgService } from "@synerty/ng2-balloon-msg";
import { VortexStatusService } from "../../vortex/VortexStatusService";
export declare class VortexComponent implements OnInit {
    private statusService;
    private balloonMsg;
    httpService: VortexService;
    webSocketService: VortexService;
    constructor(statusService: VortexStatusService, balloonMsg: Ng2BalloonMsgService);
    ngOnInit(): void;
    testVortexHttpReconnect(): boolean;
    testVortexWebSocketReconnect(): boolean;
}
