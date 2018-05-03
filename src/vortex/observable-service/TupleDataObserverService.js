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
var TupleDataOfflineObserverService_1 = require("./TupleDataOfflineObserverService");
var TupleDataOfflineObserverService_2 = require("./TupleDataOfflineObserverService");
exports.TupleDataObservableNameService = TupleDataOfflineObserverService_2.TupleDataObservableNameService;
var TupleDataObserverService = /** @class */ (function () {
    function TupleDataObserverService(delegate, tupleDataObservableName) {
        this.delegate = delegate;
        this.tupleDataObservableName = tupleDataObservableName;
        var delegateName = delegate._nameService();
        if (!this.tupleDataObservableName.equals(delegateName)) {
            throw new Error("ERROR: The TupleDataObserverService was injected"
                + " with the wrong TupleDataOfflineObserverService name service"
                + (" " + delegateName + " VS " + this.tupleDataObservableName)
                + " ensure TupleDataOfflineObserverService is provided first.");
        }
    }
    TupleDataObserverService.prototype.pollForTuples = function (tupleSelector) {
        return this.delegate.pollForTuples(tupleSelector);
    };
    TupleDataObserverService.prototype.subscribeToTupleSelector = function (tupleSelector, enableCache) {
        if (enableCache === void 0) { enableCache = true; }
        return this.delegate.subscribeToTupleSelector(tupleSelector, enableCache, false);
    };
    TupleDataObserverService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [TupleDataOfflineObserverService_1.TupleDataOfflineObserverService,
            TupleDataOfflineObserverService_1.TupleDataObservableNameService])
    ], TupleDataObserverService);
    return TupleDataObserverService;
}());
exports.TupleDataObserverService = TupleDataObserverService;
//# sourceMappingURL=/Users/jchesney/project/vortexjs/src/vortex/observable-service/TupleDataObserverService.js.map