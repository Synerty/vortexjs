"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var WebSqlService_1 = require("./WebSqlService");
var NsSqlite = require("nativescript-sqlite");
var WebSqlNativeScriptFactoryService = (function () {
    function WebSqlNativeScriptFactoryService() {
    }
    WebSqlNativeScriptFactoryService.prototype.hasStorageLimitations = function () {
        return false; // NOPE :-)
    };
    WebSqlNativeScriptFactoryService.prototype.supportsWebSql = function () {
        return true; // Yes :-)
    };
    WebSqlNativeScriptFactoryService.prototype.createWebSql = function (dbName, dbSchema) {
        return new WebSqlNativeScriptAdaptorService(dbName, dbSchema);
    };
    WebSqlNativeScriptFactoryService = __decorate([
        core_1.Injectable()
    ], WebSqlNativeScriptFactoryService);
    return WebSqlNativeScriptFactoryService;
}());
exports.WebSqlNativeScriptFactoryService = WebSqlNativeScriptFactoryService;
var WebSqlNativeScriptAdaptorService = (function (_super) {
    __extends(WebSqlNativeScriptAdaptorService, _super);
    function WebSqlNativeScriptAdaptorService(dbName, dbSchema) {
        var _this = _super.call(this, dbName, dbSchema) || this;
        _this.dbName = dbName;
        _this.dbSchema = dbSchema;
        return _this;
    }
    WebSqlNativeScriptAdaptorService.prototype.open = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (_this.isOpen()) {
                resolve();
                return;
            }
            var dbPromise = new NsSqlite(_this.dbName);
            dbPromise.then(function (db) {
                _this.db = db;
                if (!NsSqlite.isSqlite(db)) {
                    reject("The thing we opened isn't a DB");
                    return;
                }
                _this.db.resultType(NsSqlite.RESULTSASOBJECT);
                _this.db.version("1"); // MATCHES Browser Adaptor
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
            });
            dbPromise.catch(function (err) {
                reject(err);
                throw new Error(err);
            });
        });
    };
    WebSqlNativeScriptAdaptorService.prototype.isOpen = function () {
        return this.db !== null && NsSqlite.isSqlite(this.db) && this.db.isOpen();
    };
    WebSqlNativeScriptAdaptorService.prototype.close = function () {
        this.db.close();
        this.db = null;
    };
    WebSqlNativeScriptAdaptorService.prototype.transaction = function () {
        var _this = this;
        // NOT THE COMMERCIAL VERSION, NO TRANSACTION SUPPORT IS AVAILABLE
        if (!this.isOpen())
            throw new Error("SQLDatabase " + this.dbName + " is not open");
        return new Promise(function (resolve, reject) {
            resolve(new WebSqlNativeScriptTransactionAdaptor(_this.db));
        });
    };
    WebSqlNativeScriptAdaptorService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [String, Array])
    ], WebSqlNativeScriptAdaptorService);
    return WebSqlNativeScriptAdaptorService;
}(WebSqlService_1.WebSqlService));
var WebSqlNativeScriptTransactionAdaptor = (function () {
    function WebSqlNativeScriptTransactionAdaptor(db) {
        this.db = db;
    }
    WebSqlNativeScriptTransactionAdaptor.prototype.executeSql = function (sql, bindParams) {
        if (bindParams === void 0) { bindParams = []; }
        return this.db.all(sql, bindParams);
    };
    return WebSqlNativeScriptTransactionAdaptor;
}());
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiV2ViU3FsTmF0aXZlU2NyaXB0QWRhcHRvclNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJXZWJTcWxOYXRpdmVTY3JpcHRBZGFwdG9yU2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHNDQUF5QztBQUV6QyxpREFBdUY7QUFDdkYsSUFBSSxRQUFRLEdBQUcsT0FBTyxDQUFDLHFCQUFxQixDQUFDLENBQUM7QUFHOUM7SUFBQTtJQWFBLENBQUM7SUFYRyxnRUFBcUIsR0FBckI7UUFDSSxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsV0FBVztJQUM3QixDQUFDO0lBRUQseURBQWMsR0FBZDtRQUNJLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxVQUFVO0lBQzNCLENBQUM7SUFFRCx1REFBWSxHQUFaLFVBQWEsTUFBYyxFQUFFLFFBQWtCO1FBQzNDLE1BQU0sQ0FBQyxJQUFJLGdDQUFnQyxDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsQ0FBQztJQUNsRSxDQUFDO0lBWlEsZ0NBQWdDO1FBRDVDLGlCQUFVLEVBQUU7T0FDQSxnQ0FBZ0MsQ0FhNUM7SUFBRCx1Q0FBQztDQUFBLEFBYkQsSUFhQztBQWJZLDRFQUFnQztBQWdCN0M7SUFBK0Msb0RBQWE7SUFFeEQsMENBQXNCLE1BQWMsRUFBWSxRQUFrQjtRQUFsRSxZQUNJLGtCQUFNLE1BQU0sRUFBRSxRQUFRLENBQUMsU0FDMUI7UUFGcUIsWUFBTSxHQUFOLE1BQU0sQ0FBUTtRQUFZLGNBQVEsR0FBUixRQUFRLENBQVU7O0lBRWxFLENBQUM7SUFFRCwrQ0FBSSxHQUFKO1FBQUEsaUJBaUNDO1FBaENHLE1BQU0sQ0FBQyxJQUFJLE9BQU8sQ0FBTyxVQUFDLE9BQU8sRUFBRSxNQUFNO1lBQ3JDLEVBQUUsQ0FBQyxDQUFDLEtBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLENBQUM7Z0JBQ2hCLE9BQU8sRUFBRSxDQUFDO2dCQUNWLE1BQU0sQ0FBQztZQUNYLENBQUM7WUFF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XCI7XG5cbmltcG9ydCB7V2ViU3FsRmFjdG9yeVNlcnZpY2UsIFdlYlNxbFNlcnZpY2UsIFdlYlNxbFRyYW5zYWN0aW9ufSBmcm9tIFwiLi9XZWJTcWxTZXJ2aWNlXCI7XG5sZXQgTnNTcWxpdGUgPSByZXF1aXJlKFwibmF0aXZlc2NyaXB0LXNxbGl0ZVwiKTtcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIFdlYlNxbE5hdGl2ZVNjcmlwdEZhY3RvcnlTZXJ2aWNlIGltcGxlbWVudHMgV2ViU3FsRmFjdG9yeVNlcnZpY2Uge1xuXG4gICAgaGFzU3RvcmFnZUxpbWl0YXRpb25zKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gZmFsc2U7IC8vIE5PUEUgOi0pXG4gICAgfVxuXG4gICAgc3VwcG9ydHNXZWJTcWwoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0cnVlOyAvLyBZZXMgOi0pXG4gICAgfVxuXG4gICAgY3JlYXRlV2ViU3FsKGRiTmFtZTogc3RyaW5nLCBkYlNjaGVtYTogc3RyaW5nW10pOiBXZWJTcWxTZXJ2aWNlIHtcbiAgICAgICAgcmV0dXJuIG5ldyBXZWJTcWxOYXRpdmVTY3JpcHRBZGFwdG9yU2VydmljZShkYk5hbWUsIGRiU2NoZW1hKTtcbiAgICB9XG59XG5cbkBJbmplY3RhYmxlKClcbmNsYXNzIFdlYlNxbE5hdGl2ZVNjcmlwdEFkYXB0b3JTZXJ2aWNlIGV4dGVuZHMgV2ViU3FsU2VydmljZSB7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgZGJOYW1lOiBzdHJpbmcsIHByb3RlY3RlZCBkYlNjaGVtYTogc3RyaW5nW10pIHtcbiAgICAgICAgc3VwZXIoZGJOYW1lLCBkYlNjaGVtYSk7XG4gICAgfVxuXG4gICAgb3BlbigpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlPHZvaWQ+KChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIGlmICh0aGlzLmlzT3BlbigpKSB7XG4gICAgICAgICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGV0IGRiUHJvbWlzZSA9IG5ldyBOc1NxbGl0ZSh0aGlzLmRiTmFtZSk7XG4gICAgICAgICAgICBkYlByb21pc2UudGhlbigoZGIpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmRiID0gZGI7XG4gICAgICAgICAgICAgICAgaWYgKCFOc1NxbGl0ZS5pc1NxbGl0ZShkYikpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KFwiVGhlIHRoaW5nIHdlIG9wZW5lZCBpc24ndCBhIERCXCIpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuZGIucmVzdWx0VHlwZShOc1NxbGl0ZS5SRVNVTFRTQVNPQkpFQ1QpO1xuICAgICAgICAgICAgICAgIHRoaXMuZGIudmVyc2lvbihcIjFcIik7IC8vIE1BVENIRVMgQnJvd3NlciBBZGFwdG9yXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuc2NoZW1hSW5zdGFsbGVkKSB7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHRoaXMuaW5zdGFsbFNjaGVtYSgpXG4gICAgICAgICAgICAgICAgICAgIC5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihlcnIpO1xuICAgICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgICAgICAudGhlbigoKSA9PiByZXNvbHZlKCkpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBkYlByb21pc2UuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICAgICAgICAgIHJlamVjdChlcnIpO1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihlcnIpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIGlzT3BlbigpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGIgIT09IG51bGwgJiYgTnNTcWxpdGUuaXNTcWxpdGUodGhpcy5kYikgJiYgdGhpcy5kYi5pc09wZW4oKTtcbiAgICB9XG5cbiAgICBjbG9zZSgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5kYi5jbG9zZSgpO1xuICAgICAgICB0aGlzLmRiID0gbnVsbDtcbiAgICB9XG5cbiAgICB0cmFuc2FjdGlvbigpOiBQcm9taXNlPFdlYlNxbFRyYW5zYWN0aW9uPiB7XG4gICAgICAgIC8vIE5PVCBUSEUgQ09NTUVSQ0lBTCBWRVJTSU9OLCBOTyBUUkFOU0FDVElPTiBTVVBQT1JUIElTIEFWQUlMQUJMRVxuICAgICAgICBpZiAoIXRoaXMuaXNPcGVuKCkpXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFNRTERhdGFiYXNlICR7dGhpcy5kYk5hbWV9IGlzIG5vdCBvcGVuYCk7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlPFdlYlNxbFRyYW5zYWN0aW9uPigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICByZXNvbHZlKG5ldyBXZWJTcWxOYXRpdmVTY3JpcHRUcmFuc2FjdGlvbkFkYXB0b3IodGhpcy5kYikpO1xuICAgICAgICB9KTtcbiAgICB9XG59XG5cbmNsYXNzIFdlYlNxbE5hdGl2ZVNjcmlwdFRyYW5zYWN0aW9uQWRhcHRvciBpbXBsZW1lbnRzIFdlYlNxbFRyYW5zYWN0aW9uIHtcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGRiOiBhbnkpIHtcblxuICAgIH1cblxuICAgIGV4ZWN1dGVTcWwoc3FsOiBzdHJpbmcsIGJpbmRQYXJhbXM6IGFueVtdIHwgbnVsbCA9IFtdKTogUHJvbWlzZTxudWxsIHwgYW55W10+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGIuYWxsKHNxbCwgYmluZFBhcmFtcyk7XG4gICAgfVxuXG5cbn1cbiJdfQ==