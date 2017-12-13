"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var WebSqlService_1 = require("../../websql/WebSqlService");
var Payload_1 = require("../Payload");
var core_1 = require("@angular/core");
var TupleStorageServiceABC_1 = require("./TupleStorageServiceABC");
var TupleOfflineStorageNameService_1 = require("../TupleOfflineStorageNameService");
var UtilMisc_1 = require("../UtilMisc");
// ----------------------------------------------------------------------------
var databaseSchema = [
    "CREATE TABLE IF NOT EXISTS tuples\n     (\n        tupleSelector TEXT,\n        dateTime REAL,\n        payload TEXT,\n        PRIMARY KEY (tupleSelector)\n     )"
];
var insertSql = "INSERT OR REPLACE INTO tuples\n                 (tupleSelector, dateTime, payload)\n                 VALUES (?, ?, ?)";
var selectSql = "SELECT tupleSelector, dateTime, payload\n                 FROM tuples\n                 WHERE tupleSelector = ?";
var TupleStorageWebSqlService = (function (_super) {
    __extends(TupleStorageWebSqlService, _super);
    function TupleStorageWebSqlService(webSqlFactory, name) {
        var _this = _super.call(this, name) || this;
        _this.openInProgressPromise = null;
        _this.webSql = webSqlFactory.createWebSql(_this.dbName, databaseSchema);
        return _this;
    }
    TupleStorageWebSqlService.prototype.open = function () {
        var _this = this;
        if (this.openInProgressPromise != null)
            return this.openInProgressPromise;
        this.openInProgressPromise = this.webSql.open()
            .then(function () { return _this.openInProgressPromise = null; })
            .catch(function (e) {
            _this.openInProgressPromise = null;
            throw (e);
        });
        return this.openInProgressPromise;
    };
    TupleStorageWebSqlService.prototype.isOpen = function () {
        return this.webSql.isOpen();
    };
    TupleStorageWebSqlService.prototype.close = function () {
        this.webSql.close();
    };
    TupleStorageWebSqlService.prototype.transaction = function (forWrite) {
        return this.webSql.transaction()
            .then(function (t) { return new TupleWebSqlTransaction(t, forWrite); });
    };
    TupleStorageWebSqlService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [WebSqlService_1.WebSqlFactoryService,
            TupleOfflineStorageNameService_1.TupleOfflineStorageNameService])
    ], TupleStorageWebSqlService);
    return TupleStorageWebSqlService;
}(TupleStorageServiceABC_1.TupleStorageServiceABC));
exports.TupleStorageWebSqlService = TupleStorageWebSqlService;
var TupleWebSqlTransaction = (function () {
    function TupleWebSqlTransaction(tx, txForWrite) {
        this.tx = tx;
        this.txForWrite = txForWrite;
    }
    TupleWebSqlTransaction.prototype.loadTuples = function (tupleSelector) {
        return this.loadTuplesEncoded(tupleSelector)
            .then(function (vortexMsg) {
            if (vortexMsg == null) {
                return [];
            }
            return Payload_1.Payload.fromVortexMsg(vortexMsg)
                .then(function (payload) { return payload.tuples; });
        });
    };
    TupleWebSqlTransaction.prototype.loadTuplesEncoded = function (tupleSelector) {
        var bindParams = [tupleSelector.toOrderedJsonStr()];
        return this.tx.executeSql(selectSql, bindParams)
            .then(function (rows) {
            if (rows.length === 0) {
                return null;
            }
            var row1 = rows[0];
            return row1.payload;
        });
    };
    TupleWebSqlTransaction.prototype.saveTuples = function (tupleSelector, tuples) {
        var _this = this;
        // The payload is a convenient way to serialise and compress the data
        return new Payload_1.Payload({}, tuples).toVortexMsg()
            .then(function (vortexMsg) {
            return _this.saveTuplesEncoded(tupleSelector, vortexMsg);
        });
    };
    TupleWebSqlTransaction.prototype.saveTuplesEncoded = function (tupleSelector, vortexMsg) {
        if (!this.txForWrite) {
            var msg = "WebSQL: saveTuples attempted on read only TX";
            console.log(UtilMisc_1.dateStr() + " " + msg);
            return Promise.reject(msg);
        }
        // The payload is a convenient way to serialise and compress the data
        var tupleSelectorStr = tupleSelector.toOrderedJsonStr();
        var bindParams = [tupleSelectorStr, Date.now(), vortexMsg];
        return this.tx.executeSql(insertSql, bindParams)
            .then(function () { return null; }); // Convert the result
    };
    TupleWebSqlTransaction.prototype.close = function () {
        return Promise.resolve();
    };
    return TupleWebSqlTransaction;
}());
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVHVwbGVTdG9yYWdlV2ViU3FsU2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIlR1cGxlU3RvcmFnZVdlYlNxbFNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw0REFJb0M7QUFHcEMsc0NBQW1DO0FBQ25DLHNDQUF5QztBQUN6QyxtRUFBeUY7QUFDekYsb0ZBQWlGO0FBQ2pGLHdDQUFvQztBQUdwQywrRUFBK0U7QUFDL0UsSUFBSSxjQUFjLEdBQUc7SUFDakIsb0tBTUc7Q0FDTixDQUFDO0FBR0YsSUFBSSxTQUFTLEdBQUcsdUhBRWtCLENBQUM7QUFHbkMsSUFBSSxTQUFTLEdBQUcsaUhBRXlCLENBQUM7QUFJMUM7SUFBK0MsNkNBQXNCO0lBSWpFLG1DQUFZLGFBQW1DLEVBQ25DLElBQW9DO1FBRGhELFlBRUksa0JBQU0sSUFBSSxDQUFDLFNBRWQ7UUFOTywyQkFBcUIsR0FBeUIsSUFBSSxDQUFDO1FBS3ZELEtBQUksQ0FBQyxNQUFNLEdBQUcsYUFBYSxDQUFDLFlBQVksQ0FBQyxLQUFJLENBQUMsTUFBTSxFQUFFLGNBQWMsQ0FBQyxDQUFDOztJQUMxRSxDQUFDO0lBRUQsd0NBQUksR0FBSjtRQUFBLGlCQVlDO1FBWEcsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLHFCQUFxQixJQUFJLElBQUksQ0FBQztZQUNuQyxNQUFNLENBQUMsSUFBSSxDQUFDLHFCQUFxQixDQUFDO1FBRXRDLElBQUksQ0FBQyxxQkFBcUIsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRTthQUMxQyxJQUFJLENBQUMsY0FBTSxPQUFBLEtBQUksQ0FBQyxxQkFBcUIsR0FBRyxJQUFJLEVBQWpDLENBQWlDLENBQUM7YUFDN0MsS0FBSyxDQUFDLFVBQUEsQ0FBQztZQUNKLEtBQUksQ0FBQyxxQkFBcUIsR0FBRyxJQUFJLENBQUM7WUFDbEMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2QsQ0FBQyxDQUFDLENBQUM7UUFFUCxN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QUcsQ0FBQyxDQUFBO1FBQzlCLENBQUM7UUFFRCxxRUFBcUU7UUFDckUsSUFBSSxnQkFBZ0IsR0FBRyxhQUFhLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztRQUN4RCxJQUFJLFVBQVUsR0FBRyxDQUFDLGdCQUFnQixFQUFFLElBQUksQ0FBQyxHQUFHLEVBQUUsRUFBRSxTQUFTLENBQUMsQ0FBQztRQUUzRCxNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsU0FBUyxFQUFFLFVBQVUsQ0FBQzthQUMzQyxJQUFJLENBQUMsY0FBTSxPQUFBLElBQUksRUFBSixDQUFJLENBQUMsQ0FBQyxDQUFDLHFCQUFxQjtJQUVoRCxDQUFDO0lBRUQsc0NBQUssR0FBTDtRQUNJLE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUM7SUFDN0IsQ0FBQztJQUdMLDZCQUFDO0FBQUQsQ0FBQyxBQW5FRCxJQW1FQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XG4gICAgV2ViU3FsRmFjdG9yeVNlcnZpY2UsXG4gICAgV2ViU3FsU2VydmljZSxcbiAgICBXZWJTcWxUcmFuc2FjdGlvblxufSBmcm9tIFwiLi4vLi4vd2Vic3FsL1dlYlNxbFNlcnZpY2VcIjtcbmltcG9ydCB7VHVwbGVTZWxlY3Rvcn0gZnJvbSBcIi4uL1R1cGxlU2VsZWN0b3JcIjtcbmltcG9ydCB7VHVwbGV9IGZyb20gXCIuLi9UdXBsZVwiO1xuaW1wb3J0IHtQYXlsb2FkfSBmcm9tIFwiLi4vUGF5bG9hZFwiO1xuaW1wb3J0IHtJbmplY3RhYmxlfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xuaW1wb3J0IHtUdXBsZVN0b3JhZ2VTZXJ2aWNlQUJDLCBUdXBsZVN0b3JhZ2VUcmFuc2FjdGlvbn0gZnJvbSBcIi4vVHVwbGVTdG9yYWdlU2VydmljZUFCQ1wiO1xuaW1wb3J0IHtUdXBsZU9mZmxpbmVTdG9yYWdlTmFtZVNlcnZpY2V9IGZyb20gXCIuLi9UdXBsZU9mZmxpbmVTdG9yYWdlTmFtZVNlcnZpY2VcIjtcbmltcG9ydCB7ZGF0ZVN0cn0gZnJvbSBcIi4uL1V0aWxNaXNjXCI7XG5cblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxubGV0IGRhdGFiYXNlU2NoZW1hID0gW1xuICAgIGBDUkVBVEUgVEFCTEUgSUYgTk9UIEVYSVNUUyB0dXBsZXNcbiAgICAgKFxuICAgICAgICB0dXBsZVNlbGVjdG9yIFRFWFQsXG4gICAgICAgIGRhdGVUaW1lIFJFQUwsXG4gICAgICAgIHBheWxvYWQgVEVYVCxcbiAgICAgICAgUFJJTUFSWSBLRVkgKHR1cGxlU2VsZWN0b3IpXG4gICAgIClgXG5dO1xuXG5cbmxldCBpbnNlcnRTcWwgPSBgSU5TRVJUIE9SIFJFUExBQ0UgSU5UTyB0dXBsZXNcbiAgICAgICAgICAgICAgICAgKHR1cGxlU2VsZWN0b3IsIGRhdGVUaW1lLCBwYXlsb2FkKVxuICAgICAgICAgICAgICAgICBWQUxVRVMgKD8sID8sID8pYDtcblxuXG5sZXQgc2VsZWN0U3FsID0gYFNFTEVDVCB0dXBsZVNlbGVjdG9yLCBkYXRlVGltZSwgcGF5bG9hZFxuICAgICAgICAgICAgICAgICBGUk9NIHR1cGxlc1xuICAgICAgICAgICAgICAgICBXSEVSRSB0dXBsZVNlbGVjdG9yID0gP2A7XG5cblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIFR1cGxlU3RvcmFnZVdlYlNxbFNlcnZpY2UgZXh0ZW5kcyBUdXBsZVN0b3JhZ2VTZXJ2aWNlQUJDIHtcbiAgICBwcml2YXRlIHdlYlNxbDogV2ViU3FsU2VydmljZTtcbiAgICBwcml2YXRlIG9wZW5JblByb2dyZXNzUHJvbWlzZTogUHJvbWlzZTx2b2lkPiB8IG51bGwgPSBudWxsO1xuXG4gICAgY29uc3RydWN0b3Iod2ViU3FsRmFjdG9yeTogV2ViU3FsRmFjdG9yeVNlcnZpY2UsXG4gICAgICAgICAgICAgICAgbmFtZTogVHVwbGVPZmZsaW5lU3RvcmFnZU5hbWVTZXJ2aWNlKSB7XG4gICAgICAgIHN1cGVyKG5hbWUpO1xuICAgICAgICB0aGlzLndlYlNxbCA9IHdlYlNxbEZhY3RvcnkuY3JlYXRlV2ViU3FsKHRoaXMuZGJOYW1lLCBkYXRhYmFzZVNjaGVtYSk7XG4gICAgfVxuXG4gICAgb3BlbigpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgaWYgKHRoaXMub3BlbkluUHJvZ3Jlc3NQcm9taXNlICE9IG51bGwpXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5vcGVuSW5Qcm9ncmVzc1Byb21pc2U7XG5cbiAgICAgICAgdGhpcy5vcGVuSW5Qcm9ncmVzc1Byb21pc2UgPSB0aGlzLndlYlNxbC5vcGVuKClcbiAgICAgICAgICAgIC50aGVuKCgpID0+IHRoaXMub3BlbkluUHJvZ3Jlc3NQcm9taXNlID0gbnVsbClcbiAgICAgICAgICAgIC5jYXRjaChlID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLm9wZW5JblByb2dyZXNzUHJvbWlzZSA9IG51bGw7XG4gICAgICAgICAgICAgICAgdGhyb3cgKGUpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMub3BlbkluUHJvZ3Jlc3NQcm9taXNlO1xuICAgIH1cblxuICAgIGlzT3BlbigpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMud2ViU3FsLmlzT3BlbigpO1xuICAgIH1cblxuICAgIGNsb3NlKCk6IHZvaWQge1xuICAgICAgICB0aGlzLndlYlNxbC5jbG9zZSgpXG4gICAgfVxuXG4gICAgdHJhbnNhY3Rpb24oZm9yV3JpdGU6IGJvb2xlYW4pOiBQcm9taXNlPFR1cGxlU3RvcmFnZVRyYW5zYWN0aW9uPiB7XG4gICAgICAgIHJldHVybiB0aGlzLndlYlNxbC50cmFuc2FjdGlvbigpXG4gICAgICAgICAgICAudGhlbih0ID0+IG5ldyBUdXBsZVdlYlNxbFRyYW5zYWN0aW9uKHQsIGZvcldyaXRlKSk7XG4gICAgfVxufVxuXG5cbmNsYXNzIFR1cGxlV2ViU3FsVHJhbnNhY3Rpb24gaW1wbGVtZW50cyBUdXBsZVN0b3JhZ2VUcmFuc2FjdGlvbiB7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHR4OiBXZWJTcWxUcmFuc2FjdGlvbiwgcHJpdmF0ZSB0eEZvcldyaXRlOiBib29sZWFuKSB7XG5cbiAgICB9XG5cbiAgICBsb2FkVHVwbGVzKHR1cGxlU2VsZWN0b3I6IFR1cGxlU2VsZWN0b3IpOiBQcm9taXNlPFR1cGxlW10+IHtcblxuICAgICAgICByZXR1cm4gdGhpcy5sb2FkVHVwbGVzRW5jb2RlZCh0dXBsZVNlbGVjdG9yKVxuICAgICAgICAgICAgLnRoZW4oKHZvcnRleE1zZzogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKHZvcnRleE1zZyA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBbXTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gUGF5bG9hZC5mcm9tVm9ydGV4TXNnKHZvcnRleE1zZylcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oKHBheWxvYWQ6IFBheWxvYWQpID0+IHBheWxvYWQudHVwbGVzKTtcbiAgICAgICAgICAgIH0pO1xuICAgIH1cblxuICAgIGxvYWRUdXBsZXNFbmNvZGVkKHR1cGxlU2VsZWN0b3I6IFR1cGxlU2VsZWN0b3IpOiBQcm9taXNlPHN0cmluZyB8IG51bGw+IHtcblxuICAgICAgICBsZXQgYmluZFBhcmFtcyA9IFt0dXBsZVNlbGVjdG9yLnRvT3JkZXJlZEpzb25TdHIoKV07XG5cbiAgICAgICAgcmV0dXJuIHRoaXMudHguZXhlY3V0ZVNxbChzZWxlY3RTcWwsIGJpbmRQYXJhbXMpXG4gICAgICAgICAgICAudGhlbigocm93czogYW55W10pID0+IHtcbiAgICAgICAgICAgICAgICBpZiAocm93cy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgbGV0IHJvdzEgPSByb3dzWzBdO1xuICAgICAgICAgICAgICAgIHJldHVybiByb3cxLnBheWxvYWQ7XG4gICAgICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBzYXZlVHVwbGVzKHR1cGxlU2VsZWN0b3I6IFR1cGxlU2VsZWN0b3IsIHR1cGxlczogVHVwbGVbXSk6IFByb21pc2U8dm9pZD4ge1xuXG4gICAgICAgIC8vIFRoZSBwYXlsb2FkIGlzIGEgY29udmVuaWVudCB3YXkgdG8gc2VyaWFsaXNlIGFuZCBjb21wcmVzcyB0aGUgZGF0YVxuICAgICAgICByZXR1cm4gbmV3IFBheWxvYWQoe30sIHR1cGxlcykudG9Wb3J0ZXhNc2coKVxuICAgICAgICAgICAgLnRoZW4oKHZvcnRleE1zZzogc3RyaW5nKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuc2F2ZVR1cGxlc0VuY29kZWQodHVwbGVTZWxlY3Rvciwgdm9ydGV4TXNnKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgfVxuXG5cbiAgICBzYXZlVHVwbGVzRW5jb2RlZCh0dXBsZVNlbGVjdG9yOiBUdXBsZVNlbGVjdG9yLCB2b3J0ZXhNc2c6IHN0cmluZyk6IFByb21pc2U8dm9pZD4ge1xuXG4gICAgICAgIGlmICghdGhpcy50eEZvcldyaXRlKSB7XG4gICAgICAgICAgICBsZXQgbXNnID0gXCJXZWJTUUw6IHNhdmVUdXBsZXMgYXR0ZW1wdGVkIG9uIHJlYWQgb25seSBUWFwiO1xuICAgICAgICAgICAgY29uc29sZS5sb2coYCR7ZGF0ZVN0cigpfSAke21zZ31gKTtcbiAgICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlamVjdChtc2cpXG4gICAgICAgIH1cblxuICAgICAgICAvLyBUaGUgcGF5bG9hZCBpcyBhIGNvbnZlbmllbnQgd2F5IHRvIHNlcmlhbGlzZSBhbmQgY29tcHJlc3MgdGhlIGRhdGFcbiAgICAgICAgbGV0IHR1cGxlU2VsZWN0b3JTdHIgPSB0dXBsZVNlbGVjdG9yLnRvT3JkZXJlZEpzb25TdHIoKTtcbiAgICAgICAgbGV0IGJpbmRQYXJhbXMgPSBbdHVwbGVTZWxlY3RvclN0ciwgRGF0ZS5ub3coKSwgdm9ydGV4TXNnXTtcblxuICAgICAgICByZXR1cm4gdGhpcy50eC5leGVjdXRlU3FsKGluc2VydFNxbCwgYmluZFBhcmFtcylcbiAgICAgICAgICAgIC50aGVuKCgpID0+IG51bGwpOyAvLyBDb252ZXJ0IHRoZSByZXN1bHRcblxuICAgIH1cblxuICAgIGNsb3NlKCk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgfVxuXG5cbn1cbiJdfQ==