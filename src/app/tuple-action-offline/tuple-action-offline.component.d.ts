import { OnInit } from "@angular/core";
import { TupleActionPushOfflineService } from "../../vortex/TupleActionPushOfflineService";
import { VortexStatusService } from "../../vortex/VortexStatusService";
export declare class TupleActionOfflineComponent implements OnInit {
    private tupleActionOfflineService;
    private vortexStatusService;
    log: string;
    count: number;
    vortexIsOnline: boolean;
    constructor(tupleActionOfflineService: TupleActionPushOfflineService, vortexStatusService: VortexStatusService);
    ngOnInit(): void;
    sendSuccess(): void;
    sendFail(): void;
}
