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
var WebSqlFactoryService = /** @class */ (function () {
    function WebSqlFactoryService() {
    }
    WebSqlFactoryService = __decorate([
        core_1.Injectable()
    ], WebSqlFactoryService);
    return WebSqlFactoryService;
}());
exports.WebSqlFactoryService = WebSqlFactoryService;
var WebSqlService = /** @class */ (function () {
    function WebSqlService(dbName, dbSchema) {
        this.dbName = dbName;
        this.dbSchema = dbSchema;
        this.schemaInstalled = false;
    }
    WebSqlService.prototype.installSchema = function () {
        var _this = this;
        // Open Transaction promise
        return this.transaction()
            .then(function (tx) {
            // Run SQL Promise
            // TODO, Handle more than one SQL statement
            return tx.executeSql(_this.dbSchema[0])
                .then(function (data) {
                _this.schemaInstalled = true;
            });
        });
    };
    WebSqlService.prototype.runSql = function (sql, bindParams) {
        var _this = this;
        if (bindParams === void 0) { bindParams = []; }
        return new Promise(function (resolve, reject) {
            _this.openTransRunSql(sql, bindParams)
                .catch(function (err) {
                reject(err);
                throw new Error(err);
            })
                .then(function (result) {
                // if (typeof result === 'number')
                //     resolve(result);
                // else
                resolve(true);
            });
        });
    };
    WebSqlService.prototype.querySql = function (sql, bindParams) {
        var _this = this;
        if (bindParams === void 0) { bindParams = []; }
        return new Promise(function (resolve, reject) {
            _this.openTransRunSql(sql, bindParams)
                .catch(function (err) {
                reject(err);
                throw new Error(err);
            })
                .then(function (rows) { return resolve(rows); });
        });
    };
    WebSqlService.prototype.openTransRunSql = function (sql, bindParams) {
        var _this = this;
        return this.open()
            .then(function () {
            // Open Transaction promise
            return _this.transaction()
                .then(function (tx) {
                // Run SQL Promise
                return tx.executeSql(sql, bindParams)
                    .then(function (data) { return data; });
            });
        });
    };
    WebSqlService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [String, Array])
    ], WebSqlService);
    return WebSqlService;
}());
exports.WebSqlService = WebSqlService;
//# sourceMappingURL=/Users/jchesney/dev-peek-util/vortexjs/src/websql/WebSqlService.js.map