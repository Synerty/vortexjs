import { OnInit } from "@angular/core";
import { TupleOfflineStorageService } from "../../vortex/TupleOfflineStorageService";
import { Tuple } from "../../vortex/Tuple";
import { TupleSelector } from "../../vortex/TupleSelector";
export declare class OfflineTestTuple extends Tuple {
    testVal1: string;
    constructor();
}
export declare class TupleOfflineComponent implements OnInit {
    tupleOfflineStorageService: TupleOfflineStorageService;
    status: string;
    sampleTupleData: OfflineTestTuple[];
    loadedTupleData: OfflineTestTuple[];
    selectorMatch: TupleSelector;
    constructor(tupleOfflineStorageService: TupleOfflineStorageService);
    ngOnInit(): void;
    loadTest(): Promise<void>;
    saveTest(): Promise<void>;
}
