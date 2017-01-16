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
var TupleOfflineStorageService_1 = require("../../vortex/TupleOfflineStorageService");
var Tuple_1 = require("../../vortex/Tuple");
var TupleSelector_1 = require("../../vortex/TupleSelector");
var OfflineTestTuple = (function (_super) {
    __extends(OfflineTestTuple, _super);
    function OfflineTestTuple() {
        var _this = _super.call(this, "vortex.test.OfflineTestTuple") || this;
        _this.testVal1 = "";
        return _this;
    }
    return OfflineTestTuple;
}(Tuple_1.Tuple));
exports.OfflineTestTuple = OfflineTestTuple;
var TupleOfflineComponent = (function () {
    function TupleOfflineComponent(tupleOfflineStorageService) {
        this.tupleOfflineStorageService = tupleOfflineStorageService;
        this.status = "";
        this.sampleTupleData = [];
        this.loadedTupleData = [];
        this.selectorMatch = new TupleSelector_1.TupleSelector("some name", {});
        for (var i = 0; i < 5; i++) {
            var t = new OfflineTestTuple();
            t.testVal1 = "#" + i + " Created " + new Date().toISOString();
            this.sampleTupleData.push(t);
        }
    }
    TupleOfflineComponent.prototype.ngOnInit = function () {
    };
    TupleOfflineComponent.prototype.loadTest = function () {
        var _this = this;
        return this.tupleOfflineStorageService
            .loadTuples(this.selectorMatch)
            .catch(function (err) { return _this.status = "ERR: loadTest: " + err; })
            .then(function (tuples) {
            _this.status = "Promise loadTest success";
            _this.loadedTupleData = tuples;
        });
    };
    TupleOfflineComponent.prototype.saveTest = function () {
        var _this = this;
        return this.tupleOfflineStorageService
            .saveTuples(this.selectorMatch, this.sampleTupleData)
            .catch(function (err) { return _this.status = "ERR: saveTest: " + err; })
            .then(function () {
            _this.status = "Promise saveTest success";
        });
    };
    return TupleOfflineComponent;
}());
TupleOfflineComponent = __decorate([
    core_1.Component({
        selector: 'app-tuple-offline',
        templateUrl: './tuple-offline.component.html',
        styleUrls: ['./tuple-offline.component.css']
    }),
    __metadata("design:paramtypes", [TupleOfflineStorageService_1.TupleOfflineStorageService])
], TupleOfflineComponent);
exports.TupleOfflineComponent = TupleOfflineComponent;
//# sourceMappingURL=/home/peek/project/vortexjs/src/src/app/tuple-offline/tuple-offline.component.js.map