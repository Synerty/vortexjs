import { OnInit } from "@angular/core";
import { TupleDataObserverService } from "../../vortex/TupleDataObserverService";
import { Tuple } from "../../vortex/Tuple";
import { TupleSelector } from "../../vortex/TupleSelector";
export declare let testTupleSelector1: TupleSelector;
export declare let testTupleSelector2: TupleSelector;
export declare class TupleObserverComponent implements OnInit {
    private tupleDataObserver;
    testTuples1: Tuple[];
    testTuples2: Tuple[];
    constructor(tupleDataObserver: TupleDataObserverService);
    ngOnInit(): void;
}
