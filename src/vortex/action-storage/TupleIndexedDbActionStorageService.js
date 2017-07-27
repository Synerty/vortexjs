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
var UtilMisc_1 = require("../UtilMisc");
var Payload_1 = require("../Payload");
var TupleActionStorageServiceABC_1 = require("./TupleActionStorageServiceABC");
var IndexedDb_1 = require("../storage/IndexedDb");
// ----------------------------------------------------------------------------
function now() {
    return new Date();
}
var DB_NAME = "tupleActions";
var TUPLE_STORE = "tupleActions";
/** Tuple Storage IndexedDB
 *
 * This class handles storing and retrieving tuples to/from indexed db.
 *
 */
var TupleIndexedDbActionStorageService = (function (_super) {
    __extends(TupleIndexedDbActionStorageService, _super);
    function TupleIndexedDbActionStorageService() {
        var _this = _super.call(this) || this;
        _this.openInProgressPromise = null;
        return _this;
    }
    TupleIndexedDbActionStorageService.prototype.storeAction = function (scope, tupleAction, payload) {
    };
    TupleIndexedDbActionStorageService.prototype.loadNextAction = function () {
    };
    TupleIndexedDbActionStorageService.prototype.countActions = function () {
    };
    TupleIndexedDbActionStorageService.prototype.deleteAction = function (scope, actionUuid) {
    };
    // ----------------------------------------------------------------------------
    // Open the indexed db database
    TupleIndexedDbActionStorageService.prototype.open = function () {
        var _this = this;
        if (this.openInProgressPromise != null)
            return this.openInProgressPromise;
        this.openInProgressPromise = new Promise(function (resolve, reject) {
            // DISP Store
            var request = indexedDB.open(DB_NAME, 1);
            IndexedDb_1.addIndexedDbHandlers(request, function () {
                var msg = UtilMisc_1.dateStr() + " IndexedDB : \"" + DB_NAME + "\" "
                    + "Failed to open IndexedDB database";
                _this.openInProgressPromise = null;
                reject(msg);
                throw new IndexedDb_1.IDBException(msg);
            });
            request.onsuccess = function (event) {
                console.log(UtilMisc_1.dateStr() + " IndexedDB : \"" + DB_NAME + "\" Success opening DB");
                if (_this.db == null) {
                    _this.db = event.target.result;
                    _this.openInProgressPromise = null;
                    resolve();
                }
            };
            request.onupgradeneeded = function (event) {
                console.log(UtilMisc_1.dateStr() + " IndexedDB : \"" + DB_NAME + "\" Upgrading");
                var db = event.target.result;
                // SCHEMA for database points
                // Schema Version 1
                db.createObjectStore(TUPLE_STORE, { keyPath: "tupleSelector" });
                console.log(UtilMisc_1.dateStr() + " IndexedDB : \"" + DB_NAME + "\" Upgrade Success");
            };
        });
        return this.openInProgressPromise;
    };
    // ----------------------------------------------------------------------------
    // Check if the DB is open
    TupleIndexedDbActionStorageService.prototype.isOpen = function () {
        return this.db != null;
    };
    ;
    TupleIndexedDbActionStorageService.prototype.close = function () {
        if (!this.isOpen()) {
            throw new Error("IndexedDB \"" + DB_NAME + "\" is not open");
        }
        this.db.close();
        this.db = null;
    };
    TupleIndexedDbActionStorageService.prototype.transaction = function (forWrite) {
        if (!this.isOpen())
            throw new Error("IndexedDB " + DB_NAME + " is not open");
        // Get the Read Only case out the way, it's easy
        var mode = forWrite ? "readwrite" : "readonly";
        return Promise.resolve(new TupleIndexedDbTransaction(this.db.transaction(TUPLE_STORE, mode), forWrite));
    };
    return TupleIndexedDbActionStorageService;
}(TupleActionStorageServiceABC_1.TupleActionStorageServiceABC));
TupleIndexedDbActionStorageService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [])
], TupleIndexedDbActionStorageService);
exports.TupleIndexedDbActionStorageService = TupleIndexedDbActionStorageService;
var TupleIndexedDbTransaction = (function () {
    function TupleIndexedDbTransaction(tx, txForWrite) {
        this.tx = tx;
        this.txForWrite = txForWrite;
        this.store = this.tx.objectStore(TUPLE_STORE);
    }
    // ----------------------------------------------------------------------------
    // Load the display items from the cache
    TupleIndexedDbTransaction.prototype.loadTuples = function (tupleSelector) {
        var _this = this;
        var startTime = now();
        return new Promise(function (resolve, reject) {
            var request = _this.store.get(tupleSelector.toOrderedJsonStr());
            IndexedDb_1.addIndexedDbHandlers(request, function () {
                var msg = UtilMisc_1.dateStr() + " IndexedDB: Index open cursor";
                reject(msg);
                throw new IndexedDb_1.IDBException(msg);
            });
            request.onsuccess = function () {
                var timeTaken = now() - startTime;
                console.log(UtilMisc_1.dateStr() + " IndexedDB: loadTuples took " + timeTaken + "ms (in thread)");
                // Called for each matching record
                var data = request.result;
                if (data == null) {
                    resolve([]);
                    return;
                }
                Payload_1.Payload.fromVortexMsg(data.payload)
                    .then(function (payload) { return resolve(payload.tuples); })
                    .catch(function (e) { return reject(e); });
            };
        });
    };
    // ----------------------------------------------------------------------------
    // Add disply items to the cache
    TupleIndexedDbTransaction.prototype.saveTuples = function (tupleSelector, tuples) {
        var _this = this;
        if (!this.txForWrite) {
            var msg = "IndexedDB: saveTuples attempted on read only TX";
            console.log(UtilMisc_1.dateStr() + " " + msg);
            return Promise.reject(msg);
        }
        var startTime = now();
        // The payload is a convenient way to serialise and compress the data
        return new Payload_1.Payload({}, tuples).toVortexMsg()
            .then(function (vortexMsg) {
            var tupleSelectorStr = tupleSelector.toOrderedJsonStr();
            var item = {
                tupleSelector: tupleSelectorStr,
                dateTime: new Date(),
                payload: vortexMsg
            };
            var timeTaken = now() - startTime;
            console.log(UtilMisc_1.dateStr() + " IndexedDB: toVortexMsg took " + timeTaken + "ms ");
            startTime = now();
            return new Promise(function (resolve, reject) {
                // Run the inserts
                var response = _this.store.put(item);
                IndexedDb_1.addIndexedDbHandlers(response, function () {
                    reject(UtilMisc_1.dateStr() + " IndexedDB: saveTuples \"put\" error");
                    throw new IndexedDb_1.IDBException("Put error");
                });
                response.oncomplete = function () {
                    var timeTaken = now() - startTime;
                    console.log(UtilMisc_1.dateStr() + " IndexedDB: saveTuples"
                        + (" took " + timeTaken + "ms (in thread)")
                        + (" Inserted/updated " + tuples.length + " tuples"));
                    resolve();
                };
            });
        });
    };
    ;
    TupleIndexedDbTransaction.prototype.close = function () {
        return Promise.resolve();
    };
    return TupleIndexedDbTransaction;
}());
//# sourceMappingURL=/home/peek/project/vortexjs/src/vortex/action-storage/TupleIndexedDbActionStorageService.js.map