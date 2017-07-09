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
var TupleStorageServiceABC_1 = require("./TupleStorageServiceABC");
var TupleOfflineStorageNameService_1 = require("../TupleOfflineStorageNameService");
var Payload_1 = require("../Payload");
var indexedDB = window.indexedDB || window.mozIndexedDB
    || window.webkitIndexedDB || window.msIndexedDB;
var IDBTransaction = window.IDBTransaction
    || window.webkitIDBTransaction || window.msIDBTransaction;
var IDBKeyRange = window.IDBKeyRange
    || window.webkitIDBKeyRange || window.msIDBKeyRange;
function supportsIndexedDb() {
    return !!indexedDB;
}
exports.supportsIndexedDb = supportsIndexedDb;
// ----------------------------------------------------------------------------
function now() {
    return now();
}
var IDBException = (function () {
    function IDBException(message) {
        this.message = message;
    }
    IDBException.prototype.toString = function () {
        return 'IndexedDB : IDBException: ' + this.message;
    };
    return IDBException;
}());
function addIndexedDbHandlers(request, stacktraceFunctor) {
    var _this = this;
    request.onerror = function (request) {
        console.log(UtilMisc_1.dateStr() + "IndexedDB : ERROR " + request.target.error);
        _this.balloonMsg.showError("IndexedDB : ERROR " + request.target.error);
        stacktraceFunctor();
    };
    request.onabort = function (request) {
        console.log(UtilMisc_1.dateStr() + "IndexedDB : ABORT " + request.target.error);
        _this.balloonMsg.showError("IndexedDB : ABORT " + request.target.error);
        stacktraceFunctor();
    };
    request.onblock = function (request) {
        console.log(UtilMisc_1.dateStr() + "IndexedDB : BLOCKED " + request.target.error);
        _this.balloonMsg.showError("IndexedDB : BLOCKED " + request.target.error);
        stacktraceFunctor();
    };
}
var TUPLE_STORE = "tuples";
/** Tuple Storage IndexedDB
 *
 * This class handles storing and retrieving tuples to/from indexed db.
 *
 */
var TupleIndexedDbService = (function (_super) {
    __extends(TupleIndexedDbService, _super);
    function TupleIndexedDbService(name) {
        return _super.call(this, name) || this;
    }
    // ----------------------------------------------------------------------------
    // Open the indexed db database
    TupleIndexedDbService.prototype.open = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            // DISP Store
            var request = indexedDB.open(_this.dbName, 1);
            addIndexedDbHandlers(request, function () {
                var msg = UtilMisc_1.dateStr() + " IndexedDB : \"" + _this.dbName + "\" "
                    + "Failed to open IndexedDB database";
                reject(msg);
                throw new IDBException(msg);
            });
            request.onsuccess = function (event) {
                console.log(UtilMisc_1.dateStr() + " IndexedDB : \"" + _this.dbName + "\" Success opening DB");
                if (_this.db == null) {
                    _this.db = event.target.result;
                    resolve();
                }
            };
            request.onupgradeneeded = function (event) {
                console.log(UtilMisc_1.dateStr() + " IndexedDB : \"" + _this.dbName + "\" Upgrading");
                var db = event.target.result;
                // SCHEMA for database points
                var gridStore = db.createObjectStore(TUPLE_STORE, { keyPath: "tupleSelector" });
                console.log(UtilMisc_1.dateStr() + " IndexedDB : \"" + _this.dbName + "\" Upgrade Success");
                if (_this.db == null) {
                    _this.db = db;
                    resolve();
                }
            };
        });
    };
    // ----------------------------------------------------------------------------
    // Check if the DB is open
    TupleIndexedDbService.prototype.isOpen = function () {
        return this.db != null;
    };
    ;
    TupleIndexedDbService.prototype.close = function () {
        if (!this.isOpen()) {
            throw new Error("IndexedDB \"" + this.dbName + "\" is not open");
        }
        this.db.close();
        this.db = null;
    };
    TupleIndexedDbService.prototype.transaction = function (forWrite) {
        // Get the Read Only case out the way, it's easy
        var mode = forWrite ? "readwrite" : "readonly";
        return Promise.resolve(new TupleIndexedDbTransaction(this.db.transaction(TUPLE_STORE, mode), forWrite));
    };
    return TupleIndexedDbService;
}(TupleStorageServiceABC_1.TupleStorageServiceABC));
TupleIndexedDbService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [TupleOfflineStorageNameService_1.TupleOfflineStorageNameService])
], TupleIndexedDbService);
exports.TupleIndexedDbService = TupleIndexedDbService;
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
            addIndexedDbHandlers(request, function () {
                var msg = UtilMisc_1.dateStr() + " IndexedDB: Index open cursor";
                reject(msg);
                throw new IDBException(msg);
            });
            request.onsuccess = function () {
                var tuples = [];
                var timeTaken = now() - startTime;
                console.log(UtilMisc_1.dateStr() + " IndexedDB: loadTuples took " + timeTaken + "ms (in thread)");
                // Called for each matching record
                var data = request.result;
                if (data != null) {
                    var startTime_1 = now();
                    tuples = Payload_1.Payload.fromVortexMsg(data.payload).tuples;
                    var timeTaken_1 = now() - startTime_1;
                    console.log(UtilMisc_1.dateStr() + " IndexedDB: fromVortexMsg took " + timeTaken_1 + "ms ");
                }
                resolve(tuples);
            };
        });
    };
    ;
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
        var payloadData = new Payload_1.Payload({}, tuples).toVortexMsg();
        var tupleSelectorStr = tupleSelector.toOrderedJsonStr();
        var item = {
            tupleSelector: tupleSelectorStr,
            dateTime: new Date(),
            payload: payloadData
        };
        var timeTaken = now() - startTime;
        console.log(UtilMisc_1.dateStr() + " IndexedDB: toVortexMsg took " + timeTaken + "ms ");
        startTime = now();
        return new Promise(function (resolve, reject) {
            // Run the inserts
            var response = _this.store.put(item);
            addIndexedDbHandlers(response, function () {
                reject(UtilMisc_1.dateStr() + " IndexedDB: saveTuples \"put\" error");
                throw new IDBException("Put error");
            });
            response.oncomplete = function () {
                var timeTaken = now() - startTime;
                console.log(UtilMisc_1.dateStr() + " IndexedDB: saveTuples"
                    + (" took " + timeTaken + "ms (in thread)")
                    + (" Inserted/updated " + tuples.length + " tuples"));
                resolve();
            };
        });
    };
    ;
    TupleIndexedDbTransaction.prototype.close = function () {
        return Promise.resolve();
        /* Close transaction ???

         addIndexedDbHandlers(this.tx, () => {
         reject();
         throw new IDBException("Transaction error");
         });

         // LOOK HERE, I'm looking at the WebSQL and IndexedDb implementation and both
         // appear to only provide single use transactions like this.
         // Considering that fact, The "TupleTransaction" api seems useless.
         this.tx.oncomplete = () => {
         let timeTaken = now() - startTime;
         console.log(`${dateStr()} IndexedDB: saveTuples`
         + ` took ${timeTaken}ms (in thread)`
         + ` Inserted/updated ${tuples.length} tuples`);
         resolve();
         };

         */
    };
    return TupleIndexedDbTransaction;
}());
//# sourceMappingURL=/home/peek/project/vortexjs/src/vortex/storage/TupleIndexedDbService.js.map