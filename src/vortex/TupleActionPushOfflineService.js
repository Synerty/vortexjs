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
var VortexStatusService_1 = require("./VortexStatusService");
var WebSqlService_1 = require("../websql/WebSqlService");
var TupleActionPushService_1 = require("./TupleActionPushService");
var Payload_1 = require("./Payload");
var VortexService_1 = require("./VortexService");
var UtilMisc_1 = require("./UtilMisc");
var PayloadResponse_1 = require("./PayloadResponse");
var datbaseName = "tupleActions.sqlite";
var tableName = "tupleActions";
var databaseSchema = [
    "CREATE TABLE IF NOT EXISTS " + tableName + "\n     (\n        id INTEGER PRIMARY KEY AUTOINCREMENT,\n        scope TEXT,\n        uuid REAL,\n        payload TEXT,\n        UNIQUE (scope, uuid)\n     )"
];
var TupleActionPushOfflineService = (function (_super) {
    __extends(TupleActionPushOfflineService, _super);
    function TupleActionPushOfflineService(tupleActionName, vortexService, vortexStatus, webSqlFactory) {
        var _this = _super.call(this, tupleActionName, vortexService, vortexStatus) || this;
        _this.tableName = "tupleActions";
        _this.sendingTuple = false;
        _this.lastSendFailTime = null;
        _this.SEND_FAIL_RETRY_TIMEOUT = 5000; // milliseconds
        _this.SERVER_PROCESSING_TIMEOUT = 5000; // milliseconds
        _this.SEND_FAIL_RETRY_BACKOFF = 5000; // milliseconds
        _this.webSql = webSqlFactory.createWebSql(datbaseName, databaseSchema);
        _this.storageName = tupleActionName.name;
        // TODO: Unsubscribe this
        _this.vortexStatus.isOnline
            .filter(function (online) { return online === true; })
            .subscribe(function (online) { return _this.sendNextAction(); });
        _this.countActions()
            .then(function () { return _this.sendNextAction(); })
            .catch(function (err) {
            var errStr = UtilMisc_1.errToStr(err);
            var msg = "Failed to count or sendNextAction action " + _this.storageName + " : " + errStr;
            console.log(msg);
            // Consume error
        });
        return _this;
    }
    TupleActionPushOfflineService.prototype.pushAction = function (tupleAction) {
        var _this = this;
        return this.storeAction(tupleAction)
            .then(function () {
            _this.sendNextAction();
            return [];
        })
            .catch(function (err) {
            var errStr = UtilMisc_1.errToStr(err);
            var msg = "Failed to store action " + _this.storageName + " : " + errStr;
            console.log(msg);
            throw new Error(msg);
        });
    };
    TupleActionPushOfflineService.prototype.sendNextAction = function () {
        var _this = this;
        if (this.sendingTuple)
            return;
        if (!this.vortexStatus.snapshot.isOnline)
            return;
        // Don't continually retry, if we have a last send fail, ensure we wait
        // {SEND_FAIL_RETRY_BACKOFF} before sending again.
        if (this.lastSendFailTime != null) {
            var reconnectDiffMs = Date.now() - this.lastSendFailTime;
            if (reconnectDiffMs < this.SEND_FAIL_RETRY_BACKOFF) {
                // +10ms to ensure we're just out of the backoff time.
                setTimeout(function () { return _this.sendNextAction(); }, this.SEND_FAIL_RETRY_BACKOFF - reconnectDiffMs + 10);
                return;
            }
            else {
                this.lastSendFailTime = null;
            }
        }
        this.sendingTuple = true;
        // Get the next tuple from the persistent queue
        this.loadNextAction()
            .then(function (tupleAction) {
            // Is the end the end of the queue?
            if (tupleAction == null) {
                _this.sendingTuple = false;
                return;
            }
            var actionUuid = tupleAction.uuid;
            return new PayloadResponse_1.PayloadResponse(_this.vortexService, _this.makePayload(tupleAction), PayloadResponse_1.PayloadResponse.RESPONSE_TIMEOUT_SECONDS, // Timeout
            false // don't check result, only reject if it times out
            ).then(function (payload) {
                // If we received a payload, but it has an error message
                // Log an error, it's out of our hands, move on.
                var r = payload.result; // success is null or true
                if (!(r == null || r === true)) {
                    _this.vortexStatus.logError('Server failed to process Action: ' + payload.result.toString());
                }
                _this.deleteAction(actionUuid);
                _this.sendingTuple = false;
                _this.sendNextAction();
            });
        })
            .catch(function (err) {
            _this.lastSendFailTime = Date.now();
            var errStr = UtilMisc_1.errToStr(err);
            _this.vortexStatus.logError("Failed to send TupleAction " + _this.storageName + " : " + errStr);
            _this.sendingTuple = false;
            setTimeout(function () { return _this.sendNextAction(); }, _this.SEND_FAIL_RETRY_TIMEOUT);
            return null; // Handle the error
        });
    };
    TupleActionPushOfflineService.prototype.storeAction = function (tupleAction) {
        var _this = this;
        // The payload is a convenient way to serialise and compress the data
        return new Payload_1.Payload({}, [tupleAction]).toVortexMsg()
            .then(function (vortexMsg) {
            var sql = "INSERT INTO " + tableName + "\n                    (scope, uuid, payload)\n                    VALUES (?, ?, ?)";
            var bindParams = [_this.storageName, tupleAction.uuid, vortexMsg];
            return _this.webSql.runSql(sql, bindParams)
                .then(function (val) {
                _this.vortexStatus.incrementQueuedActionCount();
                return val;
            })
                .then(function () { return [tupleAction]; });
        });
    };
    TupleActionPushOfflineService.prototype.loadNextAction = function () {
        var sql = "SELECT payload\n                    FROM " + tableName + "\n                    WHERE scope = ?\n                    ORDER BY id\n                    LIMIT 1";
        var bindParams = [this.storageName];
        return this.webSql.querySql(sql, bindParams)
            .then(function (rows) {
            if (rows.length === 0) {
                return;
            }
            var row1 = rows[0];
            return Payload_1.Payload.fromVortexMsg(row1.payload)
                .then(function (payload) {
                UtilMisc_1.assert(payload.tuples.length === 1, "Expected 1 tuple, got " + payload.tuples.length);
                return payload.tuples[0];
            });
        });
    };
    TupleActionPushOfflineService.prototype.countActions = function () {
        var _this = this;
        var sql = "SELECT count(payload) as count\n                    FROM " + tableName + "\n                    WHERE scope = ?";
        var bindParams = [this.storageName];
        return this.webSql.querySql(sql, bindParams)
            .then(function (rows) {
            _this.vortexStatus.setQueuedActionCount(rows[0].count);
        }).catch(function (err) {
            var errStr = UtilMisc_1.errToStr(err);
            _this.vortexStatus.logError("Failed to count TupleActions " + _this.storageName + " : " + errStr);
            // Consume error
        });
    };
    TupleActionPushOfflineService.prototype.deleteAction = function (actionUuid) {
        var _this = this;
        var sql = "DELETE FROM " + tableName + "\n                    WHERE scope=? AND uuid=?";
        var bindParams = [this.storageName, actionUuid];
        return this.webSql.runSql(sql, bindParams)
            .then(function () {
            _this.vortexStatus.decrementQueuedActionCount();
            return;
        });
    };
    return TupleActionPushOfflineService;
}(TupleActionPushService_1.TupleActionPushService));
TupleActionPushOfflineService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [TupleActionPushService_1.TupleActionPushNameService,
        VortexService_1.VortexService,
        VortexStatusService_1.VortexStatusService,
        WebSqlService_1.WebSqlFactoryService])
], TupleActionPushOfflineService);
exports.TupleActionPushOfflineService = TupleActionPushOfflineService;
//# sourceMappingURL=/home/peek/project/vortexjs/src/vortex/TupleActionPushOfflineService.js.map