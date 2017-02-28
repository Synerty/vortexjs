import { OnInit } from "@angular/core";
import { TupleActionPushService } from "../../vortex/TupleActionPushService";
export declare class TupleActionComponent implements OnInit {
    private tupleActionService;
    log: string;
    constructor(tupleActionService: TupleActionPushService);
    ngOnInit(): void;
    sendSuccess(): void;
    sendFail(): void;
}
