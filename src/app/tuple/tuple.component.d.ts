import { OnInit } from "@angular/core";
import { Tuple } from "../../vortex/Tuple";
import "../../vortex/UtilArray";
import { VortexService } from "../../vortex/VortexService";
export declare class TestTuple extends Tuple {
    aBoolTrue: boolean;
    aBoolFalse: boolean;
    aDict: {};
    aList: any[];
    aString: string;
    aInt: number;
    aFloat: number;
    aDate: Date;
    aListOfSubTuples: Tuple[];
    subInt: number;
    aSubTuple: Tuple;
    aStrWithUnicode: string;
    constructor();
}
export declare class TupleComponent implements OnInit {
    vortexService: VortexService;
    constructor(vortexService: VortexService);
    ngOnInit(): void;
    static testMakeTuple(): TestTuple;
    testTupleEcho(): boolean;
    testTupleToFromTuple_ToJsonStr(tuple: Tuple): string;
    testTupleToFromJsonStr_ToTuple(jsonStr: string): Tuple;
    testTupleToFromJson(): boolean;
    testJsonableEquals(): boolean;
}
