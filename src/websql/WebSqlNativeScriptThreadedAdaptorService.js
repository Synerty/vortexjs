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
var CALL_DB_OPEN = 1;
var CALL_DB_CLOSE = 2;
var CALL_DB_EXECUTE = 3;
var WebSqlNativeScriptThreadedFactoryService = /** @class */ (function () {
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
    WebSqlNativeScriptThreadedFactoryService = __decorate([
        core_1.Injectable()
    ], WebSqlNativeScriptThreadedFactoryService);
    return WebSqlNativeScriptThreadedFactoryService;
}());
exports.WebSqlNativeScriptThreadedFactoryService = WebSqlNativeScriptThreadedFactoryService;
var WebSqlNativeScriptThreadedAdaptorService = /** @class */ (function (_super) {
    __extends(WebSqlNativeScriptThreadedAdaptorService, _super);
    function WebSqlNativeScriptThreadedAdaptorService(dbName, dbSchema) {
        var _this = _super.call(this, dbName, dbSchema) || this;
        _this.dbName = dbName;
        _this.dbSchema = dbSchema;
        _this.workerController = new _WorkerController();
        _this._isOpen = false;
        return _this;
    }
    WebSqlNativeScriptThreadedAdaptorService.prototype.open = function () {
        var _this = this;
        if (this.isOpen())
            return Promise.resolve();
        return this.workerController
            .openDb(this.dbName, this.dbSchema, "1")
            .then(function () {
            _this._isOpen = true;
        });
    };
    WebSqlNativeScriptThreadedAdaptorService.prototype.isOpen = function () {
        return this.workerController != null && this._isOpen;
    };
    WebSqlNativeScriptThreadedAdaptorService.prototype.close = function () {
        this.workerController.close();
        this.workerController = null;
    };
    WebSqlNativeScriptThreadedAdaptorService.prototype.transaction = function () {
        var _this = this;
        // NOT THE COMMERCIAL VERSION, NO TRANSACTION SUPPORT IS AVAILABLE
        if (!this.isOpen())
            throw new Error("SQLDatabase " + this.dbName + " is not open");
        return new Promise(function (resolve, reject) {
            resolve(new WebSqlNativeScriptThreadedTransactionAdaptor(_this.workerController));
        });
    };
    WebSqlNativeScriptThreadedAdaptorService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [String, Array])
    ], WebSqlNativeScriptThreadedAdaptorService);
    return WebSqlNativeScriptThreadedAdaptorService;
}(WebSqlService_1.WebSqlService));
var WebSqlNativeScriptThreadedTransactionAdaptor = /** @class */ (function () {
    function WebSqlNativeScriptThreadedTransactionAdaptor(workerController) {
        this.workerController = workerController;
    }
    WebSqlNativeScriptThreadedTransactionAdaptor.prototype.executeSql = function (sql, bindParams) {
        if (bindParams === void 0) { bindParams = []; }
        return this.workerController.execSql(sql, bindParams);
    };
    return WebSqlNativeScriptThreadedTransactionAdaptor;
}());
var _WorkerController = /** @class */ (function () {
    function _WorkerController() {
        if (global.TNS_WEBPACK) {
            var Worker_1 = require("nativescript-worker-loader!./WebSqlNativeScriptThreadedAdaptorWorker.js");
            this.worker = new Worker_1();
        }
        else {
            this.worker = new Worker("./WebSqlNativeScriptThreadedAdaptorWorker.js");
        }
        this.worker.onmessage = _WorkerController.onMessage;
        this.worker.onerror = _WorkerController.onError;
    }
    // ------------------------------------------------------------------------
    _WorkerController.prototype.openDb = function (dbName, dbSchema, dbVersion) {
        if (this.worker == null)
            return Promise.reject("Worker has been closed");
        var _a = this.pushPromise(), callNumber = _a.callNumber, promise = _a.promise;
        var postArg = {
            call: CALL_DB_OPEN,
            callNumber: callNumber,
            dbName: dbName,
            dbSchema: dbSchema,
            dbVersion: dbVersion
        };
        // console.log(`WebSQL Opening, Sending : ${JSON.stringify(postArg)}`);
        this.worker.postMessage(postArg);
        return promise;
    };
    _WorkerController.prototype.close = function () {
        var _this = this;
        var _a = this.pushPromise(), callNumber = _a.callNumber, promise = _a.promise;
        var postArg = {
            call: CALL_DB_CLOSE,
            callNumber: callNumber
        };
        console.log("WebSQL Closing, Sending : " + JSON.stringify(postArg));
        this.worker.postMessage(postArg);
        promise
            .catch(function (err) { return console.log("WebSQL Failed to close: " + err); })
            .then(function () {
            _this.worker.terminate();
            _this.worker = null;
        });
    };
    _WorkerController.prototype.execSql = function (sql, bindParams) {
        if (this.worker == null)
            return Promise.reject("Worker has been closed");
        var _a = this.pushPromise(), callNumber = _a.callNumber, promise = _a.promise;
        var postArg = {
            call: CALL_DB_EXECUTE,
            callNumber: callNumber,
            sql: sql,
            bindParams: bindParams
        };
        // console.log(`WebSQL Executing, Sending : ${JSON.stringify(postArg)}`);
        this.worker.postMessage(postArg);
        return promise;
    };
    _WorkerController.prototype.pushPromise = function () {
        var callNumber = _WorkerController._promisesNum++;
        if (_WorkerController._promisesNum > 10000)
            _WorkerController._promisesNum = 1;
        var promise = new Promise(function (resolve, reject) {
            _WorkerController._promises[callNumber] = {
                resolve: resolve,
                reject: reject
            };
        });
        return { callNumber: callNumber, promise: promise };
    };
    _WorkerController.popPromise = function (callNumber) {
        var promise = _WorkerController._promises[callNumber];
        delete _WorkerController._promises[callNumber];
        return promise;
    };
    _WorkerController.onMessage = function (postResult, retry) {
        if (retry === void 0) { retry = 0; }
        var resultAny = postResult.data;
        // console.log(`WebSQL Worker,  Receiving : ${JSON.stringify(resultAny)}`);
        var error = resultAny["error"];
        var callNumber = resultAny["callNumber"];
        var result = resultAny["result"];
        if (callNumber == null) {
            console.log("ERROR: _WorkerController.onerror " + error);
            return;
        }
        var promise = _WorkerController.popPromise(callNumber);
        if (promise == null) {
            console.log("ERROR: _WorkerController, Double worker callback " + error);
            return;
        }
        var resolve = promise["resolve"];
        var reject = promise["reject"];
        if (error == null) {
            setTimeout(function () { return resolve(result); }, 0);
        }
        else {
            reject(error);
        }
    };
    _WorkerController.onError = function (error) {
        console.log("ERROR: _WorkerController.onerror " + error);
    };
    _WorkerController._promises = {};
    _WorkerController._promisesNum = 1;
    return _WorkerController;
}());
//# sourceMappingURL=/Users/jchesney/dev-peek-util/vortexjs/src/websql/WebSqlNativeScriptThreadedAdaptorService.js.map