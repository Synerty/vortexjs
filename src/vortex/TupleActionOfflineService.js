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
var VortexStatusService_1 = require("./VortexStatusService");
var WebSqlService_1 = require("../websql/WebSqlService");
var TupleActionService_1 = require("./TupleActionService");
var Payload_1 = require("./Payload");
var VortexService_1 = require("./VortexService");
var UtilMisc_1 = require("./UtilMisc");
var datbaseName = "tupleActions.sqlite";
var tableName = "tupleActions";
var databaseSchema = [
    "CREATE TABLE IF NOT EXISTS " + tableName + "\n     (\n        id PRIMARY KEY AUTOINCREMENT,\n        scope TEXT,\n        uuid REAL,\n        payload TEXT,\n        UNIQUE (scope, uuid)\n     )"
];
var TupleActionOfflineService = (function (_super) {
    __extends(TupleActionOfflineService, _super);
    function TupleActionOfflineService(tupleActionName, vortexService, vortexStatus, webSqlFactory) {
        var _this = _super.call(this, tupleActionName, vortexService, vortexStatus) || this;
        _this.tableName = "tupleActions";
        _this.sendingTuple = false;
        _this.SEND_FAIL_RETRY_TIMEOUT = 5000; // milliseconds
        _this.webSql = webSqlFactory.createWebSql(datbaseName, databaseSchema);
        _this.storageName = tupleActionName.name;
        // TODO: Unsubscribe this
        _this.vortexStatus.isOnline
            .filter(function (online) { return online === true; })
            .subscribe(function (online) { return _this.sendNextAction(); });
        return _this;
    }
    TupleActionOfflineService.prototype.pushAction = function (tupleAction) {
        var p = this.storeAction(tupleAction);
        this.sendNextAction();
        return p;
    };
    TupleActionOfflineService.prototype.sendNextAction = function () {
        var _this = this;
        if (this.sendingTuple)
            return;
        // Get the next tuple from the persistent queue
        this.loadNextAction()
            .then(function (tupleAction) {
            // Is the end the end of the queue?
            if (tupleAction == null)
                return;
            // No?, ok, lets send the action to the server
            return _this.sendAction(tupleAction)
                .then(function (tupleAction) {
                _this.deleteAction(tupleAction.uuid);
                _this.sendingTuple = false;
                _this.sendNextAction();
            });
        })
            .catch(function (err) {
            _this.vortexStatus.logError("Failed to send TupleAction : " + err);
            _this.sendingTuple = false;
            setTimeout(function () { return _this.sendNextAction(); }, _this.SEND_FAIL_RETRY_TIMEOUT);
            return null; // Handle the error
        });
    };
    TupleActionOfflineService.prototype.storeAction = function (tupleAction) {
        // The payload is a convenient way to serialise and compress the data
        var payloadData = new Payload_1.Payload({}, [tupleAction]).toVortexMsg();
        var sql = "INSERT INTO " + tableName + "\n                    (scope, uuid, payload)\n                    VALUES (?, ?, ?)";
        var bindParams = [this.storageName, tupleAction.uuid, payloadData];
        return this.webSql.runSql(sql, bindParams)
            .then(function () { return tupleAction; }); //
    };
    TupleActionOfflineService.prototype.loadNextAction = function () {
        var sql = "SELECT payload\n                    FROM " + tableName + "\n                    WHERE scope = ?\n                    ORDER BY id\n                    LIMIT 1";
        var bindParams = [this.storageName];
        return this.webSql.querySql(sql, bindParams)
            .then(function (rows) {
            if (rows.length === 0) {
                return [];
            }
            var row1 = rows[0];
            var payload = Payload_1.Payload.fromVortexMsg(row1.payload);
            UtilMisc_1.assert(payload.tuples.length === 1, "Expected 1 tuple, got " + payload.tuples.length);
            return payload.tuples[0];
        });
    };
    TupleActionOfflineService.prototype.deleteAction = function (actionUuid) {
        var sql = "DELETE FROM " + tableName + "\n                    WHERE scope=? AND uuid=?";
        var bindParams = [this.storageName, actionUuid];
        return this.webSql.runSql(sql, bindParams)
            .then(function () {
            return;
        });
    };
    return TupleActionOfflineService;
}(TupleActionService_1.TupleActionService));
TupleActionOfflineService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [TupleActionService_1.TupleActionNameService,
        VortexService_1.VortexService,
        VortexStatusService_1.VortexStatusService,
        WebSqlService_1.WebSqlFactoryService])
], TupleActionOfflineService);
exports.TupleActionOfflineService = TupleActionOfflineService;
//# sourceMappingURL=/home/peek/project/vortexjs/src/vortex/TupleActionOfflineService.js.map