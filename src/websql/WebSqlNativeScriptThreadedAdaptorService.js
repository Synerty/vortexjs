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
var WebSqlNativeScriptThreadedFactoryService = (function () {
    function WebSqlNativeScriptThreadedFactoryService() {
    }
    WebSqlNativeScriptThreadedFactoryService.prototype.hasStorageLimitations = function () {
        return false; // NOPE :-)
    };
    WebSqlNativeScriptThreadedFactoryService.prototype.supportsWebSql = function () {
        return true; // Yes :-)
    };
    WebSqlNativeScriptThreadedFactoryService.prototype.createWebSql = function (dbName, dbSchema) {
        return new WebSqlNativeScriptThreadedAdaptorService(dbName, dbSchema);
    };
    return WebSqlNativeScriptThreadedFactoryService;
}());
WebSqlNativeScriptThreadedFactoryService = __decorate([
    core_1.Injectable()
], WebSqlNativeScriptThreadedFactoryService);
exports.WebSqlNativeScriptThreadedFactoryService = WebSqlNativeScriptThreadedFactoryService;
var WebSqlNativeScriptThreadedAdaptorService = WebSqlNativeScriptThreadedAdaptorService_1 = (function (_super) {
    __extends(WebSqlNativeScriptThreadedAdaptorService, _super);
    function WebSqlNativeScriptThreadedAdaptorService(dbName, dbSchema) {
        var _this = _super.call(this, dbName, dbSchema) || this;
        _this.dbName = dbName;
        _this.dbSchema = dbSchema;
        _this._isOpen = false;
        if (global.TNS_WEBPACK) {
            var Worker_1 = require("nativescript-worker-loader!./WebSqlNativeScriptThreadedAdaptorWorker.js");
            _this.worker = new Worker_1();
        }
        else {
            _this.worker = new Worker("./WebSqlNativeScriptThreadedAdaptorWorker.js");
        }
        return _this;
    }
    WebSqlNativeScriptThreadedAdaptorService.prototype.open = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (_this.isOpen()) {
                resolve();
                return;
            }
            function callError(error) {
                reject(error);
                console.log("ERROR: WebSqlNativeScriptThreadedAdaptorService.open " + error);
            }
            _this.worker.onmessage = function (postResult) {
                var resultAny = postResult.data;
                //console.log(`WebSQL Service, DB Receiving : ${JSON.stringify(resultAny)}`);
                var error = resultAny["error"];
                if (error == null) {
                    _this._isOpen = true;
                    _this.worker.onerror = WebSqlNativeScriptThreadedAdaptorService_1.onError;
                    _this.worker.onmessage = WebSqlNativeScriptThreadedAdaptorService_1.onMessage;
                    resolve();
                }
                else {
                    callError(error);
                }
            };
            _this.worker.onerror = function (error) {
                console.log("WebSQL Service, DB Erroring : " + error);
                callError(error);
            };
            var postArg = {
                call: 1,
                dbName: _this.dbName,
                dbSchema: _this.dbSchema[0],
                version: 1
            };
            //console.log(`WebSQL Service, Sending : ${JSON.stringify(postArg)}`);
            _this.worker.postMessage(postArg);
        });
    };
    WebSqlNativeScriptThreadedAdaptorService.prototype.isOpen = function () {
        return this.worker != null && this._isOpen;
        ;
    };
    WebSqlNativeScriptThreadedAdaptorService.prototype.close = function () {
        this.worker.terminate();
        this.worker = null;
    };
    WebSqlNativeScriptThreadedAdaptorService.prototype.transaction = function () {
        var _this = this;
        // NOT THE COMMERCIAL VERSION, NO TRANSACTION SUPPORT IS AVAILABLE
        if (!this.isOpen())
            throw new Error("SQLDatabase " + this.dbName + " is not open");
        return new Promise(function (resolve, reject) {
            resolve(new WebSqlNativeScriptThreadedTransactionAdaptor(_this.worker));
        });
    };
    WebSqlNativeScriptThreadedAdaptorService.popPromise = function (callNumber) {
        var promise = WebSqlNativeScriptThreadedAdaptorService_1._promises[callNumber];
        delete WebSqlNativeScriptThreadedAdaptorService_1._promises[callNumber];
        return promise;
    };
    WebSqlNativeScriptThreadedAdaptorService.pushPromise = function (callNumber, resolve, reject) {
        WebSqlNativeScriptThreadedAdaptorService_1._promises[callNumber] = {
            resolve: resolve,
            reject: reject
        };
    };
    WebSqlNativeScriptThreadedAdaptorService.onMessage = function (postResult) {
        var resultAny = postResult.data;
        // console.log(`WebSQL Service, Tx Receiving : ${JSON.stringify(resultAny)}`);
        var error = resultAny["error"];
        var callNumber = resultAny["callNumber"];
        var result = resultAny["result"];
        var promise = WebSqlNativeScriptThreadedAdaptorService_1.popPromise(callNumber);
        var resolve = promise["resolve"];
        var reject = promise["reject"];
        if (error == null) {
            resolve(result);
        }
        else {
            reject(error);
        }
    };
    WebSqlNativeScriptThreadedAdaptorService.onError = function (error) {
        console.log("WebSqlNativeScriptThreadedAdaptorService.onerror " + error);
    };
    return WebSqlNativeScriptThreadedAdaptorService;
}(WebSqlService_1.WebSqlService));
// ------------------------------------------------------------------------
WebSqlNativeScriptThreadedAdaptorService._promises = {};
WebSqlNativeScriptThreadedAdaptorService._promisesNum = 1;
WebSqlNativeScriptThreadedAdaptorService = WebSqlNativeScriptThreadedAdaptorService_1 = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [String, Array])
], WebSqlNativeScriptThreadedAdaptorService);
var WebSqlNativeScriptThreadedTransactionAdaptor = (function () {
    function WebSqlNativeScriptThreadedTransactionAdaptor(worker) {
        this.worker = worker;
    }
    WebSqlNativeScriptThreadedTransactionAdaptor.prototype.executeSql = function (sql, bindParams) {
        var _this = this;
        if (bindParams === void 0) { bindParams = []; }
        var callNumber = WebSqlNativeScriptThreadedAdaptorService._promisesNum++;
        return new Promise(function (resolve, reject) {
            var postArg = {
                call: 3,
                callNumber: callNumber,
                sql: sql,
                bindParams: bindParams
            };
            //console.log(`WebSQL Transaction, Sending : ${JSON.stringify(postArg)}`);
            _this.worker.postMessage(postArg);
            WebSqlNativeScriptThreadedAdaptorService.pushPromise(callNumber, resolve, reject);
        });
    };
    return WebSqlNativeScriptThreadedTransactionAdaptor;
}());
var WebSqlNativeScriptThreadedAdaptorService_1;
//# sourceMappingURL=/Users/jchesney/project/vortexjs/src/websql/WebSqlNativeScriptThreadedAdaptorService.js.map