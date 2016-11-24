import {Component, OnInit} from "@angular/core";
import {Tuple} from "../../vortex/Tuple";
import {assert} from "../../vortex/UtilMisc";
import {Payload} from "../../vortex/Payload";
import "../../vortex/UtilArray";
import {VortexService} from "../../vortex/Vortex";

export class TestTuple extends Tuple {
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
    aStrWithUnicode:string;

    constructor() {
        super('synerty.vortex.TestTuple')
    }
}

@Component({
    selector: 'app-tuple',
    templateUrl: './tuple.component.html',
    styleUrls: ['./tuple.component.css']
})
export class TupleComponent implements OnInit {

    constructor(public vortexService: VortexService) {
    }

    ngOnInit() {
    }


    public static testMakeTuple(): TestTuple {
        let tuple = new TestTuple();
        // 'TestTuple'

        tuple.aBoolTrue = true;
        tuple.aBoolFalse = false;
        tuple.aDate = new Date(2010, 4, 7, 2, 33, 19, 666);
        tuple.aFloat = 2.56;
        tuple.aInt = 1231231;
        tuple.aString = 'test string from 345345345@$#%#$%#$%#$%#';
        tuple.aStrWithUnicode = "— The dredded unicde char that OSX converts from --";
        tuple.aList = ['y', 3, true, 3.3];
        tuple.aDict = {
            'a': 'test str',
            1: 1.234
        };

        let subTuple = new TestTuple();
        // 'TestSubTuple'
        subTuple.subInt = 2048;
        tuple.aSubTuple = subTuple;

        tuple.aListOfSubTuples = [];
        for (let x = 0; x < 3; ++x) {
            let subTuple = new TestTuple();
            subTuple.subInt = x;
            tuple.aListOfSubTuples.add(subTuple);
        }

        return tuple;
    }

    testTupleEcho() {
        let tuple = TupleComponent.testMakeTuple();
        let payload = new Payload();
        payload.tuples.add(tuple);
        payload.filt['key'] = 'rapuiServerEcho';
        this.vortexService.sendPayload(payload);
        return true;
    }

    testTupleToFromTuple_ToJsonStr(tuple: Tuple): string {
        let jsonDict = tuple.toJsonDict();
        let jsonStr = JSON.stringify(jsonDict);
        console.log(jsonStr);
        return jsonStr;
    }

    testTupleToFromJsonStr_ToTuple(jsonStr: string): Tuple {
        let jsonDict = JSON.parse(jsonStr);
        return new Tuple().fromJsonDict(jsonDict);
    }

    testTupleToFromJson() {
        let origTuple = TupleComponent.testMakeTuple();
        let origJsonStr = this.testTupleToFromTuple_ToJsonStr(origTuple);
        console.log(origJsonStr);
        let tuple = this.testTupleToFromJsonStr_ToTuple(origJsonStr);
        let jsonStr = this.testTupleToFromTuple_ToJsonStr(tuple);
        assert(origTuple.equals(tuple), "testTupleToFromJson, Tuples objects do not match");
        console.log("origJsonStr == jsonStr");
        console.log(origJsonStr);
        console.log(jsonStr);
        assert(origJsonStr == jsonStr, "testTupleToFromJson, Tuples json strings do not match");
        return true;
    }

    testJsonableEquals() {
        let origTuple = TupleComponent.testMakeTuple();
        let origJsonStr = this.testTupleToFromTuple_ToJsonStr(origTuple);
        let tuple = <TestTuple> this.testTupleToFromJsonStr_ToTuple(origJsonStr);
        tuple.aListOfSubTuples.pop();
        assert(origTuple.equals(origTuple),
            "testJsonableEquals, Equals function says two identical objects don't match");
        assert(!origTuple.equals(tuple),
            "testJsonableEquals, Equals function didn't catch difference");
        return true;
    }
}
