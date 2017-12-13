"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var TupleStorageServiceABC_1 = require("./TupleStorageServiceABC");
var TupleOfflineStorageNameService_1 = require("../TupleOfflineStorageNameService");
var UtilMisc_1 = require("../UtilMisc");
// ----------------------------------------------------------------------------
var TupleStorageNullService = (function (_super) {
    __extends(TupleStorageNullService, _super);
    function TupleStorageNullService(name) {
        return _super.call(this, name) || this;
    }
    TupleStorageNullService.prototype.open = function () {
        return Promise.resolve();
    };
    TupleStorageNullService.prototype.isOpen = function () {
        return true; // sure
    };
    TupleStorageNullService.prototype.close = function () {
    };
    TupleStorageNullService.prototype.transaction = function (forWrite) {
        return Promise.resolve(new TupleNullTransaction(forWrite));
    };
    TupleStorageNullService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [TupleOfflineStorageNameService_1.TupleOfflineStorageNameService])
    ], TupleStorageNullService);
    return TupleStorageNullService;
}(TupleStorageServiceABC_1.TupleStorageServiceABC));
exports.TupleStorageNullService = TupleStorageNullService;
var TupleNullTransaction = (function () {
    function TupleNullTransaction(txForWrite) {
        this.txForWrite = txForWrite;
    }
    TupleNullTransaction.prototype.loadTuples = function (tupleSelector) {
        console.log("TupleStorageNullService.tupleSelector " + tupleSelector.toOrderedJsonStr());
        return Promise.resolve([]);
    };
    TupleNullTransaction.prototype.loadTuplesEncoded = function (tupleSelector) {
        console.log("TupleStorageNullService.tupleSelector " + tupleSelector.toOrderedJsonStr());
        return Promise.resolve(null);
    };
    TupleNullTransaction.prototype.saveTuples = function (tupleSelector, tuples) {
        return this.saveTuplesEncoded(tupleSelector, 'TupleStorageNullService');
    };
    TupleNullTransaction.prototype.saveTuplesEncoded = function (tupleSelector, vortexMsg) {
        if (!this.txForWrite) {
            var msg = "Null Storage: saveTuples attempted on read only TX";
            console.log(UtilMisc_1.dateStr() + " " + msg);
            return Promise.reject(msg);
        }
        console.log("TupleStorageNullService.saveTuples " + tupleSelector.toOrderedJsonStr());
        return Promise.resolve();
    };
    TupleNullTransaction.prototype.close = function () {
        return Promise.resolve();
    };
    return TupleNullTransaction;
}());
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVHVwbGVTdG9yYWdlTnVsbFNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJUdXBsZVN0b3JhZ2VOdWxsU2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUVBLHNDQUF5QztBQUN6QyxtRUFBeUY7QUFDekYsb0ZBQWlGO0FBQ2pGLHdDQUFvQztBQUVwQywrRUFBK0U7QUFHL0U7SUFBNkMsMkNBQXNCO0lBRS9ELGlDQUFZLElBQW9DO2VBQzVDLGtCQUFNLElBQUksQ0FBQztJQUNmLENBQUM7SUFFRCxzQ0FBSSxHQUFKO1FBQ0ksTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQztJQUM3QixDQUFDO0lBRUQsd0NBQU0sR0FBTjtRQUNJLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPO0lBQ3hCLENBQUM7SUFFRCx1Q0FBSyxHQUFMO0lBRUEsQ0FBQztJQUVELDZDQUFXLEdBQVgsVUFBWSxRQUFpQjtRQUN6QixNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLG9CQUFvQixDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7SUFDL0QsQ0FBQztJQXBCUSx1QkFBdUI7UUFEbkMsaUJBQVUsRUFBRTt5Q0FHUywrREFBOEI7T0FGdkMsdUJBQXVCLENBcUJuQztJQUFELDhCQUFDO0NBQUEsQUFyQkQsQ0FBNkMsK0NBQXNCLEdBcUJsRTtBQXJCWSwwREFBdUI7QUF3QnBDO0lBRUksOEJBQW9CLFVBQW1CO1FBQW5CLGVBQVUsR0FBVixVQUFVLENBQVM7SUFFdkMsQ0FBQztJQUVELHlDQUFVLEdBQVYsVUFBVyxhQUE0QjtRQUNuQyxPQUFPLENBQUMsR0FBRyxDQUFDLDJDQUF5QyxhQUFhLENBQUMsZ0JBQWdCLEVBQUksQ0FBQyxDQUFDO1FBQ3pGLE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQy9CLENBQUM7SUFFRCxnREFBaUIsR0FBakIsVUFBa0IsYUFBNEI7UUFDMUMsT0FBTyxDQUFDLEdBQUcsQ0FBQywyQ0FBeUMsYUFBYSxDQUFDLGdCQUFnQixFQUFJLENBQUMsQ0FBQztRQUN6RixNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNqQyxDQUFDO0lBRUQseUNBQVUsR0FBVixVQUFXLGFBQTRCLEVBQUUsTUFBZTtRQUN0RCxNQUFNLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLGFBQWEsRUFBRSx5QkFBeUIsQ0FBQyxDQUFDO0lBQzFFLENBQUM7SUFFRCxnREFBaUIsR0FBakIsVUFBa0IsYUFBNEIsRUFBRSxTQUFpQjtRQUU3RCxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO1lBQ25CLElBQUksR0FBRyxHQUFHLG9EQUFvRCxDQUFDO1lBQy9ELE9BQU8sQ0FBQyxHQUFHLENBQUksa0JBQU8sRUFBRSxTQUFJLEdBQUssQ0FBQyxDQUFDO1lBQ25DLE1BQU0sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFBO1FBQzlCLENBQUM7UUFFRCxPQUFPLENBQUMsR0FBRyxDQUFDLHdDQUFzQyxhQUFhLENBQUMsZ0JBQWdCLEVBQUksQ0FBQyxDQUFDO1FBQ3RGLE1BQU0sQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLENBQUM7SUFFN0IsQ0FBQztJQUVELG9DQUFLLEdBQUw7UUFDSSxNQUFNLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDO0lBQzdCLENBQUM7SUFDTCwyQkFBQztBQUFELENBQUMsQUFwQ0QsSUFvQ0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge1R1cGxlU2VsZWN0b3J9IGZyb20gXCIuLi9UdXBsZVNlbGVjdG9yXCI7XG5pbXBvcnQge1R1cGxlfSBmcm9tIFwiLi4vVHVwbGVcIjtcbmltcG9ydCB7SW5qZWN0YWJsZX0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcbmltcG9ydCB7VHVwbGVTdG9yYWdlU2VydmljZUFCQywgVHVwbGVTdG9yYWdlVHJhbnNhY3Rpb259IGZyb20gXCIuL1R1cGxlU3RvcmFnZVNlcnZpY2VBQkNcIjtcbmltcG9ydCB7VHVwbGVPZmZsaW5lU3RvcmFnZU5hbWVTZXJ2aWNlfSBmcm9tIFwiLi4vVHVwbGVPZmZsaW5lU3RvcmFnZU5hbWVTZXJ2aWNlXCI7XG5pbXBvcnQge2RhdGVTdHJ9IGZyb20gXCIuLi9VdGlsTWlzY1wiO1xuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBUdXBsZVN0b3JhZ2VOdWxsU2VydmljZSBleHRlbmRzIFR1cGxlU3RvcmFnZVNlcnZpY2VBQkMge1xuXG4gICAgY29uc3RydWN0b3IobmFtZTogVHVwbGVPZmZsaW5lU3RvcmFnZU5hbWVTZXJ2aWNlKSB7XG4gICAgICAgIHN1cGVyKG5hbWUpO1xuICAgIH1cblxuICAgIG9wZW4oKTogUHJvbWlzZTx2b2lkPiB7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcbiAgICB9XG5cbiAgICBpc09wZW4oKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiB0cnVlOyAvLyBzdXJlXG4gICAgfVxuXG4gICAgY2xvc2UoKTogdm9pZCB7XG5cbiAgICB9XG5cbiAgICB0cmFuc2FjdGlvbihmb3JXcml0ZTogYm9vbGVhbik6IFByb21pc2U8VHVwbGVTdG9yYWdlVHJhbnNhY3Rpb24+IHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShuZXcgVHVwbGVOdWxsVHJhbnNhY3Rpb24oZm9yV3JpdGUpKTtcbiAgICB9XG59XG5cblxuY2xhc3MgVHVwbGVOdWxsVHJhbnNhY3Rpb24gaW1wbGVtZW50cyBUdXBsZVN0b3JhZ2VUcmFuc2FjdGlvbiB7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHR4Rm9yV3JpdGU6IGJvb2xlYW4pIHtcblxuICAgIH1cblxuICAgIGxvYWRUdXBsZXModHVwbGVTZWxlY3RvcjogVHVwbGVTZWxlY3Rvcik6IFByb21pc2U8VHVwbGVbXT4ge1xuICAgICAgICBjb25zb2xlLmxvZyhgVHVwbGVTdG9yYWdlTnVsbFNlcnZpY2UudHVwbGVTZWxlY3RvciAke3R1cGxlU2VsZWN0b3IudG9PcmRlcmVkSnNvblN0cigpfWApO1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKFtdKTtcbiAgICB9XG5cbiAgICBsb2FkVHVwbGVzRW5jb2RlZCh0dXBsZVNlbGVjdG9yOiBUdXBsZVNlbGVjdG9yKTogUHJvbWlzZTxzdHJpbmcgfCBudWxsPiB7XG4gICAgICAgIGNvbnNvbGUubG9nKGBUdXBsZVN0b3JhZ2VOdWxsU2VydmljZS50dXBsZVNlbGVjdG9yICR7dHVwbGVTZWxlY3Rvci50b09yZGVyZWRKc29uU3RyKCl9YCk7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUobnVsbCk7XG4gICAgfVxuXG4gICAgc2F2ZVR1cGxlcyh0dXBsZVNlbGVjdG9yOiBUdXBsZVNlbGVjdG9yLCB0dXBsZXM6IFR1cGxlW10pOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgIHJldHVybiB0aGlzLnNhdmVUdXBsZXNFbmNvZGVkKHR1cGxlU2VsZWN0b3IsICdUdXBsZVN0b3JhZ2VOdWxsU2VydmljZScpO1xuICAgIH1cblxuICAgIHNhdmVUdXBsZXNFbmNvZGVkKHR1cGxlU2VsZWN0b3I6IFR1cGxlU2VsZWN0b3IsIHZvcnRleE1zZzogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG5cbiAgICAgICAgaWYgKCF0aGlzLnR4Rm9yV3JpdGUpIHtcbiAgICAgICAgICAgIGxldCBtc2cgPSBcIk51bGwgU3RvcmFnZTogc2F2ZVR1cGxlcyBhdHRlbXB0ZWQgb24gcmVhZCBvbmx5IFRYXCI7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgJHtkYXRlU3RyKCl9ICR7bXNnfWApO1xuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG1zZylcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnNvbGUubG9nKGBUdXBsZVN0b3JhZ2VOdWxsU2VydmljZS5zYXZlVHVwbGVzICR7dHVwbGVTZWxlY3Rvci50b09yZGVyZWRKc29uU3RyKCl9YCk7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoKTtcblxuICAgIH1cblxuICAgIGNsb3NlKCk6IFByb21pc2U8dm9pZD4ge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgfVxufVxuIl19