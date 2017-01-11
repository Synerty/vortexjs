var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { ComponentLifecycleEventEmitter } from "./ComponentLifecycleEventEmitter";
var Ang2TupleLoaderTest = (function (_super) {
    __extends(Ang2TupleLoaderTest, _super);
    function Ang2TupleLoaderTest(vortexService) {
        var _this = _super.call(this) || this;
        _this.vortexService = vortexService;
        _this.tuples = [];
        _this.id = null;
        _this.loader = vortexService.createTupleLoader(_this, function () {
            return {
                key: "plugin_noop.tuple_loader.items",
                id: _this.id
            };
        });
        _this.loader.observable.subscribe(function (tuples) { return _this.tuples = tuples; });
        return _this;
    }
    return Ang2TupleLoaderTest;
}(ComponentLifecycleEventEmitter));
export { Ang2TupleLoaderTest };
//# sourceMappingURL=/home/peek/project/vortexjs/src/src/vortex/TupleLoaderTest.js.map