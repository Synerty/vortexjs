"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
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
var WebSqlService_1 = require("../../websql/WebSqlService");
var Payload_1 = require("../Payload");
var TupleActionStorageServiceABC_1 = require("./TupleActionStorageServiceABC");
var datbaseName = "tupleActions.sqlite";
var tableName = "tupleActions";
var databaseSchema = [
    "CREATE TABLE IF NOT EXISTS " + tableName + "\n     (\n        id INTEGER PRIMARY KEY AUTOINCREMENT,\n        scope TEXT,\n        uuid REAL,\n        payload TEXT,\n        UNIQUE (scope, uuid)\n     )"
];
var TupleActionStorageWebSqlService = /** @class */ (function (_super) {
    __extends(TupleActionStorageWebSqlService, _super);
    function TupleActionStorageWebSqlService(webSqlFactory) {
        var _this = _super.call(this) || this;
        _this.webSqlFactory = webSqlFactory;
        _this.webSql = webSqlFactory.createWebSql(datbaseName, databaseSchema);
        return _this;
    }
    TupleActionStorageWebSqlService.prototype.storeAction = function (scope, tupleAction, payload) {
        var _this = this;
        return payload.toEncodedPayload()
            .then(function (encodedPayload) {
            var sql = "INSERT INTO " + tableName + "\n                    (scope, uuid, payload)\n                    VALUES (?, ?, ?)";
            var bindParams = [scope, tupleAction.uuid, encodedPayload];
            return _this.webSql.runSql(sql, bindParams)
                .then(function () { return null; });
        });
    };
    TupleActionStorageWebSqlService.prototype.loadNextAction = function () {
        var sql = "SELECT payload\n                    FROM " + tableName + "\n                    ORDER BY id\n                    LIMIT 1";
        var bindParams = [];
        return this.webSql.querySql(sql, bindParams)
            .then(function (rows) {
            if (rows.length === 0) {
                return null;
            }
            var row1 = rows[0];
            return Payload_1.Payload.fromEncodedPayload(row1.payload);
        });
    };
    TupleActionStorageWebSqlService.prototype.countActions = function () {
        var sql = "SELECT count(payload) as count\n                    FROM " + tableName;
        var bindParams = [];
        return this.webSql.querySql(sql, bindParams)
            .then(function (rows) { return rows[0].count; });
    };
    TupleActionStorageWebSqlService.prototype.deleteAction = function (scope, actionUuid) {
        var sql = "DELETE FROM " + tableName + "\n                    WHERE scope=? AND uuid=?";
        var bindParams = [scope, actionUuid];
        return this.webSql.runSql(sql, bindParams)
            .then(function () { return null; });
    };
    TupleActionStorageWebSqlService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [WebSqlService_1.WebSqlFactoryService])
    ], TupleActionStorageWebSqlService);
    return TupleActionStorageWebSqlService;
}(TupleActionStorageServiceABC_1.TupleActionStorageServiceABC));
exports.TupleActionStorageWebSqlService = TupleActionStorageWebSqlService;
//# sourceMappingURL=TupleActionStorageWebSqlService.js.map