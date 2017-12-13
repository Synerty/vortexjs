"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var WebSqlService_1 = require("../../websql/WebSqlService");
var Payload_1 = require("../Payload");
var TupleActionStorageServiceABC_1 = require("./TupleActionStorageServiceABC");
var datbaseName = "tupleActions.sqlite";
var tableName = "tupleActions";
var databaseSchema = [
    "CREATE TABLE IF NOT EXISTS " + tableName + "\n     (\n        id INTEGER PRIMARY KEY AUTOINCREMENT,\n        scope TEXT,\n        uuid REAL,\n        payload TEXT,\n        UNIQUE (scope, uuid)\n     )"
];
var TupleActionStorageWebSqlService = (function (_super) {
    __extends(TupleActionStorageWebSqlService, _super);
    function TupleActionStorageWebSqlService(webSqlFactory) {
        var _this = _super.call(this) || this;
        _this.webSqlFactory = webSqlFactory;
        _this.webSql = webSqlFactory.createWebSql(datbaseName, databaseSchema);
        return _this;
    }
    TupleActionStorageWebSqlService.prototype.storeAction = function (scope, tupleAction, payload) {
        var _this = this;
        return payload.toVortexMsg()
            .then(function (vortexMsg) {
            var sql = "INSERT INTO " + tableName + "\n                    (scope, uuid, payload)\n                    VALUES (?, ?, ?)";
            var bindParams = [scope, tupleAction.uuid, vortexMsg];
            return _this.webSql.runSql(sql, bindParams)
                .then(function () { return null; });
        });
    };
    TupleActionStorageWebSqlService.prototype.loadNextAction = function () {
        var sql = "SELECT payload\n                    FROM " + tableName + "\n                    ORDER BY id\n                    LIMIT 1";
        var bindParams = [];
        return this.webSql.querySql(sql, bindParams)
            .then(function (rows) {
            if (rows.length === 0) {
                return;
            }
            var row1 = rows[0];
            return Payload_1.Payload.fromVortexMsg(row1.payload);
        });
    };
    TupleActionStorageWebSqlService.prototype.countActions = function () {
        var sql = "SELECT count(payload) as count\n                    FROM " + tableName;
        var bindParams = [];
        return this.webSql.querySql(sql, bindParams)
            .then(function (rows) { return rows[0].count; });
    };
    TupleActionStorageWebSqlService.prototype.deleteAction = function (scope, actionUuid) {
        var sql = "DELETE FROM " + tableName + "\n                    WHERE scope=? AND uuid=?";
        var bindParams = [scope, actionUuid];
        return this.webSql.runSql(sql, bindParams)
            .then(function () { return null; });
    };
    TupleActionStorageWebSqlService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [WebSqlService_1.WebSqlFactoryService])
    ], TupleActionStorageWebSqlService);
    return TupleActionStorageWebSqlService;
}(TupleActionStorageServiceABC_1.TupleActionStorageServiceABC));
exports.TupleActionStorageWebSqlService = TupleActionStorageWebSqlService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVHVwbGVBY3Rpb25TdG9yYWdlV2ViU3FsU2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIlR1cGxlQWN0aW9uU3RvcmFnZVdlYlNxbFNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBeUM7QUFFekMsNERBQStFO0FBQy9FLHNDQUFtQztBQUNuQywrRUFBNEU7QUFFNUUsSUFBTSxXQUFXLEdBQUcscUJBQXFCLENBQUM7QUFFMUMsSUFBTSxTQUFTLEdBQUcsY0FBYyxDQUFDO0FBQ2pDLElBQU0sY0FBYyxHQUFHO0lBQ25CLGdDQUE4QixTQUFTLGtLQU9wQztDQUFDLENBQUM7QUFJVDtJQUFxRCxtREFBNEI7SUFHN0UseUNBQW9CLGFBQW1DO1FBQXZELFlBQ0ksaUJBQU8sU0FJVjtRQUxtQixtQkFBYSxHQUFiLGFBQWEsQ0FBc0I7UUFHbkQsS0FBSSxDQUFDLE1BQU0sR0FBRyxhQUFhLENBQUMsWUFBWSxDQUFDLFdBQVcsRUFBRSxjQUFjLENBQUMsQ0FBQzs7SUFFMUUsQ0FBQztJQUdELHFEQUFXLEdBQVgsVUFBWSxLQUFhLEVBQUUsV0FBMkIsRUFBRSxPQUFnQjtRQUF4RSxpQkFZQztRQVhHLE1BQU0sQ0FBQyxPQUFPLENBQUMsV0FBVyxFQUFFO2FBQ3ZCLElBQUksQ0FBQyxVQUFDLFNBQWlCO1lBRXBCLElBQUksR0FBRyxHQUFHLGlCQUFlLFNBQVMsdUZBRWIsQ0FBQztZQUN0QixJQUFJLFVBQVUsR0FBRyxDQUFDLEtBQUssRUFBRSxXQUFXLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1lBRXRELE1BQU0sQ0FBQyxLQUFJLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsVUFBVSxDQUFDO2lCQUNyQyxJQUFJLENBQUMsY0FBTSxPQUFBLElBQUksRUFBSixDQUFJLENBQUMsQ0FBQztRQUMxQixDQUFDLENBQUMsQ0FBQztJQUNYLENBQUM7SUFFRCx3REFBYyxHQUFkO1FBQ0ksSUFBSSxHQUFHLEdBQUcsOENBQ1MsU0FBUyxtRUFFUixDQUFDO1FBQ3JCLElBQUksVUFBVSxHQUFHLEVBQUUsQ0FBQztRQUVwQixNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFLFVBQVUsQ0FBQzthQUN2QyxJQUFJLENBQUMsVUFBQyxJQUFXO1lBQ2QsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNwQixNQUFNLENBQUM7WUFDWCxDQUFDO1lBRUQsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ25CLE1BQU0sQ0FBQyxpQkFBTyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDL0MsQ0FBQyxDQUFDLENBQUM7SUFDWCxDQUFDO0lBRUQsc0RBQVksR0FBWjtRQUNJLElBQUksR0FBRyxHQUFHLDhEQUNTLFNBQVcsQ0FBQztRQUMvQixJQUFJLFVBQVUsR0FBRyxFQUFFLENBQUM7UUFFcEIsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLEdBQUcsRUFBRSxVQUFVLENBQUM7YUFDdkMsSUFBSSxDQUFDLFVBQUMsSUFBVyxJQUFLLE9BQUEsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBYixDQUFhLENBQUMsQ0FBQztJQUM5QyxDQUFDO0lBRUQsc0RBQVksR0FBWixVQUFhLEtBQWEsRUFBRSxVQUFrQjtRQUMxQyxJQUFJLEdBQUcsR0FBRyxpQkFBZSxTQUFTLG1EQUNHLENBQUM7UUFDdEMsSUFBSSxVQUFVLEdBQUcsQ0FBQyxLQUFLLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFFckMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxVQUFVLENBQUM7YUFDN0IsSUFBSSxDQUFDLGNBQU0sT0FBQSxJQUFJLEVBQUosQ0FBSSxDQUFDLENBQUM7SUFFbEMsQ0FBQztJQTVEUSwrQkFBK0I7UUFEM0MsaUJBQVUsRUFBRTt5Q0FJMEIsb0NBQW9CO09BSDlDLCtCQUErQixDQThEM0M7SUFBRCxzQ0FBQztDQUFBLEFBOURELENBQXFELDJEQUE0QixHQThEaEY7QUE5RFksMEVBQStCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtJbmplY3RhYmxlfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xuaW1wb3J0IHtUdXBsZUFjdGlvbkFCQ30gZnJvbSBcIi4uL1R1cGxlQWN0aW9uXCI7XG5pbXBvcnQge1dlYlNxbEZhY3RvcnlTZXJ2aWNlLCBXZWJTcWxTZXJ2aWNlfSBmcm9tIFwiLi4vLi4vd2Vic3FsL1dlYlNxbFNlcnZpY2VcIjtcbmltcG9ydCB7UGF5bG9hZH0gZnJvbSBcIi4uL1BheWxvYWRcIjtcbmltcG9ydCB7VHVwbGVBY3Rpb25TdG9yYWdlU2VydmljZUFCQ30gZnJvbSBcIi4vVHVwbGVBY3Rpb25TdG9yYWdlU2VydmljZUFCQ1wiO1xuXG5jb25zdCBkYXRiYXNlTmFtZSA9IFwidHVwbGVBY3Rpb25zLnNxbGl0ZVwiO1xuXG5jb25zdCB0YWJsZU5hbWUgPSBcInR1cGxlQWN0aW9uc1wiO1xuY29uc3QgZGF0YWJhc2VTY2hlbWEgPSBbXG4gICAgYENSRUFURSBUQUJMRSBJRiBOT1QgRVhJU1RTICR7dGFibGVOYW1lfVxuICAgICAoXG4gICAgICAgIGlkIElOVEVHRVIgUFJJTUFSWSBLRVkgQVVUT0lOQ1JFTUVOVCxcbiAgICAgICAgc2NvcGUgVEVYVCxcbiAgICAgICAgdXVpZCBSRUFMLFxuICAgICAgICBwYXlsb2FkIFRFWFQsXG4gICAgICAgIFVOSVFVRSAoc2NvcGUsIHV1aWQpXG4gICAgIClgXTtcblxuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgVHVwbGVBY3Rpb25TdG9yYWdlV2ViU3FsU2VydmljZSBleHRlbmRzIFR1cGxlQWN0aW9uU3RvcmFnZVNlcnZpY2VBQkMge1xuICAgIHByaXZhdGUgd2ViU3FsOiBXZWJTcWxTZXJ2aWNlO1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSB3ZWJTcWxGYWN0b3J5OiBXZWJTcWxGYWN0b3J5U2VydmljZSkge1xuICAgICAgICBzdXBlcigpO1xuXG4gICAgICAgIHRoaXMud2ViU3FsID0gd2ViU3FsRmFjdG9yeS5jcmVhdGVXZWJTcWwoZGF0YmFzZU5hbWUsIGRhdGFiYXNlU2NoZW1hKTtcblxuICAgIH1cblxuXG4gICAgc3RvcmVBY3Rpb24oc2NvcGU6IHN0cmluZywgdHVwbGVBY3Rpb246IFR1cGxlQWN0aW9uQUJDLCBwYXlsb2FkOiBQYXlsb2FkKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIHJldHVybiBwYXlsb2FkLnRvVm9ydGV4TXNnKClcbiAgICAgICAgICAgIC50aGVuKCh2b3J0ZXhNc2c6IHN0cmluZykgPT4ge1xuXG4gICAgICAgICAgICAgICAgbGV0IHNxbCA9IGBJTlNFUlQgSU5UTyAke3RhYmxlTmFtZX1cbiAgICAgICAgICAgICAgICAgICAgKHNjb3BlLCB1dWlkLCBwYXlsb2FkKVxuICAgICAgICAgICAgICAgICAgICBWQUxVRVMgKD8sID8sID8pYDtcbiAgICAgICAgICAgICAgICBsZXQgYmluZFBhcmFtcyA9IFtzY29wZSwgdHVwbGVBY3Rpb24udXVpZCwgdm9ydGV4TXNnXTtcblxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLndlYlNxbC5ydW5TcWwoc3FsLCBiaW5kUGFyYW1zKVxuICAgICAgICAgICAgICAgICAgICAudGhlbigoKSA9PiBudWxsKTtcbiAgICAgICAgICAgIH0pO1xuICAgIH1cblxuICAgIGxvYWROZXh0QWN0aW9uKCk6IFByb21pc2U8UGF5bG9hZD4ge1xuICAgICAgICBsZXQgc3FsID0gYFNFTEVDVCBwYXlsb2FkXG4gICAgICAgICAgICAgICAgICAgIEZST00gJHt0YWJsZU5hbWV9XG4gICAgICAgICAgICAgICAgICAgIE9SREVSIEJZIGlkXG4gICAgICAgICAgICAgICAgICAgIExJTUlUIDFgO1xuICAgICAgICBsZXQgYmluZFBhcmFtcyA9IFtdO1xuXG4gICAgICAgIHJldHVybiB0aGlzLndlYlNxbC5xdWVyeVNxbChzcWwsIGJpbmRQYXJhbXMpXG4gICAgICAgICAgICAudGhlbigocm93czogYW55W10pID0+IHtcbiAgICAgICAgICAgICAgICBpZiAocm93cy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGxldCByb3cxID0gcm93c1swXTtcbiAgICAgICAgICAgICAgICByZXR1cm4gUGF5bG9hZC5mcm9tVm9ydGV4TXNnKHJvdzEucGF5bG9hZCk7XG4gICAgICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBjb3VudEFjdGlvbnMoKTogUHJvbWlzZTxudW1iZXI+IHtcbiAgICAgICAgbGV0IHNxbCA9IGBTRUxFQ1QgY291bnQocGF5bG9hZCkgYXMgY291bnRcbiAgICAgICAgICAgICAgICAgICAgRlJPTSAke3RhYmxlTmFtZX1gO1xuICAgICAgICBsZXQgYmluZFBhcmFtcyA9IFtdO1xuXG4gICAgICAgIHJldHVybiB0aGlzLndlYlNxbC5xdWVyeVNxbChzcWwsIGJpbmRQYXJhbXMpXG4gICAgICAgICAgICAudGhlbigocm93czogYW55W10pID0+IHJvd3NbMF0uY291bnQpO1xuICAgIH1cblxuICAgIGRlbGV0ZUFjdGlvbihzY29wZTogc3RyaW5nLCBhY3Rpb25VdWlkOiBudW1iZXIpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgbGV0IHNxbCA9IGBERUxFVEUgRlJPTSAke3RhYmxlTmFtZX1cbiAgICAgICAgICAgICAgICAgICAgV0hFUkUgc2NvcGU9PyBBTkQgdXVpZD0/YDtcbiAgICAgICAgbGV0IGJpbmRQYXJhbXMgPSBbc2NvcGUsIGFjdGlvblV1aWRdO1xuXG4gICAgICAgIHJldHVybiB0aGlzLndlYlNxbC5ydW5TcWwoc3FsLCBiaW5kUGFyYW1zKVxuICAgICAgICAgICAgICAgICAgICAudGhlbigoKSA9PiBudWxsKTtcblxuICAgIH1cblxufVxuXG4iXX0=