"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var UtilMisc_1 = require("./UtilMisc");
var Tuple_1 = require("./Tuple");
// export interface TupleSelectorJsonI {
//     name: string;
//     selector: { [name: string]: any };
// }
var TupleSelector = /** @class */ (function (_super) {
    __extends(TupleSelector, _super);
    function TupleSelector(name, selector) {
        var _this = _super.call(this, "vortex.TupleSelector") || this;
        _this.name = name;
        _this.selector = selector;
        return _this;
    }
    TupleSelector_1 = TupleSelector;
    TupleSelector.prototype.toOrderedJsonStr = function () {
        var fieldJsonDict = this.toJsonField(this.selector);
        return UtilMisc_1.jsonOrderedStringify({
            'name': this.name,
            'selector': fieldJsonDict
        });
    };
    TupleSelector.fromJsonStr = function (jsonStr) {
        var data = JSON.parse(jsonStr);
        var newTs = new TupleSelector_1(data.name, {});
        newTs.selector = newTs.fromJsonField(data.selector);
        return newTs;
    };
    var TupleSelector_1;
    TupleSelector = TupleSelector_1 = __decorate([
        Tuple_1.addTupleType,
        __metadata("design:paramtypes", [String, Object])
    ], TupleSelector);
    return TupleSelector;
}(Tuple_1.Tuple));
exports.TupleSelector = TupleSelector;
//# sourceMappingURL=TupleSelector.js.map