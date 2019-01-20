"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var UtilMisc_1 = require("../UtilMisc");
exports.indexedDB = window.indexedDB || window.mozIndexedDB
    || window.webkitIndexedDB || window.msIndexedDB;
exports.IDBTransaction = window.IDBTransaction
    || window.webkitIDBTransaction || window.msIDBTransaction;
exports.IDBKeyRange = window.IDBKeyRange
    || window.webkitIDBKeyRange || window.msIDBKeyRange;
function supportsIndexedDb() {
    return !!exports.indexedDB;
}
exports.supportsIndexedDb = supportsIndexedDb;
// ----------------------------------------------------------------------------
var IDBException = /** @class */ (function () {
    function IDBException(message) {
        this.message = message;
    }
    IDBException.prototype.toString = function () {
        return 'IndexedDB : IDBException: ' + this.message;
    };
    return IDBException;
}());
exports.IDBException = IDBException;
function addIndexedDbHandlers(request, stacktraceFunctor) {
    var _this = this;
    request.onerror = function (request) {
        console.log(UtilMisc_1.dateStr() + "IndexedDB : ERROR " + request.target.error);
        _this.balloonMsg.showError("IndexedDB : ERROR " + request.target.error);
        stacktraceFunctor();
    };
    request.onabort = function (request) {
        console.log(UtilMisc_1.dateStr() + "IndexedDB : ABORT " + request.target.error);
        _this.balloonMsg.showError("IndexedDB : ABORT " + request.target.error);
        stacktraceFunctor();
    };
    request.onblock = function (request) {
        console.log(UtilMisc_1.dateStr() + "IndexedDB : BLOCKED " + request.target.error);
        _this.balloonMsg.showError("IndexedDB : BLOCKED " + request.target.error);
        stacktraceFunctor();
    };
}
exports.addIndexedDbHandlers = addIndexedDbHandlers;
//# sourceMappingURL=/Users/jchesney/dev-peek-util/vortexjs/src/vortex/storage/IndexedDb.js.map