"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var WebSqlService_1 = require("./WebSqlService");
var WebSqlBrowserFactoryService = (function () {
    function WebSqlBrowserFactoryService() {
    }
    WebSqlBrowserFactoryService.prototype.hasStorageLimitations = function () {
        // iOS safari supports up to a 50mb limit, MAX.
        // In this case, IndexedDB should be used.
        // https://stackoverflow.com/questions/9038625/detect-if-device-is-ios
        var iOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window["MSStream"];
        // Other conditions
        return iOS;
    };
    WebSqlBrowserFactoryService.prototype.supportsWebSql = function () {
        return openDatabase != null;
    };
    WebSqlBrowserFactoryService.prototype.createWebSql = function (dbName, dbSchema) {
        return new WebSqlBrowserAdaptorService(dbName, dbSchema);
    };
    WebSqlBrowserFactoryService = __decorate([
        core_1.Injectable()
    ], WebSqlBrowserFactoryService);
    return WebSqlBrowserFactoryService;
}());
exports.WebSqlBrowserFactoryService = WebSqlBrowserFactoryService;
var WDBException = (function () {
    function WDBException(message) {
        this.message = message;
    }
    WDBException.prototype.toString = function () {
        return 'WDBException: ' + this.message;
    };
    return WDBException;
}());
exports.WDBException = WDBException;
var WebSqlBrowserAdaptorService = (function (_super) {
    __extends(WebSqlBrowserAdaptorService, _super);
    function WebSqlBrowserAdaptorService(dbName, dbSchema) {
        var _this = _super.call(this, dbName, dbSchema) || this;
        _this.dbName = dbName;
        _this.dbSchema = dbSchema;
        return _this;
    }
    WebSqlBrowserAdaptorService.prototype.open = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (_this.isOpen()) {
                resolve();
                return;
            }
            _this.db = openDatabase(_this.dbName, "1", _this.dbName, 4 * 1024 * 1024);
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
    };
    WebSqlBrowserAdaptorService.prototype.isOpen = function () {
        return this.db != null;
    };
    WebSqlBrowserAdaptorService.prototype.close = function () {
        this.db = null;
    };
    WebSqlBrowserAdaptorService.prototype.transaction = function () {
        var _this = this;
        if (!this.isOpen())
            throw new Error("SQLDatabase " + this.dbName + " is not open");
        return new Promise(function (resolve, reject) {
            _this.db.transaction(function (t) {
                resolve(new WebSqlBrowserTransactionAdaptor(t));
            }, function (tx, err) {
                reject(err == null ? tx : err);
            });
        });
    };
    WebSqlBrowserAdaptorService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [String, Array])
    ], WebSqlBrowserAdaptorService);
    return WebSqlBrowserAdaptorService;
}(WebSqlService_1.WebSqlService));
var WebSqlBrowserTransactionAdaptor = (function () {
    function WebSqlBrowserTransactionAdaptor(websqlTransaction) {
        this.websqlTransaction = websqlTransaction;
    }
    WebSqlBrowserTransactionAdaptor.prototype.executeSql = function (sql, bindParams) {
        var _this = this;
        if (bindParams === void 0) { bindParams = []; }
        return new Promise(function (resolve, reject) {
            _this.retryExecuteSql(5, sql, bindParams, resolve, reject);
        });
    };
    WebSqlBrowserTransactionAdaptor.prototype.retryExecuteSql = function (retries, sql, bindParams, resolve, reject) {
        var _this = this;
        this.websqlTransaction.executeSql(sql, bindParams, function (transaction, results) {
            /*
             * results:(SQLResultSet) {
             *      insertId:0,
             *      rows:(SQLResultSetRowList){
             *          length:0
             *      },
             *      rowsAffected:0
             *  }
             */
            // ALL GOOD, Return the rows
            var rowArray = [];
            for (var i = 0; i < results.rows.length; ++i) {
                rowArray.push(results.rows.item(i));
            }
            resolve(rowArray);
        }, function (tx, err) {
            err = err == null ? tx : err; // Sometimes tx is the err
            // Bug in Safari (at least), when the user approves the storage space
            // The WebSQL still gets the exception
            // "there was not enough remaining storage space, or the storage quota was reached and the user declined to allow more space"
            var noSpaceMsg = "there was not enough remaining storage space";
            if (retries >= 0 && err.message.indexOf(noSpaceMsg) !== -1) {
                _this.retryExecuteSql(retries - 1, sql, bindParams, resolve, reject);
                return;
            }
            // Otherwise, REJECT
            reject(err);
        });
    };
    return WebSqlBrowserTransactionAdaptor;
}());
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiV2ViU3FsQnJvd3NlckFkYXB0b3JTZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiV2ViU3FsQnJvd3NlckFkYXB0b3JTZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsc0NBQXlDO0FBQ3pDLGlEQUF1RjtBQUl2RjtJQUFBO0lBa0JBLENBQUM7SUFoQkcsMkRBQXFCLEdBQXJCO1FBQ0ksK0NBQStDO1FBQy9DLDBDQUEwQztRQUMxQyxzRUFBc0U7UUFDdEUsSUFBSSxHQUFHLEdBQUcsa0JBQWtCLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUM5RSxtQkFBbUI7UUFDbkIsTUFBTSxDQUFDLEdBQUcsQ0FBQztJQUNmLENBQUM7SUFFRCxvREFBYyxHQUFkO1FBQ0ksTUFBTSxDQUFDLFlBQVksSUFBSSxJQUFJLENBQUM7SUFDaEMsQ0FBQztJQUVELGtEQUFZLEdBQVosVUFBYSxNQUFjLEVBQUUsUUFBa0I7UUFDM0MsTUFBTSxDQUFDLElBQUksMkJBQTJCLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQyxDQUFDO0lBQzdELENBQUM7SUFqQlEsMkJBQTJCO1FBRHZDLGlCQUFVLEVBQUU7T0FDQSwyQkFBMkIsQ0FrQnZDO0lBQUQsa0NBQUM7Q0FBQSxBQWxCRCxJQWtCQztBQWxCWSxrRUFBMkI7QUFvQnhDO0lBQ0ksc0JBQW1CLE9BQWU7UUFBZixZQUFPLEdBQVAsT0FBTyxDQUFRO0lBQ2xDLENBQUM7SUFFRCwrQkFBUSxHQUFSO1FBQ0ksTUFBTSxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7SUFDM0MsQ0FBQztJQUNMLG1CQUFDO0FBQUQsQ0FBQyxBQVBELElBT0M7QUFQWSxvQ0FBWTtBQVV6QjtJQUEwQywrQ0FBYTtJQUVuRCxxQ0FBc0IsTUFBYyxFQUFZLFFBQWtCO1FBQWxFLFlBQ0ksa0JBQU0sTUFBTSxFQUFFLFFB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LFVBQVUsRUFDN0MsVUFBQyxXQUFXLEVBQUUsT0FBTztZQUNqQjs7Ozs7Ozs7ZUFRRztZQUNILDRCQUE0QjtZQUM1QixJQUFJLFFBQVEsR0FBRyxFQUFFLENBQUM7WUFDbEIsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDO2dCQUMzQyxRQUFRLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDeEMsQ0FBQztZQUVELE9BQU8sQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUV0QixDQUFDLEVBQUUsVUFBQyxFQUFFLEVBQUUsR0FBRztZQUNQLEdBQUcsR0FBRyxHQUFHLElBQUksSUFBSSxHQUFHLEVBQUUsR0FBRyxHQUFHLENBQUMsQ0FBQywwQkFBMEI7WUFFeEQscUVBQXFFO1lBQ3JFLHNDQUFzQztZQUN0Qyw2SEFBNkg7WUFDN0gsSUFBSSxVQUFVLEdBQUcsOENBQThDLENBQUM7WUFDaEUsRUFBRSxDQUFDLENBQUMsT0FBTyxJQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3pELEtBQUksQ0FBQyxlQUFlLENBQUMsT0FBTyxHQUFHLENBQUMsRUFBRSxHQUFHLEVBQUUsVUFBVSxFQUFFLE9BQU8sRUFBRSxNQUFNLENBQUMsQ0FBQztnQkFDcEUsTUFBTSxDQUFDO1lBQ1gsQ0FBQztZQUVELG9CQUFvQjtZQUNwQixNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7UUFFaEIsQ0FBQyxDQUNKLENBQUM7SUFFTixDQUFDO0lBRUwsc0NBQUM7QUFBRCxDQUFDLEFBckRELElBcURDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtJbmplY3RhYmxlfSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xuaW1wb3J0IHtXZWJTcWxGYWN0b3J5U2VydmljZSwgV2ViU3FsU2VydmljZSwgV2ViU3FsVHJhbnNhY3Rpb259IGZyb20gXCIuL1dlYlNxbFNlcnZpY2VcIjtcbmRlY2xhcmUgbGV0IG9wZW5EYXRhYmFzZTogYW55O1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgV2ViU3FsQnJvd3NlckZhY3RvcnlTZXJ2aWNlIGltcGxlbWVudHMgV2ViU3FsRmFjdG9yeVNlcnZpY2Uge1xuXG4gICAgaGFzU3RvcmFnZUxpbWl0YXRpb25zKCk6IGJvb2xlYW4ge1xuICAgICAgICAvLyBpT1Mgc2FmYXJpIHN1cHBvcnRzIHVwIHRvIGEgNTBtYiBsaW1pdCwgTUFYLlxuICAgICAgICAvLyBJbiB0aGlzIGNhc2UsIEluZGV4ZWREQiBzaG91bGQgYmUgdXNlZC5cbiAgICAgICAgLy8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvOTAzODYyNS9kZXRlY3QtaWYtZGV2aWNlLWlzLWlvc1xuICAgICAgICBsZXQgaU9TID0gL2lQYWR8aVBob25lfGlQb2QvLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCkgJiYgIXdpbmRvd1tcIk1TU3RyZWFtXCJdO1xuICAgICAgICAvLyBPdGhlciBjb25kaXRpb25zXG4gICAgICAgIHJldHVybiBpT1M7XG4gICAgfVxuXG4gICAgc3VwcG9ydHNXZWJTcWwoKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiBvcGVuRGF0YWJhc2UgIT0gbnVsbDtcbiAgICB9XG5cbiAgICBjcmVhdGVXZWJTcWwoZGJOYW1lOiBzdHJpbmcsIGRiU2NoZW1hOiBzdHJpbmdbXSk6IFdlYlNxbFNlcnZpY2Uge1xuICAgICAgICByZXR1cm4gbmV3IFdlYlNxbEJyb3dzZXJBZGFwdG9yU2VydmljZShkYk5hbWUsIGRiU2NoZW1hKTtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBXREJFeGNlcHRpb24ge1xuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBtZXNzYWdlOiBzdHJpbmcpIHtcbiAgICB9XG5cbiAgICB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgICByZXR1cm4gJ1dEQkV4Y2VwdGlvbjogJyArIHRoaXMubWVzc2FnZTtcbiAgICB9XG59XG5cbkBJbmplY3RhYmxlKClcbmNsYXNzIFdlYlNxbEJyb3dzZXJBZGFwdG9yU2VydmljZSBleHRlbmRzIFdlYlNxbFNlcnZpY2Uge1xuXG4gICAgY29uc3RydWN0b3IocHJvdGVjdGVkIGRiTmFtZTogc3RyaW5nLCBwcm90ZWN0ZWQgZGJTY2hlbWE6IHN0cmluZ1tdKSB7XG4gICAgICAgIHN1cGVyKGRiTmFtZSwgZGJTY2hlbWEpO1xuICAgIH1cblxuICAgIG9wZW4oKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZTx2b2lkPigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgICBpZiAodGhpcy5pc09wZW4oKSkge1xuICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuZGIgPSBvcGVuRGF0YWJhc2UodGhpcy5kYk5hbWUsIFwiMVwiLCB0aGlzLmRiTmFtZSwgNCAqIDEwMjQgKiAxMDI0KTtcbiAgICAgICAgICAgIGlmICh0aGlzLnNjaGVtYUluc3RhbGxlZCkge1xuICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuaW5zdGFsbFNjaGVtYSgpXG4gICAgICAgICAgICAgICAgLmNhdGNoKChlcnIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgcmVqZWN0KGVycik7XG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihlcnIpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgLnRoZW4oKCkgPT4gcmVzb2x2ZSgpKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgaXNPcGVuKCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5kYiAhPSBudWxsO1xuICAgIH1cblxuICAgIGNsb3NlKCk6IHZvaWQge1xuICAgICAgICB0aGlzLmRiID0gbnVsbDtcbiAgICB9XG5cbiAgICB0cmFuc2FjdGlvbigpOiBQcm9taXNlPFdlYlNxbFRyYW5zYWN0aW9uPiB7XG4gICAgICAgIGlmICghdGhpcy5pc09wZW4oKSlcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgU1FMRGF0YWJhc2UgJHt0aGlzLmRiTmFtZX0gaXMgbm90IG9wZW5gKTtcblxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2U8V2ViU3FsVHJhbnNhY3Rpb24+KChyZXNvbHZlLCByZWplY3QpID0+IHtcbiAgICAgICAgICAgIHRoaXMuZGIudHJhbnNhY3Rpb24oKHQpID0+IHtcbiAgICAgICAgICAgICAgICByZXNvbHZlKG5ldyBXZWJTcWxCcm93c2VyVHJhbnNhY3Rpb25BZGFwdG9yKHQpKTtcbiAgICAgICAgICAgIH0sICh0eCwgZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgcmVqZWN0KGVyciA9PSBudWxsID8gdHggOiBlcnIpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0pO1xuICAgIH1cbn1cblxuY2xhc3MgV2ViU3FsQnJvd3NlclRyYW5zYWN0aW9uQWRhcHRvciBpbXBsZW1lbnRzIFdlYlNxbFRyYW5zYWN0aW9uIHtcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHdlYnNxbFRyYW5zYWN0aW9uOiBhbnkpIHtcblxuICAgIH1cblxuICAgIGV4ZWN1dGVTcWwoc3FsOiBzdHJpbmcsIGJpbmRQYXJhbXM6IGFueVtdIHwgbnVsbCA9IFtdKTogUHJvbWlzZTxudWxsIHwgYW55W10+IHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9taXNlPG51bGwgfCBhbnlbXT4oKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgICAgICAgdGhpcy5yZXRyeUV4ZWN1dGVTcWwoNSwgc3FsLCBiaW5kUGFyYW1zLCByZXNvbHZlLCByZWplY3QpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHJldHJ5RXhlY3V0ZVNxbChyZXRyaWVzOiBudW1iZXIsIHNxbDogc3RyaW5nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJpbmRQYXJhbXM6IGFueVtdIHwgbnVsbCwgcmVzb2x2ZTogYW55LCByZWplY3Q6IGFueSkge1xuXG4gICAgICAgIHRoaXMud2Vic3FsVHJhbnNhY3Rpb24uZXhlY3V0ZVNxbChzcWwsIGJpbmRQYXJhbXMsXG4gICAgICAgICAgICAodHJhbnNhY3Rpb24sIHJlc3VsdHMpID0+IHtcbiAgICAgICAgICAgICAgICAvKlxuICAgICAgICAgICAgICAgICAqIHJlc3VsdHM6KFNRTFJlc3VsdFNldCkge1xuICAgICAgICAgICAgICAgICAqICAgICAgaW5zZXJ0SWQ6MCxcbiAgICAgICAgICAgICAgICAgKiAgICAgIHJvd3M6KFNRTFJlc3VsdFNldFJvd0xpc3Qpe1xuICAgICAgICAgICAgICAgICAqICAgICAgICAgIGxlbmd0aDowXG4gICAgICAgICAgICAgICAgICogICAgICB9LFxuICAgICAgICAgICAgICAgICAqICAgICAgcm93c0FmZmVjdGVkOjBcbiAgICAgICAgICAgICAgICAgKiAgfVxuICAgICAgICAgICAgICAgICAqL1xuICAgICAgICAgICAgICAgIC8vIEFMTCBHT09ELCBSZXR1cm4gdGhlIHJvd3NcbiAgICAgICAgICAgICAgICBsZXQgcm93QXJyYXkgPSBbXTtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJlc3VsdHMucm93cy5sZW5ndGg7ICsraSkge1xuICAgICAgICAgICAgICAgICAgICByb3dBcnJheS5wdXNoKHJlc3VsdHMucm93cy5pdGVtKGkpKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXNvbHZlKHJvd0FycmF5KTtcblxuICAgICAgICAgICAgfSwgKHR4LCBlcnIpID0+IHtcbiAgICAgICAgICAgICAgICBlcnIgPSBlcnIgPT0gbnVsbCA/IHR4IDogZXJyOyAvLyBTb21ldGltZXMgdHggaXMgdGhlIGVyclxuXG4gICAgICAgICAgICAgICAgLy8gQnVnIGluIFNhZmFyaSAoYXQgbGVhc3QpLCB3aGVuIHRoZSB1c2VyIGFwcHJvdmVzIHRoZSBzdG9yYWdlIHNwYWNlXG4gICAgICAgICAgICAgICAgLy8gVGhlIFdlYlNRTCBzdGlsbCBnZXRzIHRoZSBleGNlcHRpb25cbiAgICAgICAgICAgICAgICAvLyBcInRoZXJlIHdhcyBub3QgZW5vdWdoIHJlbWFpbmluZyBzdG9yYWdlIHNwYWNlLCBvciB0aGUgc3RvcmFnZSBxdW90YSB3YXMgcmVhY2hlZCBhbmQgdGhlIHVzZXIgZGVjbGluZWQgdG8gYWxsb3cgbW9yZSBzcGFjZVwiXG4gICAgICAgICAgICAgICAgbGV0IG5vU3BhY2VNc2cgPSBcInRoZXJlIHdhcyBub3QgZW5vdWdoIHJlbWFpbmluZyBzdG9yYWdlIHNwYWNlXCI7XG4gICAgICAgICAgICAgICAgaWYgKHJldHJpZXMgPj0gMCAmJiBlcnIubWVzc2FnZS5pbmRleE9mKG5vU3BhY2VNc2cpICE9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLnJldHJ5RXhlY3V0ZVNxbChyZXRyaWVzIC0gMSwgc3FsLCBiaW5kUGFyYW1zLCByZXNvbHZlLCByZWplY3QpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy8gT3RoZXJ3aXNlLCBSRUpFQ1RcbiAgICAgICAgICAgICAgICByZWplY3QoZXJyKTtcblxuICAgICAgICAgICAgfVxuICAgICAgICApO1xuXG4gICAgfVxuXG59XG4iXX0=