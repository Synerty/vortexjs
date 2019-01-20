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
var ACTION_STORE = "tupleActions";
var ACTION_KEY_PATH = "scopeUuid";
/** Tuple Storage IndexedDB
 *
 * This class handles storing and retrieving tuples to/from indexed db.
 *
 */
var TupleActionStorageIndexedDbService = /** @class */ (function (_super) {
    __extends(TupleActionStorageIndexedDbService, _super);
    function TupleActionStorageIndexedDbService() {
        var _this = _super.call(this) || this;
        _this.openInProgressPromise = null;
        return _this;
    }
    TupleActionStorageIndexedDbService.prototype.storeAction = function (scope, tupleAction, payload) {
        var startTime = now();
        var retval = this.transaction(true)
            .then(function (tx) {
            var store = tx.objectStore(ACTION_STORE);
            return new Payload_1.Payload({}, [tupleAction]).toEncodedPayload()
                .then(function (vortexMsg) {
                var item = {
                    scope: scope,
                    scopeUuid: scope + "|" + tupleAction.uuid,
                    encodedPayload: vortexMsg
                };
                var timeTaken = now() - startTime;
                console.log(UtilMisc_1.dateStr() + " IndexedDB: toVortexMsg took " + timeTaken + "ms ");
                startTime = now();
                return new Promise(function (resolve, reject) {
                    // Run the inserts
                    var response = store.put(item);
                    IndexedDb_1.addIndexedDbHandlers(response, function () {
                        reject(UtilMisc_1.dateStr() + " IndexedDB: saveTuples \"put\" error");
                        throw new IndexedDb_1.IDBException("Put error");
                    });
                    response.oncomplete = function () {
                        var timeTaken = now() - startTime;
                        console.log(UtilMisc_1.dateStr() + " IndexedDB: storeAction"
                            + (" took " + timeTaken + "ms (in thread)"));
                        resolve();
                    };
                });
            });
        });
        return retval;
    };
    TupleActionStorageIndexedDbService.prototype.loadNextAction = function () {
        return this.transaction(false)
            .then(function (tx) {
            var store = tx.objectStore(ACTION_STORE);
            return new Promise(function (resolve, reject) {
                // Run the inserts
                var response = store.openCursor();
                IndexedDb_1.addIndexedDbHandlers(response, function () {
                    reject(UtilMisc_1.dateStr() + " IndexedDB: saveTuples \"put\" error");
                    throw new IndexedDb_1.IDBException("Put error");
                });
                response.oncomplete = function (ev) {
                    var cursor = response.result || ev.target.result;
                    if (!!cursor == false) {
                        resolve(new Payload_1.Payload());
                        return;
                    }
                    Payload_1.Payload.fromEncodedPayload(cursor.value.encodedPayload)
                        .then(function (payload) {
                        resolve(payload);
                        try {
                            tx.abort();
                        }
                        catch (e) {
                            console.log(e);
                        }
                    })
                        .catch(function (e) { return reject(e); });
                };
            });
        });
    };
    TupleActionStorageIndexedDbService.prototype.countActions = function () {
        return this.transaction(false)
            .then(function (tx) {
            var store = tx.objectStore(ACTION_STORE);
            return new Promise(function (resolve, reject) {
                // Run the inserts
                var response = store.count();
                IndexedDb_1.addIndexedDbHandlers(response, function () {
                    reject(UtilMisc_1.dateStr() + " IndexedDB: saveTuples \"put\" error");
                    throw new IndexedDb_1.IDBException("Put error");
                });
                response.oncomplete = function () {
                    resolve(response.result);
                };
            });
        });
    };
    TupleActionStorageIndexedDbService.prototype.deleteAction = function (scope, actionUuid) {
        var scopeUuid = scope + "|" + actionUuid;
        return this.transaction(true)
            .then(function (tx) {
            var store = tx.objectStore(ACTION_STORE);
            return new Promise(function (resolve, reject) {
                // Run the inserts
                var response = store.delete(scopeUuid);
                IndexedDb_1.addIndexedDbHandlers(response, function () {
                    reject(UtilMisc_1.dateStr() + " IndexedDB: saveTuples \"put\" error");
                    throw new IndexedDb_1.IDBException("Put error");
                });
                response.oncomplete = function () {
                    resolve();
                };
            });
        });
    };
    // ----------------------------------------------------------------------------
    // Open the indexed db database
    TupleActionStorageIndexedDbService.prototype.open = function () {
        var _this = this;
        if (this.isOpen())
            return Promise.resolve();
        if (this.openInProgressPromise != null)
            return this.openInProgressPromise;
        this.openInProgressPromise = new Promise(function (resolve, reject) {
            // DISP Store
            var request = IndexedDb_1.indexedDB.open(DB_NAME, 1);
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
                db.createObjectStore(ACTION_STORE, { keyPath: ACTION_KEY_PATH });
                console.log(UtilMisc_1.dateStr() + " IndexedDB : \"" + DB_NAME + "\" Upgrade Success");
            };
        });
        return this.openInProgressPromise;
    };
    // ----------------------------------------------------------------------------
    // Check if the DB is open
    TupleActionStorageIndexedDbService.prototype.isOpen = function () {
        return this.db != null;
    };
    TupleActionStorageIndexedDbService.prototype.close = function () {
        if (!this.isOpen()) {
            throw new Error("IndexedDB \"" + DB_NAME + "\" is not open");
        }
        this.db.close();
        this.db = null;
    };
    TupleActionStorageIndexedDbService.prototype.transaction = function (forWrite) {
        var _this = this;
        return this.open()
            .then(function () {
            // Get the Read Only case out the way, it's easy
            return _this.db.transaction(ACTION_STORE, forWrite ? "readwrite" : "readonly");
        });
    };
    TupleActionStorageIndexedDbService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [])
    ], TupleActionStorageIndexedDbService);
    return TupleActionStorageIndexedDbService;
}(TupleActionStorageServiceABC_1.TupleActionStorageServiceABC));
exports.TupleActionStorageIndexedDbService = TupleActionStorageIndexedDbService;
//# sourceMappingURL=/Users/jchesney/dev-peek-util/vortexjs/src/vortex/action-storage/TupleActionStorageIndexedDbService.js.map