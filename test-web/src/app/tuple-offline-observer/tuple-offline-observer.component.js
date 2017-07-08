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
var TupleDataOfflineObserverService_1 = require("../../vortex/TupleDataOfflineObserverService");
var tuple_observer_component_1 = require("../tuple-observer/tuple-observer.component");
var TupleOfflineObserverComponent = (function () {
    function TupleOfflineObserverComponent(tupleDataOfflineObserver) {
        var _this = this;
        this.tupleDataOfflineObserver = tupleDataOfflineObserver;
        this.testTuples1 = [];
        this.testTuples2 = [];
        tupleDataOfflineObserver.subscribeToTupleSelector(tuple_observer_component_1.testTupleSelector1)
            .subscribe(function (tuples) { return _this.testTuples1 = tuples; });
        tupleDataOfflineObserver.subscribeToTupleSelector(tuple_observer_component_1.testTupleSelector2)
            .subscribe(function (tuples) { return _this.testTuples2 = tuples; });
    }
    TupleOfflineObserverComponent.prototype.ngOnInit = function () {
    };
    return TupleOfflineObserverComponent;
}());
TupleOfflineObserverComponent = __decorate([
    core_1.Component({
        selector: 'app-tuple-offline-observer',
        templateUrl: './tuple-offline-observer.component.html',
        styleUrls: ['./tuple-offline-observer.component.css']
    }),
    __metadata("design:paramtypes", [TupleDataOfflineObserverService_1.TupleDataOfflineObserverService])
], TupleOfflineObserverComponent);
exports.TupleOfflineObserverComponent = TupleOfflineObserverComponent;
//# sourceMappingURL=/home/peek/project/vortexjs/src/app/tuple-offline-observer/tuple-offline-observer.component.js.map