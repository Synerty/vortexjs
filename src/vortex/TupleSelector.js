"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var UtilMisc_1 = require("./UtilMisc");
var Tuple_1 = require("./Tuple");
// export interface TupleSelectorJsonI {
//     name: string;
//     selector: { [name: string]: any };
// }
var TupleSelector = (function (_super) {
    __extends(TupleSelector, _super);
    function TupleSelector(name, selector) {
        var _this = _super.call(this, "vortex.TupleSelector") || this;
        _this.name = name;
        _this.selector = selector;
        return _this;
    }
    TupleSelector_1 = TupleSelector;
    TupleSelector.prototype.toOrderedJsonStr = function () {
        return UtilMisc_1.jsonOrderedStringify({
            'name': this.name,
            'selector': this.selector
        });
    };
    TupleSelector.fromJsonStr = function (jsonStr) {
        var args = JSON.parse(jsonStr);
        return new TupleSelector_1(args.name, args.selector);
    };
    TupleSelector = TupleSelector_1 = __decorate([
        Tuple_1.addTupleType,
        __metadata("design:paramtypes", [String, Object])
    ], TupleSelector);
    return TupleSelector;
    var TupleSelector_1;
}(Tuple_1.Tuple));
exports.TupleSelector = TupleSelector;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVHVwbGVTZWxlY3Rvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIlR1cGxlU2VsZWN0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSx1Q0FBZ0Q7QUFDaEQsaUNBQTRDO0FBRTVDLHdDQUF3QztBQUN4QyxvQkFBb0I7QUFDcEIseUNBQXlDO0FBQ3pDLElBQUk7QUFHSjtJQUFtQyxpQ0FBSztJQUVwQyx1QkFBbUIsSUFBWSxFQUNaLFFBQWlDO1FBRHBELFlBRUksa0JBQU0sc0JBQXNCLENBQUMsU0FFaEM7UUFKa0IsVUFBSSxHQUFKLElBQUksQ0FBUTtRQUNaLGNBQVEsR0FBUixRQUFRLENBQXlCOztJQUdwRCxDQUFDO3NCQU5RLGFBQWE7SUFRdEIsd0NBQWdCLEdBQWhCO1FBQ0ksTUFBTSxDQUFDLCtCQUFvQixDQUFDO1lBQ3hCLE1BQU0sRUFBRSxJQUFJLENBQUMsSUFBSTtZQUNqQixVQUFVLEVBQUUsSUFBSSxDQUFDLFFBQVE7U0FDNUIsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVNLHlCQUFXLEdBQWxCLFVBQW1CLE9BQWU7UUFDOUIsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUMvQixNQUFNLENBQUMsSUFBSSxlQUFhLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDdkQsQ0FBQztJQWxCUSxhQUFhO1FBRHpCLG9CQUFZOztPQUNBLGFBQWEsQ0FtQnpCO0lBQUQsb0JBQUM7O0NBQUEsQUFuQkQsQ0FBbUMsYUFBSyxHQW1CdkM7QUFuQlksc0NBQWEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge2pzb25PcmRlcmVkU3RyaW5naWZ5fSBmcm9tIFwiLi9VdGlsTWlzY1wiO1xuaW1wb3J0IHtUdXBsZSwgYWRkVHVwbGVUeXBlfSBmcm9tIFwiLi9UdXBsZVwiO1xuXG4vLyBleHBvcnQgaW50ZXJmYWNlIFR1cGxlU2VsZWN0b3JKc29uSSB7XG4vLyAgICAgbmFtZTogc3RyaW5nO1xuLy8gICAgIHNlbGVjdG9yOiB7IFtuYW1lOiBzdHJpbmddOiBhbnkgfTtcbi8vIH1cblxuQGFkZFR1cGxlVHlwZVxuZXhwb3J0IGNsYXNzIFR1cGxlU2VsZWN0b3IgZXh0ZW5kcyBUdXBsZSB7XG5cbiAgICBjb25zdHJ1Y3RvcihwdWJsaWMgbmFtZTogc3RyaW5nLFxuICAgICAgICAgICAgICAgIHB1YmxpYyBzZWxlY3RvcjogeyBbbmFtZTogc3RyaW5nXTogYW55IH0pIHtcbiAgICAgICAgc3VwZXIoXCJ2b3J0ZXguVHVwbGVTZWxlY3RvclwiKTtcblxuICAgIH1cblxuICAgIHRvT3JkZXJlZEpzb25TdHIoKTogc3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIGpzb25PcmRlcmVkU3RyaW5naWZ5KHtcbiAgICAgICAgICAgICduYW1lJzogdGhpcy5uYW1lLFxuICAgICAgICAgICAgJ3NlbGVjdG9yJzogdGhpcy5zZWxlY3RvclxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBzdGF0aWMgZnJvbUpzb25TdHIoanNvblN0cjogc3RyaW5nKTogVHVwbGVTZWxlY3RvciB7XG4gICAgICAgIGxldCBhcmdzID0gSlNPTi5wYXJzZShqc29uU3RyKTtcbiAgICAgICAgcmV0dXJuIG5ldyBUdXBsZVNlbGVjdG9yKGFyZ3MubmFtZSwgYXJncy5zZWxlY3Rvcik7XG4gICAgfVxufVxuIl19