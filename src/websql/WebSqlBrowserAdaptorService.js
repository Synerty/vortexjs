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
var WebSqlService_1 = require("./WebSqlService");
var RETRY_NO_SPACE = 'there was not enough remaining storage space';
var RETRY_DISK_ERROR = 'unable to begin transaction (3850 disk I/O error)';
function random() {
    var min = 0;
    var max = 150;
    return Math.floor(Math.random() * (max - min + 1) + min);
}
var WebSqlBrowserFactoryService = /** @class */ (function () {
    function WebSqlBrowserFactoryService() {
    }
    WebSqlBrowserFactoryService.prototype.hasStorageLimitations = function () {
        // iOS safari supports up to a 50mb limit, MAX.
        // In this case, IndexedDB should be used.
        // https://stackoverflow.com/questions/9038625/detect-if-device-is-ios
        var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window['MSStream'];
        // Other conditions
        return iOS;
    };
    WebSqlBrowserFactoryService.prototype.supportsWebSql = function () {
        try {
            return openDatabase != null;
        }
        catch (e) {
            return false;
        }
    };
    WebSqlBrowserFactoryService.prototype.createWebSql = function (dbName, dbSchema) {
        return new WebSqlBrowserAdaptorService(dbName, dbSchema);
    };
    WebSqlBrowserFactoryService = __decorate([
        core_1.Injectable()
    ], WebSqlBrowserFactoryService);
    return WebSqlBrowserFactoryService;
}());
exports.WebSqlBrowserFactoryService = WebSqlBrowserFactoryService;
var WDBException = /** @class */ (function () {
    function WDBException(message) {
        this.message = message;
    }
    WDBException.prototype.toString = function () {
        return 'WDBException: ' + this.message;
    };
    return WDBException;
}());
exports.WDBException = WDBException;
var WebSqlBrowserAdaptorService = /** @class */ (function (_super) {
    __extends(WebSqlBrowserAdaptorService, _super);
    function WebSqlBrowserAdaptorService(dbName, dbSchema) {
        var _this = _super.call(this, dbName, dbSchema) || this;
        _this.dbName = dbName;
        _this.dbSchema = dbSchema;
        return _this;
    }
    WebSqlBrowserAdaptorService.prototype.open = function () {
        var _this = this;
        var retries = 5;
        var callback = function (resolve, reject) {
            if (_this.isOpen()) {
                resolve();
                return;
            }
            try {
                _this.db = openDatabase(_this.dbName, '1', _this.dbName, 4 * 1024 * 1024);
            }
            catch (err) {
                if (retries >= 0 && WebSqlBrowserTransactionAdaptor.checkRetryMessage(err.message)) {
                    retries--;
                    setTimeout(function () { return callback(resolve, reject); }, 100 + random());
                    return;
                }
                // Otherwise, REJECT
                reject(err);
                return;
            }
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
        };
        return new Promise(callback);
    };
    WebSqlBrowserAdaptorService.prototype.isOpen = function () {
        return this.db != null;
    };
    WebSqlBrowserAdaptorService.prototype.close = function () {
        this.db = null;
    };
    WebSqlBrowserAdaptorService.prototype.transaction = function () {
        var _this = this;
        if (!this.isOpen())
            throw new Error("SQLDatabase " + this.dbName + " is not open");
        var retries = 5;
        var callback = function (resolve, reject) {
            _this.db.transaction(function (t) {
                resolve(new WebSqlBrowserTransactionAdaptor(t));
            }, function (tx, err) {
                err = err == null ? tx : err; // Sometimes tx is the err
                // Solve the issue for :
                // unable to begin transaction (3850 disk I/O error)
                if (retries >= 0 && WebSqlBrowserTransactionAdaptor.checkRetryMessage(err.message)) {
                    retries--;
                    setTimeout(function () { return callback(resolve, reject); }, 100 + random());
                    return;
                }
                // Otherwise, REJECT
                reject(err);
            });
        };
        return new Promise(callback);
    };
    WebSqlBrowserAdaptorService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [String, Array])
    ], WebSqlBrowserAdaptorService);
    return WebSqlBrowserAdaptorService;
}(WebSqlService_1.WebSqlService));
var WebSqlBrowserTransactionAdaptor = /** @class */ (function () {
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
            if (retries >= 0 && WebSqlBrowserTransactionAdaptor.checkRetryMessage(err.message)) {
                setTimeout(function () {
                    _this.retryExecuteSql(retries - 1, sql, bindParams, resolve, reject);
                }, 100 + random());
                return;
            }
            // Otherwise, REJECT
            reject(err);
        });
    };
    WebSqlBrowserTransactionAdaptor.checkRetryMessage = function (message) {
        if (message.indexOf(RETRY_NO_SPACE) !== -1)
            return true;
        return message.indexOf(RETRY_DISK_ERROR) !== -1;
    };
    return WebSqlBrowserTransactionAdaptor;
}());
//# sourceMappingURL=WebSqlBrowserAdaptorService.js.map