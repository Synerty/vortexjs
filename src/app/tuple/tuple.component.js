"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var Tuple_1 = require("../../vortex/Tuple");
var UtilMisc_1 = require("../../vortex/UtilMisc");
var Payload_1 = require("../../vortex/Payload");
require("../../vortex/UtilArray");
var VortexService_1 = require("../../vortex/VortexService");
var TestTuple = (function (_super) {
    __extends(TestTuple, _super);
    function TestTuple() {
        return _super.call(this, 'synerty.vortex.TestTuple') || this;
    }
    return TestTuple;
}(Tuple_1.Tuple));
exports.TestTuple = TestTuple;
var TupleComponent = TupleComponent_1 = (function () {
    function TupleComponent(vortexService) {
        this.vortexService = vortexService;
    }
    TupleComponent.prototype.ngOnInit = function () {
    };
    TupleComponent.testMakeTuple = function () {
        var tuple = new TestTuple();
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
        var subTuple = new TestTuple();
        // 'TestSubTuple'
        subTuple.subInt = 2048;
        tuple.aSubTuple = subTuple;
        tuple.aListOfSubTuples = [];
        for (var x = 0; x < 3; ++x) {
            var subTuple_1 = new TestTuple();
            subTuple_1.subInt = x;
            tuple.aListOfSubTuples.add(subTuple_1);
        }
        return tuple;
    };
    TupleComponent.prototype.testTupleEcho = function () {
        var tuple = TupleComponent_1.testMakeTuple();
        var payload = new Payload_1.Payload();
        payload.tuples.add(tuple);
        payload.filt['key'] = 'rapuiServerEcho';
        this.vortexService.sendPayload(payload);
        return true;
    };
    TupleComponent.prototype.testTupleToFromTuple_ToJsonStr = function (tuple) {
        var jsonDict = tuple.toJsonDict();
        var jsonStr = JSON.stringify(jsonDict);
        console.log(jsonStr);
        return jsonStr;
    };
    TupleComponent.prototype.testTupleToFromJsonStr_ToTuple = function (jsonStr) {
        var jsonDict = JSON.parse(jsonStr);
        return new Tuple_1.Tuple().fromJsonDict(jsonDict);
    };
    TupleComponent.prototype.testTupleToFromJson = function () {
        var origTuple = TupleComponent_1.testMakeTuple();
        var origJsonStr = this.testTupleToFromTuple_ToJsonStr(origTuple);
        console.log(origJsonStr);
        var tuple = this.testTupleToFromJsonStr_ToTuple(origJsonStr);
        var jsonStr = this.testTupleToFromTuple_ToJsonStr(tuple);
        UtilMisc_1.assert(origTuple.equals(tuple), "testTupleToFromJson, Tuples objects do not match");
        console.log("origJsonStr == jsonStr");
        console.log(origJsonStr);
        console.log(jsonStr);
        UtilMisc_1.assert(origJsonStr == jsonStr, "testTupleToFromJson, Tuples json strings do not match");
        return true;
    };
    TupleComponent.prototype.testJsonableEquals = function () {
        var origTuple = TupleComponent_1.testMakeTuple();
        var origJsonStr = this.testTupleToFromTuple_ToJsonStr(origTuple);
        var tuple = this.testTupleToFromJsonStr_ToTuple(origJsonStr);
        tuple.aListOfSubTuples.pop();
        UtilMisc_1.assert(origTuple.equals(origTuple), "testJsonableEquals, Equals function says two identical objects don't match");
        UtilMisc_1.assert(!origTuple.equals(tuple), "testJsonableEquals, Equals function didn't catch difference");
        return true;
    };
    return TupleComponent;
}());
TupleComponent = TupleComponent_1 = __decorate([
    core_1.Component({
        selector: 'app-tuple',
        templateUrl: './tuple.component.html',
        styleUrls: ['./tuple.component.css']
    }),
    __metadata("design:paramtypes", [VortexService_1.VortexService])
], TupleComponent);
exports.TupleComponent = TupleComponent;
var TupleComponent_1;
//# sourceMappingURL=/home/peek/project/vortexjs/src/src/app/tuple/tuple.component.js.map