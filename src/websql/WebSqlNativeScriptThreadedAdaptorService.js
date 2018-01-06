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
        _this._callQueue = [];
        _this._callInProgress = false;
        _this._promises = {};
        _this._promisesNum = 1;
        if (global.TNS_WEBPACK) {
            var Worker_1 = require("nativescript-worker-loader!./WebSqlNativeScriptThreadedAdaptorWorker.js");
            _this.worker = new Worker_1();
        }
        else {
            _this.worker = new Worker("./WebSqlNativeScriptThreadedAdaptorWorker.js");
        }
        _this.worker.onerror = function (data) { return _this.onError(data); };
        _this.worker.onmessage = function (err) { return _this.onMessage(err); };
        if (WebSqlNativeScriptThreadedAdaptorService_1.openDatabaseNames.indexOf(dbName) != -1) {
            var msg = "A database with name " + dbName + " exists";
            console.log("ERROR: " + msg);
            throw new Error(msg);
        }
        WebSqlNativeScriptThreadedAdaptorService_1.openDatabaseNames.push(dbName);
        return _this;
    }
    WebSqlNativeScriptThreadedAdaptorService.prototype.open = function () {
        var _this = this;
        if (this.worker == null) {
            throw new Error("A database service can not be opened twice");
        }
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
                    _this.worker.onerror = function (data) { return _this.onError(data); };
                    _this.worker.onmessage = function (err) { return _this.onMessage(err); };
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
    };
    WebSqlNativeScriptThreadedAdaptorService.prototype.close = function () {
        WebSqlNativeScriptThreadedAdaptorService_1.openDatabaseNames.remove(this.dbName);
        this.worker.terminate();
        this.worker = null;
    };
    WebSqlNativeScriptThreadedAdaptorService.prototype.transaction = function () {
        var _this = this;
        // NOT THE COMMERCIAL VERSION, NO TRANSACTION SUPPORT IS AVAILABLE
        if (!this.isOpen())
            throw new Error("SQLDatabase " + this.dbName + " is not open");
        return new Promise(function (resolve, reject) {
            resolve(new WebSqlNativeScriptThreadedTransactionAdaptor(_this));
        });
    };
    // ------------------------------------------------------------------------
    WebSqlNativeScriptThreadedAdaptorService.prototype.queueCall = function (call) {
        //console.log(`WebSQL Transaction, Sending : ${JSON.stringify(postArg)}`);
        this._callQueue.push(call);
        this.callNext();
    };
    WebSqlNativeScriptThreadedAdaptorService.prototype.callNext = function () {
        if (this._callInProgress)
            return;
        if (this._callQueue.length == 0)
            return;
        var nextCall = this._callQueue.unshift();
        this.worker.postMessage(nextCall);
        this._callInProgress = true;
    };
    // ------------------------------------------------------------------------
    WebSqlNativeScriptThreadedAdaptorService.prototype.popPromise = function (callNumber) {
        var promise = this._promises[callNumber];
        delete this._promises[callNumber];
        return promise;
    };
    WebSqlNativeScriptThreadedAdaptorService.prototype.pushPromise = function (callNumber, resolve, reject) {
        this._promises[callNumber] = {
            resolve: resolve,
            reject: reject
        };
    };
    WebSqlNativeScriptThreadedAdaptorService.prototype.onMessage = function (postResult) {
        var resultAny = postResult.data;
        // console.log(`WebSQL Service, Tx Receiving : ${JSON.stringify(resultAny)}`);
        var error = resultAny["error"];
        var callNumber = resultAny["callNumber"];
        var result = resultAny["result"];
        var promise = this.popPromise(callNumber);
        var resolve = promise["resolve"];
        var reject = promise["reject"];
        if (error == null) {
            resolve(result);
        }
        else {
            reject(error);
        }
        this.callNext();
    };
    WebSqlNativeScriptThreadedAdaptorService.prototype.onError = function (error) {
        console.log("ERROR : this.onerror " + error);
        this.callNext();
    };
    return WebSqlNativeScriptThreadedAdaptorService;
}(WebSqlService_1.WebSqlService));
WebSqlNativeScriptThreadedAdaptorService.openDatabaseNames = [];
WebSqlNativeScriptThreadedAdaptorService = WebSqlNativeScriptThreadedAdaptorService_1 = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [String, Array])
], WebSqlNativeScriptThreadedAdaptorService);
var WebSqlNativeScriptThreadedTransactionAdaptor = (function () {
    function WebSqlNativeScriptThreadedTransactionAdaptor(service) {
        this.service = service;
    }
    WebSqlNativeScriptThreadedTransactionAdaptor.prototype.executeSql = function (sql, bindParams) {
        var _this = this;
        if (bindParams === void 0) { bindParams = []; }
        var callNumber = this.service._promisesNum++;
        return new Promise(function (resolve, reject) {
            var postArg = {
                call: 3,
                callNumber: callNumber,
                sql: sql,
                bindParams: bindParams
            };
            _this.service.pushPromise(callNumber, resolve, reject);
            _this.service.queueCall(postArg);
        });
    };
    return WebSqlNativeScriptThreadedTransactionAdaptor;
}());
var WebSqlNativeScriptThreadedAdaptorService_1;
//# sourceMappingURL=/Users/jchesney/project/vortexjs/src/websql/WebSqlNativeScriptThreadedAdaptorService.js.map