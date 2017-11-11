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
var databaseSchema = [
    "CREATE TABLE IF NOT EXISTS tuples\n     (\n        tupleSelector TEXT,\n        dateTime REAL,\n        payload TEXT,\n        PRIMARY KEY (tupleSelector)\n     )"
];
var insertSql = "INSERT OR REPLACE INTO tuples\n                 (tupleSelector, dateTime, payload)\n                 VALUES (?, ?, ?)";
var selectSql = "SELECT tupleSelector, dateTime, payload\n                 FROM tuples\n                 WHERE tupleSelector = ?";
var TupleStorageWebSqlService = (function (_super) {
    __extends(TupleStorageWebSqlService, _super);
    function TupleStorageWebSqlService(webSqlFactory, name) {
        var _this = _super.call(this, name) || this;
        _this.openInProgressPromise = null;
        _this.webSql = webSqlFactory.createWebSql(_this.dbName, databaseSchema);
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
    TupleStorageWebSqlService.prototype.transaction = function (forWrite) {
        return this.webSql.transaction()
            .then(function (t) { return new TupleWebSqlTransaction(t, forWrite); });
    };
    return TupleStorageWebSqlService;
}(TupleStorageServiceABC_1.TupleStorageServiceABC));
TupleStorageWebSqlService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [WebSqlService_1.WebSqlFactoryService,
        TupleOfflineStorageNameService_1.TupleOfflineStorageNameService])
], TupleStorageWebSqlService);
exports.TupleStorageWebSqlService = TupleStorageWebSqlService;
var TupleWebSqlTransaction = (function () {
    function TupleWebSqlTransaction(tx, txForWrite) {
        this.tx = tx;
        this.txForWrite = txForWrite;
    }
    TupleWebSqlTransaction.prototype.loadTuples = function (tupleSelector) {
        var bindParams = [tupleSelector.toOrderedJsonStr()];
        return this.tx.executeSql(selectSql, bindParams)
            .then(function (rows) {
            if (rows.length === 0) {
                return [];
            }
            var row1 = rows[0];
            return Payload_1.Payload.fromVortexMsg(row1.payload)
                .then(function (payload) { return payload.tuples; });
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
    TupleWebSqlTransaction.prototype.saveTuplesEncoded = function (tupleSelector, vortexMsg) {
        if (!this.txForWrite) {
            var msg = "WebSQL: saveTuples attempted on read only TX";
            console.log(UtilMisc_1.dateStr() + " " + msg);
            return Promise.reject(msg);
        }
        // The payload is a convenient way to serialise and compress the data
        var tupleSelectorStr = tupleSelector.toOrderedJsonStr();
        var bindParams = [tupleSelectorStr, Date.now(), vortexMsg];
        return this.tx.executeSql(insertSql, bindParams)
            .then(function () { return null; }); // Convert the result
    };
    TupleWebSqlTransaction.prototype.close = function () {
        return Promise.resolve();
    };
    return TupleWebSqlTransaction;
}());
//# sourceMappingURL=/Users/jchesney/project/vortexjs/src/vortex/storage/TupleStorageWebSqlService.js.map