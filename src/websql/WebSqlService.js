"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var WebSqlFactoryService = (function () {
    function WebSqlFactoryService() {
    }
    WebSqlFactoryService = __decorate([
        core_1.Injectable()
    ], WebSqlFactoryService);
    return WebSqlFactoryService;
}());
exports.WebSqlFactoryService = WebSqlFactoryService;
var WebSqlService = (function () {
    function WebSqlService(dbName, dbSchema) {
        this.dbName = dbName;
        this.dbSchema = dbSchema;
        this.schemaInstalled = false;
    }
    WebSqlService.prototype.installSchema = function () {
        var _this = this;
        // Open Transaction promise
        return this.transaction()
            .then(function (tx) {
            // Run SQL Promise
            // TODO, Handle more than one SQL statement
            return tx.executeSql(_this.dbSchema[0])
                .then(function (data) {
                _this.schemaInstalled = true;
            });
        });
    };
    WebSqlService.prototype.runSql = function (sql, bindParams) {
        var _this = this;
        if (bindParams === void 0) { bindParams = []; }
        return new Promise(function (resolve, reject) {
            _this.openTransRunSql(sql, bindParams)
                .catch(function (err) {
                reject(err);
                throw new Error(err);
            })
                .then(function (result) {
                // if (typeof result === 'number')
                //     resolve(result);
                // else
                resolve(true);
            });
        });
    };
    WebSqlService.prototype.querySql = function (sql, bindParams) {
        var _this = this;
        if (bindParams === void 0) { bindParams = []; }
        return new Promise(function (resolve, reject) {
            _this.openTransRunSql(sql, bindParams)
                .catch(function (err) {
                reject(err);
                throw new Error(err);
            })
                .then(function (rows) { return resolve(rows); });
        });
    };
    WebSqlService.prototype.openTransRunSql = function (sql, bindParams) {
        var _this = this;
        return this.open()
            .then(function () {
            // Open Transaction promise
            return _this.transaction()
                .then(function (tx) {
                // Run SQL Promise
                return tx.executeSql(sql, bindParams)
                    .then(function (data) { return data; });
            });
        });
    };
    WebSqlService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [String, Array])
    ], WebSqlService);
    return WebSqlService;
}());
exports.WebSqlService = WebSqlService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiV2ViU3FsU2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIldlYlNxbFNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBeUM7QUFJekM7SUFBQTtJQWVBLENBQUM7SUFmcUIsb0JBQW9CO1FBRHpDLGlCQUFVLEVBQUU7T0FDUyxvQkFBb0IsQ0FlekM7SUFBRCwyQkFBQztDQUFBLEFBZkQsSUFlQztBQWZxQixvREFBb0I7QUF1QjFDO0lBS0ksdUJBQXNCLE1BQWMsRUFBWSxRQUFrQjtRQUE1QyxXQUFNLEdBQU4sTUFBTSxDQUFRO1FBQVksYUFBUSxHQUFSLFFBQVEsQ0FBVTtRQUZ4RCxvQkFBZSxHQUFZLEtBQUssQ0FBQztJQUkzQyxDQUFDO0lBRVMscUNBQWEsR0FBdkI7UUFBQSxpQkFZQztRQVhHLDJCQUEyQjtRQUMzQixNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRTthQUNwQixJQUFJLENBQUMsVUFBQyxFQUFxQjtZQUV4QixrQkFBa0I7WUFDbEIsMkNBQTJDO1lBQzNDLE1BQU0sQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLEtBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7aUJBQ2pDLElBQUksQ0FBQyxVQUFDLElBQUk7Z0JBQ1AsS0FBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUM7WUFDaEMsQ0FBQyxDQUFDLENBQUM7UUFDWCxDQUFDLENBQUMsQ0FBQztJQUNYLENBQUM7SUFVRCw4QkFBTSxHQUFOLFVBQU8sR0FBVyxFQUFFLFVBQXNCO1FBQTFDLGlCQWVDO1FBZm1CLDJCQUFBLEVBQUEsZUFBc0I7UUFFdEMsTUFBTSxDQUFDLElBQUksT0FBTyxDQUFVLFVBQUMsT0FBTyxFQUFFLE1BQU07WUFDeEMsS0FBSSxDQUFDLGVBQWUsQ0FBQyxHQUFHLEVBQUUsVUFBVSxDQUFDO2lCQUNoQyxLQUFLLENBQUMsVUFBQyxHQUFHO2dCQUNQLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDWixNQUFNLElBQUksS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ3pCLENBQUMsQ0FBQztpQkFDRCxJQUFJLENBQUMsVUFBQyxNQUFNO2dCQUNULGtDQUFrQztnQkFDbEMsdUJBQXVCO2dCQUN2QixPQUFPO2dCQUNQLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUNsQixDQUFDLENBQUMsQ0FBQztRQUNYLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVELGdDQUFRLEdBQVIsVUFBUyxHQUFXLEVBQUUsVUFBc0I7UUFBNUMsaUJBVUM7UUFWcUIsMkJBQUEsRUFBQSxlQUFzQjtRQUV4QyxNQUFNLENBQUMsSUFBSSxPQUFPLENBQVEsVUFBQyxPQUFPLEVBQUUsTUFBTTtZQUN0QyxLQUFJLENBQUMsZUFBZSxDQUFDLEdBQUcsRUFBRSxVQUFVLENBQUM7aUJBQ2hDLEtBQUssQ0FBQyxVQUFDLEdBQUc7Z0JBQ1AsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDO2dCQUNaLE1BQU0sSUFBSSxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDekIsQ0FBQyxDQUFDO2lCQUNELElBQUksQ0FBQyxVQUFDLElBQVcsSUFBSyxPQUFBLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBYixDQUFhLENBQUMsQ0FBQztRQUM5QyxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFHTyx1Q0FBZSxHQUF2QixVQUF3QixHQUFXLEVBQUUsVUFBaUI7UUFBdEQsaUJBYUM7UUFaRyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRTthQUNiLElBQUksQ0FBQztZQUVGLDJCQUEyQjtZQUMzQixNQUFNLENBQUMsS0FBSSxDQUFDLFdBQVcsRUFBRTtpQkFDcEIsSUFBSSxDQUFDLFVBQUMsRUFBcUI7Z0JBRXhCLGtCQUFrQjtnQkFDbEIsTUFBTSxDQUFDLEVBQUUsQ0FBQyxVQUFVLENBQUMsR0FBRyxFQUFFLFVBQVUsQ0FBQztxQkFDaEMsSUFBSSxDQUFDLFVBQUMsSUFBSSxJQUFLLE9BQWMsSUFBSSxFQUFsQixDQUFrQixDQUFDLENBQUM7WUFDNUMsQ0FBQyxDQUFDLENBQUM7UUFDWCxDQUFDLENBQUMsQ0FBQztJQUNYLENBQUM7SUExRWlCLGFBQWE7UUFEbEMsaUJBQVUsRUFBRTs7T0FDUyxhQUFhLENBNEVsQztJQUFELG9CQUFDO0NBQUEsQUE1RUQsSUE0RUM7QUE1RXFCLHNDQUFhIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtJbmplY3RhYmxlfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xuXG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBXZWJTcWxGYWN0b3J5U2VydmljZSB7XG5cbiAgICAvKiogSGFzIFN0b3JhZ2UgTGltaXRhdGlvbnNcbiAgICAgKlxuICAgICAqIFJldHVybnMgdHJ1ZSBpZiB0aGlzIFNRTCBzdG9yYWdlIGhhcyBhIHNtYWxsIGxpbWl0YXRpb24gb24gc3RvcmFnZS5cbiAgICAgKlxuICAgICAqIFRoaXMgd2FzIGltcGxlbWVudGVkIHRvIHJldHVybiB0cnVlIG9uIGlPUyBtb2JpbGUgZGV2aWNlcywgYXMgdGhleSBoYXZlIGFcbiAgICAgKiA1MG1iIHN0b3JhZ2UgbGltaXQuXG4gICAgICpcbiAgICAgKi9cbiAgICBhYnN0cmFjdCBoYXNTdG9yYWdlTGltaXRhdGlvbnMoKTogYm9vbGVhbjtcblxuICAgIGFic3RyYWN0IHN1cHBvcnRzV2ViU3FsKCk6IGJvb2xlYW47XG5cbiAgICBhYnN0cmFjdCBjcmVhdGVXZWJTcWwoZGJOYW1lOiBzdHJpbmcsIGRiU2NoZW1hOiBzdHJpbmdbXSk6IFdlYlNxbFNlcnZpY2U7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgV2ViU3FsVHJhbnNhY3Rpb24ge1xuICAgIGV4ZWN1dGVTcWwoc3FsOiBzdHJpbmcsIGJpbmRQYXJhbXM/OiBhbnlbXSB8IG51bGwpOiBQcm9taXNlPG51bGwgfCBhbnlbXT47XG59XG5cblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIFdlYlNxbFNlcnZpY2Uge1xuXG4gICAgcHJvdGVjdGVkIGRiOiBhbnk7XG4gICAgcHJvdGVjdGVkIHNjaGVtYUluc3RhbGxlZDogYm9vbGVhbiA9IGZhbHNlO1xuXG4gICAgY29uc3RydWN0b3IocHJvdGVjdGVkIGRiTmFtZTogc3RyaW5nLCBwcm90ZWN0ZWQgZGJTY2hlbWE6IHN0cmluZ1tdKSB7XG5cbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgaW5zdGFsbFNjaGVtYSgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgLy8gT3BlbiBUcmFuc2FjdGlvbiBwcm9taXNlXG4gICAgICAgIHJldHVybiB0aGlzLnRyYW5zYWN0aW9uKClcbiAgICAgICAgICAgIC50aGVuKCh0eDogV2ViU3FsVHJhbnNhY3Rpb24pID0+IHtcblxuICAgICAgICAgICAgICAgIC8vIFJ1biBTUUwgUHJvbWlzZVxuICAgICAgICAgICAgICAgIC8vIFRPRE8sIEhhbmRsZSBtb3JlIHRoYW4gb25lIFNRTCBzdGF0ZW1lbnRcbiAgICAgICAgICAgICAgICByZXR1cm4gdHguZXhlY3V0ZVNxbCh0aGlzLmRiU2NoZW1hWzBdKVxuICAgICAgICAgICAgICAgICAgICAudGhlbigoZGF0YSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5zY2hlbWFJbnN0YWxsZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgIH1cblxuICAgIGFic3RyYWN0IG9wZW4oKTogUHJvbWlzZTx2b2lkPjtcblxuICAgIGFic3RyYWN0IGlzT3BlbigpOiBib29sZWFuO1xuXG4gICAgYWJzdHJhY3QgY2xvc2UoKTogdm9pZDtcblxuICAgIGFic3RyYWN0IHRyYW5zYWN0aW9uKCk6IFByb21pc2U8V2ViU3FsVHJhbnNhY3Rpb24+O1xuXG4gICAgcnVuU3FsKHNxbDogc3RyaW5nLCBiaW5kUGFyYW1zOiBhbnlbXSA9IFtdKTogUHJvbWlzZTxib29sZWFuPiB7XG5cbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlPGJvb2xlYW4+KChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIHRoaXMub3BlblRyYW5zUnVuU3FsKHNxbCwgYmluZFBhcmFtcylcbiAgICAgICAgICAgICAgICAuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGVycik7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAudGhlbigocmVzdWx0KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIC8vIGlmICh0eXBlb2YgcmVzdWx0ID09PSAnbnVtYmVyJylcbiAgICAgICAgICAgICAgICAgICAgLy8gICAgIHJlc29sdmUocmVzdWx0KTtcbiAgICAgICAgICAgICAgICAgICAgLy8gZWxzZVxuICAgICAgICAgICAgICAgICAgICByZXNvbHZlKHRydWUpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBxdWVyeVNxbChzcWw6IHN0cmluZywgYmluZFBhcmFtczogYW55W10gPSBbXSk6IFByb21pc2U8YW55W10+IHtcblxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2U8YW55W10+KChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIHRoaXMub3BlblRyYW5zUnVuU3FsKHNxbCwgYmluZFBhcmFtcylcbiAgICAgICAgICAgICAgICAuY2F0Y2goKGVycikgPT4ge1xuICAgICAgICAgICAgICAgICAgICByZWplY3QoZXJyKTtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGVycik7XG4gICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAudGhlbigocm93czogYW55W10pID0+IHJlc29sdmUocm93cykpO1xuICAgICAgICB9KTtcbiAgICB9XG5cblxuICAgIHByaXZhdGUgb3BlblRyYW5zUnVuU3FsKHNxbDogc3RyaW5nLCBiaW5kUGFyYW1zOiBhbnlbXSk6IFByb21pc2U8bnVsbCB8IGFueVtdPiB7XG4gICAgICAgIHJldHVybiB0aGlzLm9wZW4oKVxuICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuXG4gICAgICAgICAgICAgICAgLy8gT3BlbiBUcmFuc2FjdGlvbiBwcm9taXNlXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMudHJhbnNhY3Rpb24oKVxuICAgICAgICAgICAgICAgICAgICAudGhlbigodHg6IFdlYlNxbFRyYW5zYWN0aW9uKSA9PiB7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFJ1biBTUUwgUHJvbWlzZVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHR4LmV4ZWN1dGVTcWwoc3FsLCBiaW5kUGFyYW1zKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC50aGVuKChkYXRhKSA9PiA8bnVsbCB8IGFueVtdPmRhdGEpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgIH1cblxufSJdfQ==