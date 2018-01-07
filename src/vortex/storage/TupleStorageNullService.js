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
var TupleStorageServiceABC_1 = require("./TupleStorageServiceABC");
var TupleOfflineStorageNameService_1 = require("../TupleOfflineStorageNameService");
var UtilMisc_1 = require("../UtilMisc");
// ----------------------------------------------------------------------------
var TupleStorageNullService = /** @class */ (function (_super) {
    __extends(TupleStorageNullService, _super);
    function TupleStorageNullService(name) {
        return _super.call(this, name) || this;
    }
    TupleStorageNullService.prototype.open = function () {
        return Promise.resolve();
    };
    TupleStorageNullService.prototype.isOpen = function () {
        return true; // sure
    };
    TupleStorageNullService.prototype.close = function () {
    };
    TupleStorageNullService.prototype.transaction = function (forWrite) {
        return Promise.resolve(new TupleNullTransaction(forWrite));
    };
    TupleStorageNullService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [TupleOfflineStorageNameService_1.TupleOfflineStorageNameService])
    ], TupleStorageNullService);
    return TupleStorageNullService;
}(TupleStorageServiceABC_1.TupleStorageServiceABC));
exports.TupleStorageNullService = TupleStorageNullService;
var TupleNullTransaction = /** @class */ (function () {
    function TupleNullTransaction(txForWrite) {
        this.txForWrite = txForWrite;
    }
    TupleNullTransaction.prototype.loadTuples = function (tupleSelector) {
        console.log("TupleStorageNullService.tupleSelector " + tupleSelector.toOrderedJsonStr());
        return Promise.resolve([]);
    };
    TupleNullTransaction.prototype.loadTuplesEncoded = function (tupleSelector) {
        console.log("TupleStorageNullService.tupleSelector " + tupleSelector.toOrderedJsonStr());
        return Promise.resolve(null);
    };
    TupleNullTransaction.prototype.saveTuples = function (tupleSelector, tuples) {
        return this.saveTuplesEncoded(tupleSelector, 'TupleStorageNullService');
    };
    TupleNullTransaction.prototype.saveTuplesEncoded = function (tupleSelector, vortexMsg) {
        if (!this.txForWrite) {
            var msg = "Null Storage: saveTuples attempted on read only TX";
            console.log(UtilMisc_1.dateStr() + " " + msg);
            return Promise.reject(msg);
        }
        console.log("TupleStorageNullService.saveTuples " + tupleSelector.toOrderedJsonStr());
        return Promise.resolve();
    };
    TupleNullTransaction.prototype.close = function () {
        return Promise.resolve();
    };
    return TupleNullTransaction;
}());
//# sourceMappingURL=/Users/jchesney/project/vortexjs/src/vortex/storage/TupleStorageNullService.js.map