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
var TupleStorageFactoryService_1 = require("./storage-factory/TupleStorageFactoryService");
var TupleOfflineStorageNameService_1 = require("./TupleOfflineStorageNameService");
var TupleOfflineStorageService = /** @class */ (function () {
    function TupleOfflineStorageService(storageFactory, tupleOfflineStorageServiceName) {
        this.storage = storageFactory.create(tupleOfflineStorageServiceName);
    }
    TupleOfflineStorageService.prototype.transaction = function (forWrite) {
        var _this = this;
        if (!this.storage.isOpen())
            return this.storage.open()
                .then(function () { return _this.storage.transaction(forWrite); });
        return this.storage.transaction(forWrite);
    };
    TupleOfflineStorageService.prototype.loadTuples = function (tupleSelector) {
        return this.transaction(false)
            .then(function (tx) {
            return tx.loadTuples(tupleSelector)
                .then(function (tuples) {
                // We have the tuples
                // close the transaction but disregard it's promise
                tx.close()
                    .catch(function (e) { return console.log("ERROR loadTuples: " + e); });
                return tuples;
            });
        });
    };
    TupleOfflineStorageService.prototype.loadTuplesEncoded = function (tupleSelector) {
        return this.transaction(false)
            .then(function (tx) {
            return tx.loadTuplesEncoded(tupleSelector)
                .then(function (vortexMsg) {
                // We have the tuples
                // close the transaction but disregard it's promise
                tx.close()
                    .catch(function (e) { return console.log("ERROR loadTuplesEncoded: " + e); });
                return vortexMsg;
            });
        });
    };
    TupleOfflineStorageService.prototype.saveTuples = function (tupleSelector, tuples) {
        return this.transaction(true)
            .then(function (tx) {
            return tx.saveTuples(tupleSelector, tuples)
                .then(function () {
                // Don't add the close to the promise chain
                tx.close()
                    .catch(function (e) { return console.log("ERROR saveTuples: " + e); });
            });
        });
    };
    TupleOfflineStorageService.prototype.saveTuplesEncoded = function (tupleSelector, vortexMsg) {
        return this.transaction(true)
            .then(function (tx) {
            return tx.saveTuplesEncoded(tupleSelector, vortexMsg)
                .then(function () {
                // Don't add the close to the promise chain
                tx.close()
                    .catch(function (e) { return console.log("ERROR saveTuplesEncoded: " + e); });
            });
        });
    };
    TupleOfflineStorageService.prototype.deleteTuples = function (tupleSelector) {
        return this.transaction(true)
            .then(function (tx) {
            return tx.deleteTuples(tupleSelector)
                .then(function () {
                tx.close()
                    .catch(function (e) { return console.log("ERROR deleteTuples: " + e); });
            });
        });
    };
    TupleOfflineStorageService.prototype.deleteOldTuples = function (deleteDataBeforeDate) {
        return this.transaction(true)
            .then(function (tx) {
            return tx.deleteOldTuples(deleteDataBeforeDate)
                .then(function () {
                tx.close()
                    .catch(function (e) { return console.log("ERROR deleteOldTuples: " + e); });
            });
        });
    };
    TupleOfflineStorageService.prototype.truncateStorage = function () {
        return this.storage.truncateStorage();
    };
    TupleOfflineStorageService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [TupleStorageFactoryService_1.TupleStorageFactoryService,
            TupleOfflineStorageNameService_1.TupleOfflineStorageNameService])
    ], TupleOfflineStorageService);
    return TupleOfflineStorageService;
}());
exports.TupleOfflineStorageService = TupleOfflineStorageService;
//# sourceMappingURL=/Users/jchesney/project/vortexjs/src/vortex/TupleOfflineStorageService.js.map