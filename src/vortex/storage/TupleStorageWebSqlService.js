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
var WebSqlService_1 = require("../../websql/WebSqlService");
var Payload_1 = require("../Payload");
var core_1 = require("@angular/core");
var TupleStorageServiceABC_1 = require("./TupleStorageServiceABC");
var TupleOfflineStorageNameService_1 = require("../TupleOfflineStorageNameService");
var UtilMisc_1 = require("../UtilMisc");
// ----------------------------------------------------------------------------
var createTable = "CREATE TABLE IF NOT EXISTS tuples\n     (\n        tupleSelector TEXT,\n        dateTime REAL,\n        payload TEXT,\n        PRIMARY KEY (tupleSelector)\n     )";
var dropTable = "DROP TABLE IF NOT EXISTS tuples";
var deleteBySelectorSql = "DELETE\n                 FROM tuples\n                 WHERE tupleSelector = ?";
var deleteByDateSql = "DELETE\n                 FROM tuples\n                 WHERE dateTime < ?";
var insertSql = "INSERT OR REPLACE INTO tuples\n                 (tupleSelector, dateTime, payload)\n                 VALUES (?, ?, ?)";
var selectSql = "SELECT tupleSelector, dateTime, payload\n                 FROM tuples\n                 WHERE tupleSelector = ?";
var TupleStorageWebSqlService = /** @class */ (function (_super) {
    __extends(TupleStorageWebSqlService, _super);
    function TupleStorageWebSqlService(webSqlFactory, name) {
        var _this = _super.call(this, name) || this;
        _this.openInProgressPromise = null;
        _this.webSql = webSqlFactory.createWebSql(_this.dbName, [createTable]);
        return _this;
    }
    TupleStorageWebSqlService.prototype.open = function () {
        var _this = this;
        if (this.openInProgressPromise != null)
            return this.openInProgressPromise;
        this.openInProgressPromise = this.webSql.open()
            .then(function () { return _this.openInProgressPromise = null; })
            .catch(function (e) {
            _this.openInProgressPromise = null;
            throw (e);
        });
        return this.openInProgressPromise;
    };
    TupleStorageWebSqlService.prototype.isOpen = function () {
        return this.webSql.isOpen();
    };
    TupleStorageWebSqlService.prototype.close = function () {
        this.webSql.close();
    };
    TupleStorageWebSqlService.prototype.truncateStorage = function () {
        var prom = this.webSql.transaction()
            .then(function (tx) {
            var prom2 = tx.executeSql(dropTable)
                .then(function () { return tx.executeSql(createTable); })
                .then(function () {
                // CLOSE : TODO
                // tx.close()
                //     .catch(e => console.log(`ERROR truncateStorage: ${e}`));
            });
            return prom2;
        });
        return prom;
    };
    TupleStorageWebSqlService.prototype.transaction = function (forWrite) {
        return this.webSql.transaction()
            .then(function (t) { return new TupleWebSqlTransaction(t, forWrite); });
    };
    TupleStorageWebSqlService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [WebSqlService_1.WebSqlFactoryService,
            TupleOfflineStorageNameService_1.TupleOfflineStorageNameService])
    ], TupleStorageWebSqlService);
    return TupleStorageWebSqlService;
}(TupleStorageServiceABC_1.TupleStorageServiceABC));
exports.TupleStorageWebSqlService = TupleStorageWebSqlService;
var TupleWebSqlTransaction = /** @class */ (function () {
    function TupleWebSqlTransaction(tx, txForWrite) {
        this.tx = tx;
        this.txForWrite = txForWrite;
    }
    TupleWebSqlTransaction.prototype.isLockedMsg = function (msg) {
        var hasNsSqlError = msg.indexOf('SQLITE.ALL - Database Error5') !== -1;
        // unable to begin transaction (5 database is locked)
        var hasWebSqlError = msg.indexOf('5 database is locked') !== -1;
        if (hasNsSqlError || hasWebSqlError)
            return true;
        console.log("WebSQL: Found error message that isn't a lock : " + msg);
        return false;
    };
    TupleWebSqlTransaction.prototype.loadTuples = function (tupleSelector) {
        return this.loadTuplesEncoded(tupleSelector)
            .then(function (vortexMsg) {
            if (vortexMsg == null) {
                return [];
            }
            return Payload_1.Payload.fromVortexMsg(vortexMsg)
                .then(function (payload) { return payload.tuples; });
        });
    };
    TupleWebSqlTransaction.prototype.loadTuplesEncoded = function (tupleSelector) {
        var bindParams = [tupleSelector.toOrderedJsonStr()];
        return this.tx.executeSql(selectSql, bindParams)
            .then(function (rows) {
            if (rows.length === 0) {
                return null;
            }
            var row1 = rows[0];
            return row1.payload;
        });
    };
    TupleWebSqlTransaction.prototype.saveTuples = function (tupleSelector, tuples) {
        var _this = this;
        // The payload is a convenient way to serialise and compress the data
        return new Payload_1.Payload({}, tuples).toVortexMsg()
            .then(function (vortexMsg) {
            return _this.saveTuplesEncoded(tupleSelector, vortexMsg);
        });
    };
    TupleWebSqlTransaction.prototype.saveTuplesEncoded = function (tupleSelector, vortexMsg, retries) {
        var _this = this;
        if (retries === void 0) { retries = 0; }
        if (!this.txForWrite) {
            var msg = "WebSQL: saveTuples attempted on read only TX";
            console.log(UtilMisc_1.dateStr() + " " + msg);
            return Promise.reject(msg);
        }
        // The payload is a convenient way to serialise and compress the data
        var tupleSelectorStr = tupleSelector.toOrderedJsonStr();
        var bindParams = [tupleSelectorStr, Date.now(), vortexMsg];
        return this.tx.executeSql(insertSql, bindParams)
            .catch(function (err) {
            if (_this.isLockedMsg(err)) {
                if (retries == 5) {
                    throw new Error(err + "\nRetried " + retries + " times");
                }
                return _this.saveTuplesEncoded(tupleSelector, vortexMsg, retries + 1);
            }
            throw new Error(err);
        })
            .then(function () { return null; }); // Convert the result
    };
    TupleWebSqlTransaction.prototype.deleteTuples = function (tupleSelector, retries) {
        var _this = this;
        if (retries === void 0) { retries = 0; }
        if (!this.txForWrite) {
            var msg = "WebSQL: deleteTuples attempted on read only TX";
            console.log(UtilMisc_1.dateStr() + " " + msg);
            return Promise.reject(msg);
        }
        var tupleSelectorStr = tupleSelector.toOrderedJsonStr();
        return this.tx.executeSql(deleteBySelectorSql, [tupleSelectorStr])
            .catch(function (err) {
            if (_this.isLockedMsg(err)) {
                if (retries == 5) {
                    throw new Error(err + "\nRetried " + retries + " times");
                }
                return _this.deleteTuples(tupleSelector, retries + 1);
            }
            throw new Error(err);
        })
            .then(function () { return null; }); // Convert the result
    };
    TupleWebSqlTransaction.prototype.deleteOldTuples = function (deleteDataBeforeDate, retries) {
        var _this = this;
        if (retries === void 0) { retries = 0; }
        if (!this.txForWrite) {
            var msg = "WebSQL: deleteOldTuples attempted on read only TX";
            console.log(UtilMisc_1.dateStr() + " " + msg);
            return Promise.reject(msg);
        }
        return this.tx.executeSql(deleteByDateSql, [deleteDataBeforeDate.getTime()])
            .catch(function (err) {
            if (_this.isLockedMsg(err)) {
                if (retries == 5) {
                    throw new Error(err + "\nRetried " + retries + " times");
                }
                return _this.deleteOldTuples(deleteDataBeforeDate, retries + 1);
            }
            throw new Error(err);
        })
            .then(function () { return null; }); // Convert the result
    };
    TupleWebSqlTransaction.prototype.close = function () {
        return Promise.resolve();
    };
    return TupleWebSqlTransaction;
}());
//# sourceMappingURL=/Users/jchesney/project/vortexjs/src/vortex/storage/TupleStorageWebSqlService.js.map