"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var TupleDataObserverService_1 = require("../../vortex/TupleDataObserverService");
var TupleSelector_1 = require("../../vortex/TupleSelector");
exports.testTupleSelector1 = new TupleSelector_1.TupleSelector("testTuples1", { "count": 4 });
exports.testTupleSelector2 = new TupleSelector_1.TupleSelector("testTuples2", { "count": 7 });
var TupleObserverComponent = (function () {
    function TupleObserverComponent(tupleDataObserver) {
        var _this = this;
        this.tupleDataObserver = tupleDataObserver;
        this.testTuples1 = [];
        this.testTuples2 = [];
        tupleDataObserver.subscribeToTupleSelector(exports.testTupleSelector1)
            .subscribe(function (tuples) { return _this.testTuples1 = tuples; });
        tupleDataObserver.subscribeToTupleSelector(exports.testTupleSelector2)
            .subscribe(function (tuples) { return _this.testTuples2 = tuples; });
    }
    TupleObserverComponent.prototype.ngOnInit = function () {
    };
    return TupleObserverComponent;
}());
TupleObserverComponent = __decorate([
    core_1.Component({
        selector: 'app-tuple-observer',
        templateUrl: './tuple-observer.component.html',
        styleUrls: ['./tuple-observer.component.css']
    }),
    __metadata("design:paramtypes", [TupleDataObserverService_1.TupleDataObserverService])
], TupleObserverComponent);
exports.TupleObserverComponent = TupleObserverComponent;
//# sourceMappingURL=/home/peek/project/vortexjs/src/app/tuple-observer/tuple-observer.component.js.map