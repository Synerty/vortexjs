"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require("@angular/core");
var WebSqlService_1 = require("./WebSqlService");
var WebSqlBrowserFactoryService = (function () {
    function WebSqlBrowserFactoryService() {
    }
    WebSqlBrowserFactoryService.prototype.createWebSql = function (dbName, dbSchema) {
        return new WebSqlBrowserAdaptorService(dbName, dbSchema);
    };
    return WebSqlBrowserFactoryService;
}());
WebSqlBrowserFactoryService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [])
], WebSqlBrowserFactoryService);
exports.WebSqlBrowserFactoryService = WebSqlBrowserFactoryService;
var WDBException = (function () {
    function WDBException(message) {
        this.message = message;
    }
    WDBException.prototype.toString = function () {
        return 'WDBException: ' + this.message;
    };
    return WDBException;
}());
exports.WDBException = WDBException;
var WebSqlBrowserAdaptorService = (function (_super) {
    __extends(WebSqlBrowserAdaptorService, _super);
    function WebSqlBrowserAdaptorService(dbName, dbSchema) {
        var _this = _super.call(this, dbName, dbSchema) || this;
        _this.dbName = dbName;
        _this.dbSchema = dbSchema;
        return _this;
    }
    WebSqlBrowserAdaptorService.prototype.open = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (_this.isOpen()) {
                resolve(true);
                return;
            }
            _this.db = openDatabase(_this.dbName, "1", _this.dbName, 4 * 1024 * 1024);
            if (_this.schemaInstalled) {
                resolve(true);
                return;
            }
            _this.installSchema()
                .catch(function (err) {
                reject(err);
                throw new Error(err);
            })
                .then(function () { return resolve(true); });
        });
    };
    WebSqlBrowserAdaptorService.prototype.isOpen = function () {
        return this.db != null;
    };
    WebSqlBrowserAdaptorService.prototype.close = function () {
        this.db = null;
    };
    WebSqlBrowserAdaptorService.prototype.transaction = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.db.transaction(function (t) {
                resolve(new WebSqlBrowserTransactionAdaptor(t));
            }, function (tx, err) {
                reject(err == null ? tx : err);
            });
        });
    };
    return WebSqlBrowserAdaptorService;
}(WebSqlService_1.WebSqlService));
WebSqlBrowserAdaptorService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [String, Array])
], WebSqlBrowserAdaptorService);
var WebSqlBrowserTransactionAdaptor = (function () {
    function WebSqlBrowserTransactionAdaptor(websqlTransaction) {
        this.websqlTransaction = websqlTransaction;
    }
    WebSqlBrowserTransactionAdaptor.prototype.executeSql = function (sql, bindParams) {
        var _this = this;
        if (bindParams === void 0) { bindParams = []; }
        return new Promise(function (resolve, reject) {
            _this.retryExecuteSql(5, sql, bindParams, resolve, reject);
        });
    };
    WebSqlBrowserTransactionAdaptor.prototype.retryExecuteSql = function (retries, sql, bindParams, resolve, reject) {
        var _this = this;
        this.websqlTransaction.executeSql(sql, bindParams, function (transaction, results) {
            /*
             * results:(SQLResultSet) {
             *      insertId:0,
             *      rows:(SQLResultSetRowList){
             *          length:0
             *      },
             *      rowsAffected:0
             *  }
             */
            // ALL GOOD, Return the rows
            var rowArray = [];
            for (var i = 0; i < results.rows.length; ++i) {
                rowArray.push(results.rows.item(i));
            }
            resolve(rowArray);
        }, function (tx, err) {
            err = err == null ? tx : err; // Sometimes tx is the err
            // Bug in Safari (at least), when the user approves the storage space
            // The WebSQL still gets the exception
            // "there was not enough remaining storage space, or the storage quota was reached and the user declined to allow more space"
            var noSpaceMsg = "there was not enough remaining storage space";
            if (retries >= 0 && err.message.indexOf(noSpaceMsg) !== -1) {
                _this.retryExecuteSql(retries - 1, sql, bindParams, resolve, reject);
                return;
            }
            // Otherwise, REJECT
            reject(err);
        });
    };
    return WebSqlBrowserTransactionAdaptor;
}());
//# sourceMappingURL=/home/peek/project/vortexjs/src/websql/WebSqlBrowserAdaptorService.js.map