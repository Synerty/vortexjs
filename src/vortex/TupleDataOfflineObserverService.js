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
var VortexService_1 = require("./VortexService");
var VortexStatusService_1 = require("./VortexStatusService");
var TupleOfflineStorageService_1 = require("./TupleOfflineStorageService");
var TupleDataObserverService_1 = require("./TupleDataObserverService");
var TupleDataOfflineObserverService = (function (_super) {
    __extends(TupleDataOfflineObserverService, _super);
    function TupleDataOfflineObserverService(vortexService, vortexStatusService, zone, tupleDataObservableName, tupleOfflineStorageService) {
        var _this = _super.call(this, vortexService, vortexStatusService, zone, tupleDataObservableName) || this;
        _this.tupleOfflineStorageService = tupleOfflineStorageService;
        return _this;
    }
    TupleDataOfflineObserverService.prototype.subscribeToTupleSelector = function (tupleSelector) {
        var _this = this;
        var subject = _super.prototype.subscribeToTupleSelector.call(this, tupleSelector);
        // Make note of the first time the server receives data
        var subscriptionActive = subject.subscribe(function () {
            subscriptionActive.unsubscribe();
            subscriptionActive = null;
        });
        this.tupleOfflineStorageService.loadTuples(tupleSelector)
            .then(function (tuples) { return subscriptionActive != null && subject.next(tuples); })
            .catch(function (err) {
            _this.statusService.logError("loadTuples failed : " + err);
            throw new Error(err);
        });
        return subject;
    };
    /** Update Offline State
     *
     * This method updates the offline stored data, which will be used until the next
     * update from the server comes along.
     * @param tupleSelector: The tuple selector to update tuples for
     * @param tuples: The new data to store
     */
    TupleDataOfflineObserverService.prototype.updateOfflineState = function (tupleSelector, tuples) {
        this.tupleOfflineStorageService.saveTuples(tupleSelector, tuples);
    };
    TupleDataOfflineObserverService.prototype.notifyObservers = function (subject, tupleSelector, tuples) {
        var _this = this;
        // Pass the data on
        _super.prototype.notifyObservers.call(this, subject, tupleSelector, tuples);
        // AND store the data locally
        this.tupleOfflineStorageService.saveTuples(tupleSelector, tuples)
            .catch(function (err) {
            _this.statusService.logError("saveTuples failed : " + err);
            throw new Error(err);
        });
    };
    return TupleDataOfflineObserverService;
}(TupleDataObserverService_1.TupleDataObserverService));
TupleDataOfflineObserverService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [VortexService_1.VortexService,
        VortexStatusService_1.VortexStatusService,
        core_1.NgZone,
        TupleDataObserverService_1.TupleDataObservableNameService,
        TupleOfflineStorageService_1.TupleOfflineStorageService])
], TupleDataOfflineObserverService);
exports.TupleDataOfflineObserverService = TupleDataOfflineObserverService;
//# sourceMappingURL=/home/peek/project/vortexjs/src/vortex/TupleDataOfflineObserverService.js.map