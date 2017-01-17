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
var WebSqlService_1 = require("../websql/WebSqlService");
var Payload_1 = require("./Payload");
var core_1 = require("@angular/core");
var datbaseName = "offlineTuples.sqlite";
var databaseSchema = [
    "CREATE TABLE IF NOT EXISTS tuples\n     (\n        scope TEXT,\n        tupleSelector TEXT,\n        dateTime REAL,\n        payload TEXT,\n        PRIMARY KEY (scope, tupleSelector)\n     )"
];
var TupleOfflineStorageNameService = (function () {
    function TupleOfflineStorageNameService(name) {
        this.name = name;
    }
    return TupleOfflineStorageNameService;
}());
TupleOfflineStorageNameService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [String])
], TupleOfflineStorageNameService);
exports.TupleOfflineStorageNameService = TupleOfflineStorageNameService;
var TupleOfflineStorageService = (function () {
    function TupleOfflineStorageService(webSqlFactory, tupleOfflineStorageServiceName) {
        this.webSql = webSqlFactory.createWebSql(datbaseName, databaseSchema);
        this.storageName = tupleOfflineStorageServiceName.name;
    }
    TupleOfflineStorageService.prototype.loadTuples = function (tupleSelector) {
        var _this = this;
        var tupleSelectorStr = tupleSelector.toOrderedJsonStr();
        var sql = "SELECT scope, tupleSelector, dateTime, payload\n                    FROM tuples\n                    WHERE tupleSelector = ? AND scope = ?";
        var bindParams = [tupleSelectorStr, this.storageName];
        return new Promise(function (resolve, reject) {
            _this.webSql.querySql(sql, bindParams)
                .catch(function (err) {
                reject(err);
                throw new Error(err);
            })
                .then(function (rows) {
                if (rows.length === 0) {
                    resolve([]);
                    return;
                }
                var row1 = rows[0];
                var payload = Payload_1.Payload.fromVortexMsg(row1.payload);
                resolve(payload.tuples);
            });
        });
    };
    TupleOfflineStorageService.prototype.saveTuples = function (tupleSelector, tuples) {
        // The payload is a convenient way to serialise and compress the data
        var payloadData = new Payload_1.Payload({}, tuples).toVortexMsg();
        var tupleSelectorStr = tupleSelector.toOrderedJsonStr();
        var sql = "INSERT OR REPLACE INTO tuples\n                    (scope, tupleSelector, dateTime, payload)\n                    VALUES (?, ?, ?, ?)";
        var bindParams = [this.storageName, tupleSelectorStr, Date.now(), payloadData];
        return this.webSql.runSql(sql, bindParams);
    };
    return TupleOfflineStorageService;
}());
TupleOfflineStorageService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [WebSqlService_1.WebSqlFactoryService,
        TupleOfflineStorageNameService])
], TupleOfflineStorageService);
exports.TupleOfflineStorageService = TupleOfflineStorageService;
//# sourceMappingURL=/home/peek/project/vortexjs/src/vortex/TupleOfflineStorageService.js.map