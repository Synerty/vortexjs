"use strict";
var Payload_1 = require("./Payload");
var datbaseName = "offlineTuples.sqlite";
var databaseSchema = [
    "CREATE TABLE IF NOT EXISTS tuples\n     (\n        tupleSelector TEXT PRIMARY KEY ASC,\n        dateTime REAL,\n        payload TEXT\n     )"
];
var TupleOfflineStorageService = (function () {
    function TupleOfflineStorageService(webSqlFactory) {
        this.webSql = webSqlFactory.createWebSql(datbaseName, databaseSchema);
    }
    TupleOfflineStorageService.prototype.loadTuples = function (tupleSelector) {
        var _this = this;
        var tupleSelectorStr = tupleSelector.toOrderedJsonStr();
        var sql = "SELECT tupleSelector, dateTime, payload\n                    FROM tuples\n                    WHERE tupleSelector = ?";
        var bindParams = [tupleSelectorStr];
        return new Promise(function (resolve, reject) {
            _this.webSql.querySql(sql, bindParams)
                .catch(reject)
                .then(function (rows) {
                if (rows.length === 0) {
                    resolve([]);
                    return;
                }
                var row1 = rows[0];
                var payload = Payload_1.Payload.fromVortexMsg(row1.payload);
                resolve(payload.tuples);
            });
        });
    };
    TupleOfflineStorageService.prototype.saveTuples = function (tupleSelector, tuples) {
        // The payload is a convenient way to serialise and compress the data
        var payloadData = new Payload_1.Payload({}, tuples).toVortexMsg();
        var tupleSelectorStr = tupleSelector.toOrderedJsonStr();
        var sql = 'INSERT OR REPLACE INTO tuples VALUES (?, ?, ?)';
        var bindParams = [tupleSelectorStr, Date.now(), payloadData];
        return this.webSql.runSql(sql, bindParams);
    };
    return TupleOfflineStorageService;
}());
exports.TupleOfflineStorageService = TupleOfflineStorageService;
//# sourceMappingURL=/home/peek/project/vortexjs/src/src/vortex/TupleOfflineStorageService.js.map