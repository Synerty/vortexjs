"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
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
var core_1 = require("@angular/core");
var VortexService_1 = require("./VortexService");
var VortexStatusService_1 = require("./VortexStatusService");
var TupleOfflineStorageService_1 = require("./TupleOfflineStorageService");
var TupleDataObserverService_1 = require("./TupleDataObserverService");
var TupleDataOfflineObserverService = /** @class */ (function (_super) {
    __extends(TupleDataOfflineObserverService, _super);
    function TupleDataOfflineObserverService(vortexService, vortexStatusService, zone, tupleDataObservableName, tupleOfflineStorageService) {
        var _this = _super.call(this, vortexService, vortexStatusService, zone, tupleDataObservableName) || this;
        _this.tupleOfflineStorageService = tupleOfflineStorageService;
        return _this;
    }
    TupleDataOfflineObserverService.prototype.subscribeToTupleSelector = function (tupleSelector) {
        var _this = this;
        var tsStr = tupleSelector.toOrderedJsonStr();
        if (this.cacheByTupleSelector.hasOwnProperty(tsStr)) {
            var cachedData_1 = this.cacheByTupleSelector[tsStr];
            // Emit the data 2 miliseconds later.
            setTimeout(function () {
                _super.prototype.notifyObservers.call(_this, cachedData_1, tupleSelector, cachedData_1.tuples);
            }, 2);
            return cachedData_1.subject;
        }
        var newCahcedData = new TupleDataObserverService_1.CachedSubscribedData();
        this.cacheByTupleSelector[tsStr] = newCahcedData;
        this.tellServerWeWantData([tupleSelector]);
        this.tupleOfflineStorageService
            .loadTuples(tupleSelector)
            .then(function (tuples) {
            // If the server has responded before we loaded the data, then just
            // ignore the cached data.
            if (newCahcedData.serverResponded)
                return;
            // Update the tuples, and notify if them
            newCahcedData.tuples = tuples;
            _super.prototype.notifyObservers.call(_this, newCahcedData, tupleSelector, tuples);
        })
            .catch(function (err) {
            _this.statusService.logError("loadTuples failed : " + err);
            throw new Error(err);
        });
        return newCahcedData.subject;
    };
    /** Update Offline State
     *
     * This method updates the offline stored data, which will be used until the next
     * update from the server comes along.
     * @param tupleSelector: The tuple selector to update tuples for
     * @param tuples: The new data to store
     */
    TupleDataOfflineObserverService.prototype.updateOfflineState = function (tupleSelector, tuples) {
        // AND store the data locally
        this.storeDataLocally(tupleSelector, tuples);
        var tsStr = tupleSelector.toOrderedJsonStr();
        if (this.cacheByTupleSelector.hasOwnProperty(tsStr)) {
            var cachedData = this.cacheByTupleSelector[tsStr];
            cachedData.tuples = tuples;
            _super.prototype.notifyObservers.call(this, cachedData, tupleSelector, tuples);
        }
    };
    TupleDataOfflineObserverService.prototype.notifyObservers = function (cachedData, tupleSelector, tuples) {
        // Pass the data on
        _super.prototype.notifyObservers.call(this, cachedData, tupleSelector, tuples);
        // AND store the data locally
        this.storeDataLocally(tupleSelector, tuples);
    };
    TupleDataOfflineObserverService.prototype.storeDataLocally = function (tupleSelector, tuples) {
        var _this = this;
        return this.tupleOfflineStorageService.saveTuples(tupleSelector, tuples)
            .catch(function (err) {
            _this.statusService.logError("saveTuples failed : " + err);
            throw new Error(err);
        });
    };
    TupleDataOfflineObserverService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [VortexService_1.VortexService,
            VortexStatusService_1.VortexStatusService,
            core_1.NgZone,
            TupleDataObserverService_1.TupleDataObservableNameService,
            TupleOfflineStorageService_1.TupleOfflineStorageService])
    ], TupleDataOfflineObserverService);
    return TupleDataOfflineObserverService;
}(TupleDataObserverService_1.TupleDataObserverService));
exports.TupleDataOfflineObserverService = TupleDataOfflineObserverService;
//# sourceMappingURL=/Users/jchesney/project/vortexjs/src/vortex/TupleDataOfflineObserverService.js.map