import { OnInit } from "@angular/core";
import { TupleDataOfflineObserverService } from "../../vortex/TupleDataOfflineObserverService";
import { Tuple } from "../../vortex/Tuple";
export declare class TupleOfflineObserverComponent implements OnInit {
    private tupleDataOfflineObserver;
    testTuples1: Tuple[];
    testTuples2: Tuple[];
    constructor(tupleDataOfflineObserver: TupleDataOfflineObserverService);
    ngOnInit(): void;
}
