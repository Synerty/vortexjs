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
var tuple_component_1 = require("../tuple/tuple.component");
var VortexService_1 = require("../../vortex/VortexService");
var ComponentLifecycleEventEmitter_1 = require("../../vortex/ComponentLifecycleEventEmitter");
var TupleLoaderComponent = (function (_super) {
    __extends(TupleLoaderComponent, _super);
    function TupleLoaderComponent(vortexService) {
        var _this = _super.call(this) || this;
        _this.vortexService = vortexService;
        _this.tupleId = 1;
        _this.tuples = [];
        _this.loader = vortexService.createTupleLoader(_this, function () {
            return {
                id: _this.tupleId,
                key: "vortex.tuple-loader.test.data"
            };
        });
        _this.loader.observable.subscribe(function (tuples) { return _this.tuples = tuples; });
        return _this;
    }
    TupleLoaderComponent.prototype.ngOnInit = function () {
    };
    TupleLoaderComponent.prototype.addNew = function () {
        var newTuple = new tuple_component_1.TestTuple();
        newTuple.aString = "New Tuple #" + this.tuples.length;
        this.tuples.push(newTuple);
    };
    return TupleLoaderComponent;
}(ComponentLifecycleEventEmitter_1.ComponentLifecycleEventEmitter));
TupleLoaderComponent = __decorate([
    core_1.Component({
        selector: 'app-tuple-loader',
        templateUrl: './tuple-loader.component.html',
        styleUrls: ['./tuple-loader.component.css']
    }),
    __metadata("design:paramtypes", [VortexService_1.VortexService])
], TupleLoaderComponent);
exports.TupleLoaderComponent = TupleLoaderComponent;
//# sourceMappingURL=/home/peek/project/vortexjs/src/app/tuple-loader/tuple-loader.component.js.map