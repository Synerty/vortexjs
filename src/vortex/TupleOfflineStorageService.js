"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var TupleStorageFactoryService_1 = require("./storage-factory/TupleStorageFactoryService");
var TupleOfflineStorageNameService_1 = require("./TupleOfflineStorageNameService");
var TupleOfflineStorageService = (function () {
    function TupleOfflineStorageService(storageFactory, tupleOfflineStorageServiceName) {
        this.storage = storageFactory.create(tupleOfflineStorageServiceName);
    }
    TupleOfflineStorageService.prototype.transaction = function (forWrite) {
        var _this = this;
        if (!this.storage.isOpen())
            return this.storage.open()
                .then(function () { return _this.storage.transaction(forWrite); });
        return this.storage.transaction(forWrite);
    };
    TupleOfflineStorageService.prototype.loadTuples = function (tupleSelector) {
        return this.transaction(false)
            .then(function (tx) {
            return tx.loadTuples(tupleSelector)
                .then(function (tuples) {
                // We have the tuples
                // close the transaction but disregard it's promise
                tx.close().catch(function (e) { return console.log("ERROR loadTuples: " + e); });
                return tuples;
            });
        });
    };
    TupleOfflineStorageService.prototype.loadTuplesEncoded = function (tupleSelector) {
        return this.transaction(false)
            .then(function (tx) {
            return tx.loadTuplesEncoded(tupleSelector)
                .then(function (vortexMsg) {
                // We have the tuples
                // close the transaction but disregard it's promise
                tx.close()
                    .catch(function (e) { return console.log("ERROR loadTuplesEncoded: " + e); });
                return vortexMsg;
            });
        });
    };
    TupleOfflineStorageService.prototype.saveTuples = function (tupleSelector, tuples) {
        return this.transaction(true)
            .then(function (tx) {
            return tx.saveTuples(tupleSelector, tuples)
                .then(function () {
                // Don't add the close to the promise chain
                tx.close().catch(function (e) { return console.log("ERROR saveTuples: " + e); });
            });
        });
    };
    TupleOfflineStorageService.prototype.saveTuplesEncoded = function (tupleSelector, vortexMsg) {
        return this.transaction(true)
            .then(function (tx) {
            return tx.saveTuplesEncoded(tupleSelector, vortexMsg)
                .then(function () {
                // Don't add the close to the promise chain
                tx.close().catch(function (e) { return console.log("ERROR saveTuplesEncoded: " + e); });
            });
        });
    };
    TupleOfflineStorageService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [TupleStorageFactoryService_1.TupleStorageFactoryService,
            TupleOfflineStorageNameService_1.TupleOfflineStorageNameService])
    ], TupleOfflineStorageService);
    return TupleOfflineStorageService;
}());
exports.TupleOfflineStorageService = TupleOfflineStorageService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVHVwbGVPZmZsaW5lU3RvcmFnZVNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJUdXBsZU9mZmxpbmVTdG9yYWdlU2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUVBLHNDQUF5QztBQUN6QywyRkFBd0Y7QUFLeEYsbUZBQWdGO0FBSWhGO0lBR0ksb0NBQVksY0FBMEMsRUFDMUMsOEJBQThEO1FBQ3RFLElBQUksQ0FBQyxPQUFPLEdBQUcsY0FBYyxDQUFDLE1BQU0sQ0FBQyw4QkFBOEIsQ0FBQyxDQUFDO0lBRXpFLENBQUM7SUFFRCxnREFBVyxHQUFYLFVBQVksUUFBaUI7UUFBN0IsaUJBTUM7UUFMRyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLENBQUM7WUFDdkIsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFO2lCQUNyQixJQUFJLENBQUMsY0FBTSxPQUFBLEtBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxFQUFsQyxDQUFrQyxDQUFDLENBQUM7UUFFeEQsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQzlDLENBQUM7SUFFRCwrQ0FBVSxHQUFWLFVBQVcsYUFBNEI7UUFDbkMsTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDO2FBQ3pCLElBQUksQ0FBQyxVQUFBLEVBQUU7WUFDSixNQUFNLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUM7aUJBQzlCLElBQUksQ0FBQyxVQUFDLE1BQWU7Z0JBQ2xCLHFCQUFxQjtnQkFDckIsbURBQW1EO2dCQUNuRCxFQUFFLENBQUMsS0FBSyxFQUFFLENBQUMsS0FBSyxDQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsT0FBTyxDQUFDLEdBQUcsQ0FBQyx1QkFBcUIsQ0FBRyxDQUFDLEVBQXJDLENBQXFDLENBQUMsQ0FBQztnQkFDN0QsTUFBTSxDQUFDLE1BQU0sQ0FBQztZQUNsQixDQUFDLENBQUMsQ0FBQztRQUNYLENBQUMsQ0FBQyxDQUFDO0lBQ1gsQ0FBQztJQUVELHNEQUFpQixHQUFqQixVQUFrQixhQUE0QjtRQUMxQyxNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUM7YUFDekIsSUFBSSxDQUFDLFVBQUEsRUFBRTtZQUNKLE1BQU0sQ0FBQyxFQUFFLENBQUMsaUJBQWlCLENBQUMsYUFBYSxDQUFDO2lCQUNyQyxJQUFJLENBQUMsVUFBQyxTQUF3QjtnQkFDM0IscUJBQXFCO2dCQUNyQixtREFBbUQ7Z0JBQ25ELEVBQUUsQ0FBQyxLQUFLLEVBQUU7cUJBQ1AsS0FBSyxDQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsT0FBTyxDQUFDLEdBQUcsQ0FBQyw4QkFBNEIsQ0FBRyxDQUFDLEVBQTVDLENBQTRDLENBQUMsQ0FBQztnQkFDNUQsTUFBTSxDQUFDLFNBQVMsQ0FBQztZQUNyQixDQUFDLENBQUMsQ0FBQztRQUNYLENBQUMsQ0FBQyxDQUFDO0lBQ1gsQ0FBQztJQUVELCtDQUFVLEdBQVYsVUFBVyxhQUE0QixFQUFFLE1BQWU7UUFDcEQsTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDO2FBQ3hCLElBQUksQ0FBQyxVQUFBLEVBQUU7WUFDSixNQUFNLENBQUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxhQUFhLEVBQUUsTUFBTSxDQUFDO2lCQUV0QyxJQUFJLENBQUM7Z0JBQ0YsMkNBQTJDO2dCQUMzQyxFQUFFLENBQUMsS0FBSyxFQUFFLENBQUMsS0FBSyxDQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsT0FBTyxDQUFDLEdBQUcsQ0FBQyx1QkFBcUIsQ0FBRyxDQUFDLEVBQXJDLENBQXFDLENBQUMsQ0FBQztZQUNqRSxDQUFDLENBQUMsQ0FBQztRQUNYLENBQUMsQ0FBQyxDQUFDO0lBQ1gsQ0FBQztJQUVELHNEQUFpQixHQUFqQixVQUFrQixhQUE0QixFQUFFLFNBQWlCO1FBQzdELE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQzthQUN4QixJQUFJLENBQUMsVUFBQSxFQUFFO1lBQ0osTUFBTSxDQUFDLEVBQUUsQ0FBQyxpQkFBaUIsQ0FBQyxhQUFhLEVBQUUsU0FBUyxDQUFDO2lCQUVoRCxJQUFJLENBQUM7Z0JBQ0YsMkNBQTJDO2dCQUMzQyxFQUFFLENBQUMsS0FBSyxFQUFFLENBQUMsS0FBSyxDQUFDLFVBQUEsQ0FBQyxJQUFJLE9BQUEsT0FBTyxDQUFDLEdBQUcsQ0FBQyw4QkFBNEIsQ0FBRyxDQUFDLEVBQTVDLENBQTRDLENBQUMsQ0FBQztZQUN4RSxDQUFDLENBQUMsQ0FBQztRQUNYLENBQUMsQ0FBQyxDQUFDO0lBQ1gsQ0FBQztJQWxFUSwwQkFBMEI7UUFEdEMsaUJBQVUsRUFBRTt5Q0FJbUIsdURBQTBCO1lBQ1YsK0RBQThCO09BSmpFLDBCQUEwQixDQW9FdEM7SUFBRCxpQ0FBQztDQUFBLEFBcEVELElBb0VDO0FBcEVZLGdFQUEwQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7VHVwbGVTZWxlY3Rvcn0gZnJvbSBcIi4vVHVwbGVTZWxlY3RvclwiO1xuaW1wb3J0IHtUdXBsZX0gZnJvbSBcIi4vVHVwbGVcIjtcbmltcG9ydCB7SW5qZWN0YWJsZX0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcbmltcG9ydCB7VHVwbGVTdG9yYWdlRmFjdG9yeVNlcnZpY2V9IGZyb20gXCIuL3N0b3JhZ2UtZmFjdG9yeS9UdXBsZVN0b3JhZ2VGYWN0b3J5U2VydmljZVwiO1xuaW1wb3J0IHtcbiAgICBUdXBsZVN0b3JhZ2VTZXJ2aWNlQUJDLFxuICAgIFR1cGxlU3RvcmFnZVRyYW5zYWN0aW9uXG59IGZyb20gXCIuL3N0b3JhZ2UvVHVwbGVTdG9yYWdlU2VydmljZUFCQ1wiO1xuaW1wb3J0IHtUdXBsZU9mZmxpbmVTdG9yYWdlTmFtZVNlcnZpY2V9IGZyb20gXCIuL1R1cGxlT2ZmbGluZVN0b3JhZ2VOYW1lU2VydmljZVwiO1xuXG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBUdXBsZU9mZmxpbmVTdG9yYWdlU2VydmljZSB7XG4gICAgcHJpdmF0ZSBzdG9yYWdlOiBUdXBsZVN0b3JhZ2VTZXJ2aWNlQUJDO1xuXG4gICAgY29uc3RydWN0b3Ioc3RvcmFnZUZhY3Rvcnk6IFR1cGxlU3RvcmFnZUZhY3RvcnlTZXJ2aWNlLFxuICAgICAgICAgICAgICAgIHR1cGxlT2ZmbGluZVN0b3JhZ2VTZXJ2aWNlTmFtZTogVHVwbGVPZmZsaW5lU3RvcmFnZU5hbWVTZXJ2aWNlKSB7XG4gICAgICAgIHRoaXMuc3RvcmFnZSA9IHN0b3JhZ2VGYWN0b3J5LmNyZWF0ZSh0dXBsZU9mZmxpbmVTdG9yYWdlU2VydmljZU5hbWUpO1xuXG4gICAgfVxuXG4gICAgdHJhbnNhY3Rpb24oZm9yV3JpdGU6IGJvb2xlYW4pOiBQcm9taXNlPFR1cGxlU3RvcmFnZVRyYW5zYWN0aW9uPiB7XG4gICAgICAgIGlmICghdGhpcy5zdG9yYWdlLmlzT3BlbigpKVxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc3RvcmFnZS5vcGVuKClcbiAgICAgICAgICAgICAgICAudGhlbigoKSA9PiB0aGlzLnN0b3JhZ2UudHJhbnNhY3Rpb24oZm9yV3JpdGUpKTtcblxuICAgICAgICByZXR1cm4gdGhpcy5zdG9yYWdlLnRyYW5zYWN0aW9uKGZvcldyaXRlKTtcbiAgICB9XG5cbiAgICBsb2FkVHVwbGVzKHR1cGxlU2VsZWN0b3I6IFR1cGxlU2VsZWN0b3IpOiBQcm9taXNlPFR1cGxlW10+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMudHJhbnNhY3Rpb24oZmFsc2UpXG4gICAgICAgICAgICAudGhlbih0eCA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHR4LmxvYWRUdXBsZXModHVwbGVTZWxlY3RvcilcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oKHR1cGxlczogVHVwbGVbXSkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gV2UgaGF2ZSB0aGUgdHVwbGVzXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjbG9zZSB0aGUgdHJhbnNhY3Rpb24gYnV0IGRpc3JlZ2FyZCBpdCdzIHByb21pc2VcbiAgICAgICAgICAgICAgICAgICAgICAgIHR4LmNsb3NlKCkuY2F0Y2goZSA9PiBjb25zb2xlLmxvZyhgRVJST1IgbG9hZFR1cGxlczogJHtlfWApKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiB0dXBsZXM7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgbG9hZFR1cGxlc0VuY29kZWQodHVwbGVTZWxlY3RvcjogVHVwbGVTZWxlY3Rvcik6IFByb21pc2U8c3RyaW5nIHwgbnVsbD4ge1xuICAgICAgICByZXR1cm4gdGhpcy50cmFuc2FjdGlvbihmYWxzZSlcbiAgICAgICAgICAgIC50aGVuKHR4ID0+IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdHgubG9hZFR1cGxlc0VuY29kZWQodHVwbGVTZWxlY3RvcilcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oKHZvcnRleE1zZzogc3RyaW5nIHwgbnVsbCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gV2UgaGF2ZSB0aGUgdHVwbGVzXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjbG9zZSB0aGUgdHJhbnNhY3Rpb24gYnV0IGRpc3JlZ2FyZCBpdCdzIHByb21pc2VcbiAgICAgICAgICAgICAgICAgICAgICAgIHR4LmNsb3NlKClcbiAgICAgICAgICAgICAgICAgICAgICAgICAgLmNhdGNoKGUgPT4gY29uc29sZS5sb2coYEVSUk9SIGxvYWRUdXBsZXNFbmNvZGVkOiAke2V9YCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZvcnRleE1zZztcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBzYXZlVHVwbGVzKHR1cGxlU2VsZWN0b3I6IFR1cGxlU2VsZWN0b3IsIHR1cGxlczogVHVwbGVbXSk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICByZXR1cm4gdGhpcy50cmFuc2FjdGlvbih0cnVlKVxuICAgICAgICAgICAgLnRoZW4odHggPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiB0eC5zYXZlVHVwbGVzKHR1cGxlU2VsZWN0b3IsIHR1cGxlcylcbiAgICAgICAgICAgICAgICAvLyBDYWxsIHRoZSBUWCBDbG9zZSB3aGVuIHRoZSBzYXZlIHByb21pc2UgaXMgcmVzb2x2ZWRcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gRG9uJ3QgYWRkIHRoZSBjbG9zZSB0byB0aGUgcHJvbWlzZSBjaGFpblxuICAgICAgICAgICAgICAgICAgICAgICAgdHguY2xvc2UoKS5jYXRjaChlID0+IGNvbnNvbGUubG9nKGBFUlJPUiBzYXZlVHVwbGVzOiAke2V9YCkpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0pO1xuICAgIH1cblxuICAgIHNhdmVUdXBsZXNFbmNvZGVkKHR1cGxlU2VsZWN0b3I6IFR1cGxlU2VsZWN0b3IsIHZvcnRleE1zZzogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiAge1xuICAgICAgICByZXR1cm4gdGhpcy50cmFuc2FjdGlvbih0cnVlKVxuICAgICAgICAgICAgLnRoZW4odHggPT4ge1xuICAgICAgICAgICAgICAgIHJldHVybiB0eC5zYXZlVHVwbGVzRW5jb2RlZCh0dXBsZVNlbGVjdG9yLCB2b3J0ZXhNc2cpXG4gICAgICAgICAgICAgICAgLy8gQ2FsbCB0aGUgVFggQ2xvc2Ugd2hlbiB0aGUgc2F2ZSBwcm9taXNlIGlzIHJlc29sdmVkXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKCgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIERvbid0IGFkZCB0aGUgY2xvc2UgdG8gdGhlIHByb21pc2UgY2hhaW5cbiAgICAgICAgICAgICAgICAgICAgICAgIHR4LmNsb3NlKCkuY2F0Y2goZSA9PiBjb25zb2xlLmxvZyhgRVJST1Igc2F2ZVR1cGxlc0VuY29kZWQ6ICR7ZX1gKSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XG4gICAgfVxuXG59XG4iXX0=