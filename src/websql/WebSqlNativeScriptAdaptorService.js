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
var WebSqlService_1 = require("./WebSqlService");
var NsSqlite = require("nativescript-sqlite");
var WebSqlNativeScriptFactoryService = (function () {
    function WebSqlNativeScriptFactoryService() {
    }
    WebSqlNativeScriptFactoryService.prototype.hasStorageLimitations = function () {
        return false; // NOPE :-)
    };
    WebSqlNativeScriptFactoryService.prototype.supportsWebSql = function () {
        return true; // Yes :-)
    };
    WebSqlNativeScriptFactoryService.prototype.createWebSql = function (dbName, dbSchema) {
        return new WebSqlNativeScriptAdaptorService(dbName, dbSchema);
    };
    return WebSqlNativeScriptFactoryService;
}());
WebSqlNativeScriptFactoryService = __decorate([
    core_1.Injectable()
], WebSqlNativeScriptFactoryService);
exports.WebSqlNativeScriptFactoryService = WebSqlNativeScriptFactoryService;
var WebSqlNativeScriptAdaptorService = (function (_super) {
    __extends(WebSqlNativeScriptAdaptorService, _super);
    function WebSqlNativeScriptAdaptorService(dbName, dbSchema) {
        var _this = _super.call(this, dbName, dbSchema) || this;
        _this.dbName = dbName;
        _this.dbSchema = dbSchema;
        return _this;
    }
    WebSqlNativeScriptAdaptorService.prototype.open = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (_this.isOpen()) {
                resolve();
                return;
            }
            var dbPromise = new NsSqlite(_this.dbName);
            dbPromise.then(function (db) {
                _this.db = db;
                if (!NsSqlite.isSqlite(db)) {
                    reject("The thing we opened isn't a DB");
                    return;
                }
                _this.db.resultType(NsSqlite.RESULTSASOBJECT);
                _this.db.version("1"); // MATCHES Browser Adaptor
                if (_this.schemaInstalled) {
                    resolve();
                    return;
                }
                _this.installSchema()
                    .catch(function (err) {
                    reject(err);
                    throw new Error(err);
                })
                    .then(function () { return resolve(); });
            });
            dbPromise.catch(function (err) {
                reject(err);
                throw new Error(err);
            });
        });
    };
    WebSqlNativeScriptAdaptorService.prototype.isOpen = function () {
        return this.db !== null && NsSqlite.isSqlite(this.db) && this.db.isOpen();
    };
    WebSqlNativeScriptAdaptorService.prototype.close = function () {
        this.db.close();
        this.db = null;
    };
    WebSqlNativeScriptAdaptorService.prototype.transaction = function () {
        var _this = this;
        // NOT THE COMMERCIAL VERSION, NO TRANSACTION SUPPORT IS AVAILABLE
        if (!this.isOpen())
            throw new Error("SQLDatabase " + this.dbName + " is not open");
        return new Promise(function (resolve, reject) {
            resolve(new WebSqlNativeScriptTransactionAdaptor(_this.db));
        });
    };
    return WebSqlNativeScriptAdaptorService;
}(WebSqlService_1.WebSqlService));
WebSqlNativeScriptAdaptorService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [String, Array])
], WebSqlNativeScriptAdaptorService);
var WebSqlNativeScriptTransactionAdaptor = (function () {
    function WebSqlNativeScriptTransactionAdaptor(db) {
        this.db = db;
    }
    WebSqlNativeScriptTransactionAdaptor.prototype.executeSql = function (sql, bindParams) {
        if (bindParams === void 0) { bindParams = []; }
        return this.db.all(sql, bindParams);
    };
    return WebSqlNativeScriptTransactionAdaptor;
}());
//# sourceMappingURL=/home/peek/project/vortexjs/src/websql/WebSqlNativeScriptAdaptorService.js.map