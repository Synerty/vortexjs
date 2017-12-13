"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var UtilMisc_1 = require("../UtilMisc");
var TupleStorageServiceABC_1 = require("./TupleStorageServiceABC");
var TupleOfflineStorageNameService_1 = require("../TupleOfflineStorageNameService");
var Payload_1 = require("../Payload");
var IndexedDb_1 = require("./IndexedDb");
// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------
function now() {
    return new Date();
}
var TUPLE_STORE = "tuples";
/** Tuple Storage IndexedDB
 *
 * This class handles storing and retrieving tuples to/from indexed db.
 *
 */
var TupleStorageIndexedDbService = (function (_super) {
    __extends(TupleStorageIndexedDbService, _super);
    function TupleStorageIndexedDbService(name) {
        var _this = _super.call(this, name) || this;
        _this.openInProgressPromise = null;
        return _this;
    }
    // ----------------------------------------------------------------------------
    // Open the indexed db database
    TupleStorageIndexedDbService.prototype.open = function () {
        var _this = this;
        if (this.openInProgressPromise != null)
            return this.openInProgressPromise;
        this.openInProgressPromise = new Promise(function (resolve, reject) {
            // DISP Store
            var request = IndexedDb_1.indexedDB.open(_this.dbName, 1);
            IndexedDb_1.addIndexedDbHandlers(request, function () {
                var msg = UtilMisc_1.dateStr() + " IndexedDB : \"" + _this.dbName + "\" "
                    + "Failed to open IndexedDB database";
                _this.openInProgressPromise = null;
                reject(msg);
                throw new IndexedDb_1.IDBException(msg);
            });
            request.onsuccess = function (event) {
                console.log(UtilMisc_1.dateStr() + " IndexedDB : \"" + _this.dbName + "\" Success opening DB");
                if (_this.db == null) {
                    _this.db = event.target.result;
                    _this.openInProgressPromise = null;
                    resolve();
                }
            };
            request.onupgradeneeded = function (event) {
                console.log(UtilMisc_1.dateStr() + " IndexedDB : \"" + _this.dbName + "\" Upgrading");
                var db = event.target.result;
                // SCHEMA for database points
                // Schema Version 1
                db.createObjectStore(TUPLE_STORE, { keyPath: "tupleSelector" });
                console.log(UtilMisc_1.dateStr() + " IndexedDB : \"" + _this.dbName + "\" Upgrade Success");
            };
        });
        return this.openInProgressPromise;
    };
    // ----------------------------------------------------------------------------
    // Check if the DB is open
    TupleStorageIndexedDbService.prototype.isOpen = function () {
        return this.db != null;
    };
    ;
    TupleStorageIndexedDbService.prototype.close = function () {
        if (!this.isOpen()) {
            throw new Error("IndexedDB \"" + this.dbName + "\" is not open");
        }
        this.db.close();
        this.db = null;
    };
    TupleStorageIndexedDbService.prototype.transaction = function (forWrite) {
        if (!this.isOpen())
            throw new Error("IndexedDB " + this.dbName + " is not open");
        // Get the Read Only case out the way, it's easy
        var mode = forWrite ? "readwrite" : "readonly";
        return Promise.resolve(new TupleIndexedDbTransaction(this.db.transaction(TUPLE_STORE, mode), forWrite));
    };
    TupleStorageIndexedDbService = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [TupleOfflineStorageNameService_1.TupleOfflineStorageNameService])
    ], TupleStorageIndexedDbService);
    return TupleStorageIndexedDbService;
}(TupleStorageServiceABC_1.TupleStorageServiceABC));
exports.TupleStorageIndexedDbService = TupleStorageIndexedDbService;
var TupleIndexedDbTransaction = (function () {
    function TupleIndexedDbTransaction(tx, txForWrite) {
        this.tx = tx;
        this.txForWrite = txForWrite;
        this.store = this.tx.objectStore(TUPLE_STORE);
    }
    // ----------------------------------------------------------------------------
    // Load the display items from the cache
    TupleIndexedDbTransaction.prototype.loadTuples = function (tupleSelector) {
        return this.loadTuplesEncoded(tupleSelector)
            .then(function (vortexMsg) {
            if (vortexMsg == null) {
                return [];
            }
            return Payload_1.Payload.fromVortexMsg(vortexMsg)
                .then(function (payload) { return payload.tuples; });
        });
    };
    // ----------------------------------------------------------------------------
    // Load the display items from the cache
    TupleIndexedDbTransaction.prototype.loadTuplesEncoded = function (tupleSelector) {
        var _this = this;
        var startTime = now();
        return new Promise(function (resolve, reject) {
            var request = _this.store.get(tupleSelector.toOrderedJsonStr());
            IndexedDb_1.addIndexedDbHandlers(request, function () {
                var msg = UtilMisc_1.dateStr() + " IndexedDB: Index open cursor";
                reject(msg);
                throw new IndexedDb_1.IDBException(msg);
            });
            request.onsuccess = function () {
                var timeTaken = now() - startTime;
                console.log(UtilMisc_1.dateStr() + " IndexedDB: loadTuples took " + timeTaken + "ms (in thread)");
                // Called for each matching record
                var data = request.result;
                if (data == null) {
                    resolve(null);
                    return;
                }
                resolve(data.payload);
            };
        });
    };
    // ----------------------------------------------------------------------------
    // Add disply items to the cache
    TupleIndexedDbTransaction.prototype.saveTuples = function (tupleSelector, tuples) {
        var _this = this;
        var startTime = now();
        // The payload is a convenient way to serialise and compress the data
        return new Payload_1.Payload({}, tuples).toVortexMsg()
            .then(function (vortexMsg) {
            var timeTaken = now() - startTime;
            console.log(UtilMisc_1.dateStr() + " IndexedDB: toVortexMsg took " + timeTaken + "ms ");
            return _this.saveTuplesEncoded(tupleSelector, vortexMsg);
        });
    };
    ;
    TupleIndexedDbTransaction.prototype.saveTuplesEncoded = function (tupleSelector, vortexMsg) {
        var _this = this;
        if (!this.txForWrite) {
            var msg = "IndexedDB: saveTuples attempted on read only TX";
            console.log(UtilMisc_1.dateStr() + " " + msg);
            return Promise.reject(msg);
        }
        // The payload is a convenient way to serialise and compress the data
        var tupleSelectorStr = tupleSelector.toOrderedJsonStr();
        var item = {
            tupleSelector: tupleSelectorStr,
            dateTime: new Date(),
            payload: vortexMsg
        };
        var startTime = now();
        return new Promise(function (resolve, reject) {
            // Run the inserts
            var response = _this.store.put(item);
            IndexedDb_1.addIndexedDbHandlers(response, function () {
                reject(UtilMisc_1.dateStr() + " IndexedDB: saveTuples \"put\" error");
                throw new IndexedDb_1.IDBException("Put error");
            });
            response.oncomplete = function () {
                var timeTaken = now() - startTime;
                console.log(UtilMisc_1.dateStr() + " IndexedDB: saveTuples"
                    + (" took " + timeTaken + "ms (in thread)")
                    + (" Inserted/updated " + vortexMsg.length + " of encoding"));
                resolve();
            };
        });
    };
    ;
    TupleIndexedDbTransaction.prototype.close = function () {
        return Promise.resolve();
        /* Close transaction ???

         addIndexedDbHandlers(this.tx, () => {
         reject();
         throw new IDBException("Transaction error");
         });

         // LOOK HERE, I'm looking at the WebSQL and IndexedDb implementation and both
         // appear to only provide single use transactions like this.
         // Considering that fact, The "TupleTransaction" api seems useless.
         this.tx.oncomplete = () => {
         let timeTaken = now() - startTime;
         console.log(`${dateStr()} IndexedDB: saveTuples`
         + ` took ${timeTaken}ms (in thread)`
         + ` Inserted/updated ${tuples.length} tuples`);
         resolve();
         };

         */
    };
    return TupleIndexedDbTransaction;
}());
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVHVwbGVTdG9yYWdlSW5kZXhlZERiU2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIlR1cGxlU3RvcmFnZUluZGV4ZWREYlNlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxzQ0FBeUM7QUFDekMsd0NBQW9DO0FBQ3BDLG1FQUF5RjtBQUN6RixvRkFBaUY7QUFHakYsc0NBQW1DO0FBQ25DLHlDQUEwRTtBQUkxRSwrRUFBK0U7QUFHL0UsK0VBQStFO0FBRS9FO0lBQ0ksTUFBTSxDQUFDLElBQUksSUFBSSxFQUFFLENBQUM7QUFDdEIsQ0FBQztBQUdELElBQU0sV0FBVyxHQUFHLFFBQVEsQ0FBQztBQVE3Qjs7OztHQUlHO0FBRUg7SUFBa0QsZ0RBQXNCO0lBS3BFLHNDQUFZLElBQW9DO1FBQWhELFlBQ0ksa0JBQU0sSUFBSSxDQUFDLFNBR2Q7UUFQTywyQkFBcUIsR0FBeUIsSUFBSSxDQUFDOztJQU8zRCxDQUFDO0lBRUQsK0VBQStFO0lBQy9FLCtCQUErQjtJQUMvQiwyQ0FBSSxHQUFKO1FBQUEsaUJBdUNDO1FBdENHLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxxQkFBcUIsSUFBSSxJQUFJLENBQUM7WUFDbkMsTUFBTSxDQUFDLElBQUksQ0FBQyxxQkFBcUIsQ0FBQztRQUd0QyxJQUFJLENBQUMscUJBQXFCLEdBQUcsSUFBSSxPQUFPLENBQU8sVUFBQyxPQUFPLEVBQUUsTUFBTTtZQUUzRCxhQUFhO1lBRWIsSUFBSSxPQUFPLEdBQUcscUJBQVMsQ0FBQyxJQUFJLENBQUMsS0FBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQztZQUM3QyxnQ0FBb0IsQ0FBQyxPQUFPLEVBQUU7Z0JBQzFCLElBQUksR0FBRyxHQUFNLGtCQUFPLEVBQUUsdUJBQWlCLEtBQUksQ0FBQyxNQUFNLFFBQUk7c0JBQ2hELG1DQUFtQyxDQUFDO2dCQUMxQyxLQUFJLENBQUMscUJBQXFCLEdBQUcsSUFBSSxDQUFDO2dCQUNsQyxNQUFN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Q0FBQztJQUNMLGdDQUFDO0FBQUQsQ0FBQyxBQTlJRCxJQThJQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7SW5qZWN0YWJsZX0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcbmltcG9ydCB7ZGF0ZVN0cn0gZnJvbSBcIi4uL1V0aWxNaXNjXCI7XG5pbXBvcnQge1R1cGxlU3RvcmFnZVNlcnZpY2VBQkMsIFR1cGxlU3RvcmFnZVRyYW5zYWN0aW9ufSBmcm9tIFwiLi9UdXBsZVN0b3JhZ2VTZXJ2aWNlQUJDXCI7XG5pbXBvcnQge1R1cGxlT2ZmbGluZVN0b3JhZ2VOYW1lU2VydmljZX0gZnJvbSBcIi4uL1R1cGxlT2ZmbGluZVN0b3JhZ2VOYW1lU2VydmljZVwiO1xuaW1wb3J0IHtUdXBsZVNlbGVjdG9yfSBmcm9tIFwiLi4vVHVwbGVTZWxlY3RvclwiO1xuaW1wb3J0IHtUdXBsZX0gZnJvbSBcIi4uL1R1cGxlXCI7XG5pbXBvcnQge1BheWxvYWR9IGZyb20gXCIuLi9QYXlsb2FkXCI7XG5pbXBvcnQge2luZGV4ZWREQiwgYWRkSW5kZXhlZERiSGFuZGxlcnMsIElEQkV4Y2VwdGlvbn0gZnJvbSBcIi4vSW5kZXhlZERiXCI7XG5cblxuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG5mdW5jdGlvbiBub3coKTogYW55IHtcbiAgICByZXR1cm4gbmV3IERhdGUoKTtcbn1cblxuXG5jb25zdCBUVVBMRV9TVE9SRSA9IFwidHVwbGVzXCI7XG5cbmludGVyZmFjZSBEYXRhU3RydWN0SSB7XG4gICAgdHVwbGVTZWxlY3Rvcjogc3RyaW5nO1xuICAgIGRhdGVUaW1lOiBEYXRlO1xuICAgIHBheWxvYWQ6IHN0cmluZztcbn1cblxuLyoqIFR1cGxlIFN0b3JhZ2UgSW5kZXhlZERCXG4gKlxuICogVGhpcyBjbGFzcyBoYW5kbGVzIHN0b3JpbmcgYW5kIHJldHJpZXZpbmcgdHVwbGVzIHRvL2Zyb20gaW5kZXhlZCBkYi5cbiAqXG4gKi9cbkBJbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBUdXBsZVN0b3JhZ2VJbmRleGVkRGJTZXJ2aWNlIGV4dGVuZHMgVHVwbGVTdG9yYWdlU2VydmljZUFCQyB7XG4gICAgZGI6IGFueTtcbiAgICBwcml2YXRlIG9wZW5JblByb2dyZXNzUHJvbWlzZTogUHJvbWlzZTx2b2lkPiB8IG51bGwgPSBudWxsO1xuXG5cbiAgICBjb25zdHJ1Y3RvcihuYW1lOiBUdXBsZU9mZmxpbmVTdG9yYWdlTmFtZVNlcnZpY2UpIHtcbiAgICAgICAgc3VwZXIobmFtZSk7XG5cblxuICAgIH1cblxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBPcGVuIHRoZSBpbmRleGVkIGRiIGRhdGFiYXNlXG4gICAgb3BlbigpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgaWYgKHRoaXMub3BlbkluUHJvZ3Jlc3NQcm9taXNlICE9IG51bGwpXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5vcGVuSW5Qcm9ncmVzc1Byb21pc2U7XG5cblxuICAgICAgICB0aGlzLm9wZW5JblByb2dyZXNzUHJvbWlzZSA9IG5ldyBQcm9taXNlPHZvaWQ+KChyZXNvbHZlLCByZWplY3QpID0+IHtcblxuICAgICAgICAgICAgLy8gRElTUCBTdG9yZVxuXG4gICAgICAgICAgICBsZXQgcmVxdWVzdCA9IGluZGV4ZWREQi5vcGVuKHRoaXMuZGJOYW1lLCAxKTtcbiAgICAgICAgICAgIGFkZEluZGV4ZWREYkhhbmRsZXJzKHJlcXVlc3QsICgpID0+IHtcbiAgICAgICAgICAgICAgICBsZXQgbXNnID0gYCR7ZGF0ZVN0cigpfSBJbmRleGVkREIgOiBcIiR7dGhpcy5kYk5hbWV9XCIgYFxuICAgICAgICAgICAgICAgICAgICArIGBGYWlsZWQgdG8gb3BlbiBJbmRleGVkREIgZGF0YWJhc2VgO1xuICAgICAgICAgICAgICAgIHRoaXMub3BlbkluUHJvZ3Jlc3NQcm9taXNlID0gbnVsbDtcbiAgICAgICAgICAgICAgICByZWplY3QobXNnKTtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgSURCRXhjZXB0aW9uKG1zZyk7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcmVxdWVzdC5vbnN1Y2Nlc3MgPSAoZXZlbnQpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhgJHtkYXRlU3RyKCl9IEluZGV4ZWREQiA6IFwiJHt0aGlzLmRiTmFtZX1cIiBTdWNjZXNzIG9wZW5pbmcgREJgKTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5kYiA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGIgPSBldmVudC50YXJnZXQucmVzdWx0O1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm9wZW5JblByb2dyZXNzUHJvbWlzZSA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIHJlc29sdmUoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICByZXF1ZXN0Lm9udXBncmFkZW5lZWRlZCA9IChldmVudCkgPT4ge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGAke2RhdGVTdHIoKX0gSW5kZXhlZERCIDogXCIke3RoaXMuZGJOYW1lfVwiIFVwZ3JhZGluZ2ApO1xuICAgICAgICAgICAgICAgIGxldCBkYiA9IGV2ZW50LnRhcmdldC5yZXN1bHQ7XG5cbiAgICAgICAgICAgICAgICAvLyBTQ0hFTUEgZm9yIGRhdGFiYXNlIHBvaW50c1xuICAgICAgICAgICAgICAgIC8vIFNjaGVtYSBWZXJzaW9uIDFcbiAgICAgICAgICAgICAgICBkYi5jcmVhdGVPYmplY3RTdG9yZShUVVBMRV9TVE9SRSwge2tleVBhdGg6IFwidHVwbGVTZWxlY3RvclwifSk7XG5cbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhgJHtkYXRlU3RyKCl9IEluZGV4ZWREQiA6IFwiJHt0aGlzLmRiTmFtZX1cIiBVcGdyYWRlIFN1Y2Nlc3NgKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0pO1xuICAgICAgICByZXR1cm4gdGhpcy5vcGVuSW5Qcm9ncmVzc1Byb21pc2U7XG4gICAgfVxuXG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIENoZWNrIGlmIHRoZSBEQiBpcyBvcGVuXG4gICAgaXNPcGVuKCk6IGJvb2xlYW4ge1xuXG4gICAgICAgIHJldHVybiB0aGlzLmRiICE9IG51bGw7XG4gICAgfTtcblxuICAgIGNsb3NlKCk6IHZvaWQge1xuICAgICAgICBpZiAoIXRoaXMuaXNPcGVuKCkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgSW5kZXhlZERCIFwiJHt0aGlzLmRiTmFtZX1cIiBpcyBub3Qgb3BlbmApXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5kYi5jbG9zZSgpO1xuICAgICAgICB0aGlzLmRiID0gbnVsbDtcbiAgICB9XG5cbiAgICB0cmFuc2FjdGlvbihmb3JXcml0ZTogYm9vbGVhbik6IFByb21pc2U8VHVwbGVTdG9yYWdlVHJhbnNhY3Rpb24+IHtcbiAgICAgICAgaWYgKCF0aGlzLmlzT3BlbigpKVxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbmRleGVkREIgJHt0aGlzLmRiTmFtZX0gaXMgbm90IG9wZW5gKTtcblxuICAgICAgICAvLyBHZXQgdGhlIFJlYWQgT25seSBjYXNlIG91dCB0aGUgd2F5LCBpdCdzIGVhc3lcbiAgICAgICAgbGV0IG1vZGUgPSBmb3JXcml0ZSA/IFwicmVhZHdyaXRlXCIgOiBcInJlYWRvbmx5XCI7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoXG4gICAgICAgICAgICBuZXcgVHVwbGVJbmRleGVkRGJUcmFuc2FjdGlvbihcbiAgICAgICAgICAgICAgICB0aGlzLmRiLnRyYW5zYWN0aW9uKFRVUExFX1NUT1JFLCBtb2RlKSwgZm9yV3JpdGVcbiAgICAgICAgICAgIClcbiAgICAgICAgKTtcblxuICAgIH1cbn1cblxuXG5jbGFzcyBUdXBsZUluZGV4ZWREYlRyYW5zYWN0aW9uIGltcGxlbWVudHMgVHVwbGVTdG9yYWdlVHJhbnNhY3Rpb24ge1xuICAgIHByaXZhdGUgc3RvcmU6IGFueTtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgdHg6IElEQlRyYW5zYWN0aW9uLCBwcml2YXRlIHR4Rm9yV3JpdGU6IGJvb2xlYW4pIHtcbiAgICAgICAgdGhpcy5zdG9yZSA9IHRoaXMudHgub2JqZWN0U3RvcmUoVFVQTEVfU1RPUkUpO1xuICAgIH1cblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuLy8gTG9hZCB0aGUgZGlzcGxheSBpdGVtcyBmcm9tIHRoZSBjYWNoZVxuXG4gICAgbG9hZFR1cGxlcyh0dXBsZVNlbGVjdG9yOiBUdXBsZVNlbGVjdG9yKTogUHJvbWlzZTxUdXBsZVtdPiB7XG5cbiAgICAgICAgcmV0dXJuIHRoaXMubG9hZFR1cGxlc0VuY29kZWQodHVwbGVTZWxlY3RvcilcbiAgICAgICAgICAgIC50aGVuKCh2b3J0ZXhNc2c6IHN0cmluZykgPT4ge1xuICAgICAgICAgICAgICAgIGlmICh2b3J0ZXhNc2cgPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gW107XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIFBheWxvYWQuZnJvbVZvcnRleE1zZyh2b3J0ZXhNc2cpXG4gICAgICAgICAgICAgICAgICAgIC50aGVuKChwYXlsb2FkOiBQYXlsb2FkKSA9PiBwYXlsb2FkLnR1cGxlcyk7XG4gICAgICAgICAgICB9KTtcbiAgICB9XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIExvYWQgdGhlIGRpc3BsYXkgaXRlbXMgZnJvbSB0aGUgY2FjaGVcbiAgICBsb2FkVHVwbGVzRW5jb2RlZCh0dXBsZVNlbGVjdG9yOiBUdXBsZVNlbGVjdG9yKTogUHJvbWlzZTxzdHJpbmcgfCBudWxsPiB7XG4gICAgICAgIGxldCBzdGFydFRpbWU6IGFueSA9IG5vdygpO1xuXG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZTxzdHJpbmcgfCBudWxsPigocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cbiAgICAgICAgICAgIGxldCByZXF1ZXN0ID0gdGhpcy5zdG9yZS5nZXQodHVwbGVTZWxlY3Rvci50b09yZGVyZWRKc29uU3RyKCkpO1xuXG4gICAgICAgICAgICBhZGRJbmRleGVkRGJIYW5kbGVycyhyZXF1ZXN0LCAoKSA9PiB7XG4gICAgICAgICAgICAgICAgbGV0IG1zZyA9IGAke2RhdGVTdHIoKX0gSW5kZXhlZERCOiBJbmRleCBvcGVuIGN1cnNvcmA7XG4gICAgICAgICAgICAgICAgcmVqZWN0KG1zZyk7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IElEQkV4Y2VwdGlvbihtc2cpO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHJlcXVlc3Qub25zdWNjZXNzID0gKCkgPT4ge1xuXG4gICAgICAgICAgICAgICAgbGV0IHRpbWVUYWtlbiA9IG5vdygpIC0gc3RhcnRUaW1lO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFxuICAgICAgICAgICAgICAgICAgICBgJHtkYXRlU3RyKCl9IEluZGV4ZWREQjogbG9hZFR1cGxlcyB0b29rICR7dGltZVRha2VufW1zIChpbiB0aHJlYWQpYFxuICAgICAgICAgICAgICAgICk7XG5cbiAgICAgICAgICAgICAgICAvLyBDYWxsZWQgZm9yIGVhY2ggbWF0Y2hpbmcgcmVjb3JkXG4gICAgICAgICAgICAgICAgbGV0IGRhdGE6IERhdGFTdHJ1Y3RJIHwgbnVsbCA9IHJlcXVlc3QucmVzdWx0O1xuICAgICAgICAgICAgICAgIGlmIChkYXRhID09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgcmVzb2x2ZShudWxsKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHJlc29sdmUoZGF0YS5wYXlsb2FkKTtcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0pO1xuXG4gICAgfVxuXG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbi8vIEFkZCBkaXNwbHkgaXRlbXMgdG8gdGhlIGNhY2hlXG5cbiAgICBzYXZlVHVwbGVzKHR1cGxlU2VsZWN0b3I6IFR1cGxlU2VsZWN0b3IsIHR1cGxlczogVHVwbGVbXSk6IFByb21pc2U8dm9pZD4ge1xuXG4gICAgICAgIGxldCBzdGFydFRpbWUgPSBub3coKTtcblxuICAgICAgICAvLyBUaGUgcGF5bG9hZCBpcyBhIGNvbnZlbmllbnQgd2F5IHRvIHNlcmlhbGlzZSBhbmQgY29tcHJlc3MgdGhlIGRhdGFcbiAgICAgICAgcmV0dXJuIG5ldyBQYXlsb2FkKHt9LCB0dXBsZXMpLnRvVm9ydGV4TXNnKClcbiAgICAgICAgICAgIC50aGVuKCh2b3J0ZXhNc2c6IHN0cmluZykgPT4ge1xuICAgICAgICAgICAgICAgIGxldCB0aW1lVGFrZW4gPSBub3coKSAtIHN0YXJ0VGltZTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhgJHtkYXRlU3RyKCl9IEluZGV4ZWREQjogdG9Wb3J0ZXhNc2cgdG9vayAke3RpbWVUYWtlbn1tcyBgKTtcblxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnNhdmVUdXBsZXNFbmNvZGVkKHR1cGxlU2VsZWN0b3IsIHZvcnRleE1zZyk7XG4gICAgICAgICAgICB9KTtcblxuICAgIH07XG5cblxuICAgIHNhdmVUdXBsZXNFbmNvZGVkKHR1cGxlU2VsZWN0b3I6IFR1cGxlU2VsZWN0b3IsIHZvcnRleE1zZzogc3RyaW5nKTogUHJvbWlzZTx2b2lkPiB7XG5cbiAgICAgICAgaWYgKCF0aGlzLnR4Rm9yV3JpdGUpIHtcbiAgICAgICAgICAgIGxldCBtc2cgPSBcIkluZGV4ZWREQjogc2F2ZVR1cGxlcyBhdHRlbXB0ZWQgb24gcmVhZCBvbmx5IFRYXCI7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgJHtkYXRlU3RyKCl9ICR7bXNnfWApO1xuICAgICAgICAgICAgcmV0dXJuIFByb21pc2UucmVqZWN0KG1zZylcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFRoZSBwYXlsb2FkIGlzIGEgY29udmVuaWVudCB3YXkgdG8gc2VyaWFsaXNlIGFuZCBjb21wcmVzcyB0aGUgZGF0YVxuICAgICAgICBsZXQgdHVwbGVTZWxlY3RvclN0ciA9IHR1cGxlU2VsZWN0b3IudG9PcmRlcmVkSnNvblN0cigpO1xuXG4gICAgICAgIGxldCBpdGVtOiBEYXRhU3RydWN0SSA9IHtcbiAgICAgICAgICAgIHR1cGxlU2VsZWN0b3I6IHR1cGxlU2VsZWN0b3JTdHIsXG4gICAgICAgICAgICBkYXRlVGltZTogbmV3IERhdGUoKSxcbiAgICAgICAgICAgIHBheWxvYWQ6IHZvcnRleE1zZ1xuICAgICAgICB9O1xuXG4gICAgICAgIGxldCBzdGFydFRpbWUgPSBub3coKTtcblxuICAgICAgICByZXR1cm4gbmV3IFByb21pc2U8dm9pZD4oKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXG4gICAgICAgICAgICAvLyBSdW4gdGhlIGluc2VydHNcbiAgICAgICAgICAgIGxldCByZXNwb25zZSA9IHRoaXMuc3RvcmUucHV0KGl0ZW0pO1xuXG4gICAgICAgICAgICBhZGRJbmRleGVkRGJIYW5kbGVycyhyZXNwb25zZSwgKCkgPT4ge1xuICAgICAgICAgICAgICAgIHJlamVjdChgJHtkYXRlU3RyKCl9IEluZGV4ZWREQjogc2F2ZVR1cGxlcyBcInB1dFwiIGVycm9yYCk7XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IElEQkV4Y2VwdGlvbihcIlB1dCBlcnJvclwiKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICByZXNwb25zZS5vbmNvbXBsZXRlID0gKCkgPT4ge1xuICAgICAgICAgICAgICAgIGxldCB0aW1lVGFrZW4gPSBub3coKSAtIHN0YXJ0VGltZTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhgJHtkYXRlU3RyKCl9IEluZGV4ZWREQjogc2F2ZVR1cGxlc2BcbiAgICAgICAgICAgICAgICAgICAgKyBgIHRvb2sgJHt0aW1lVGFrZW59bXMgKGluIHRocmVhZClgXG4gICAgICAgICAgICAgICAgICAgICsgYCBJbnNlcnRlZC91cGRhdGVkICR7dm9ydGV4TXNnLmxlbmd0aH0gb2YgZW5jb2RpbmdgKTtcbiAgICAgICAgICAgICAgICByZXNvbHZlKCk7XG4gICAgICAgICAgICB9O1xuICAgICAgICB9KTtcblxuICAgIH07XG5cbiAgICBjbG9zZSgpOiBQcm9taXNlPHZvaWQ+IHtcbiAgICAgICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZSgpO1xuXG4gICAgICAgIC8qIENsb3NlIHRyYW5zYWN0aW9uID8/P1xuXG4gICAgICAgICBhZGRJbmRleGVkRGJIYW5kbGVycyh0aGlzLnR4LCAoKSA9PiB7XG4gICAgICAgICByZWplY3QoKTtcbiAgICAgICAgIHRocm93IG5ldyBJREJFeGNlcHRpb24oXCJUcmFuc2FjdGlvbiBlcnJvclwiKTtcbiAgICAgICAgIH0pO1xuXG4gICAgICAgICAvLyBMT09LIEhFUkUsIEknbSBsb29raW5nIGF0IHRoZSBXZWJTUUwgYW5kIEluZGV4ZWREYiBpbXBsZW1lbnRhdGlvbiBhbmQgYm90aFxuICAgICAgICAgLy8gYXBwZWFyIHRvIG9ubHkgcHJvdmlkZSBzaW5nbGUgdXNlIHRyYW5zYWN0aW9ucyBsaWtlIHRoaXMuXG4gICAgICAgICAvLyBDb25zaWRlcmluZyB0aGF0IGZhY3QsIFRoZSBcIlR1cGxlVHJhbnNhY3Rpb25cIiBhcGkgc2VlbXMgdXNlbGVzcy5cbiAgICAgICAgIHRoaXMudHgub25jb21wbGV0ZSA9ICgpID0+IHtcbiAgICAgICAgIGxldCB0aW1lVGFrZW4gPSBub3coKSAtIHN0YXJ0VGltZTtcbiAgICAgICAgIGNvbnNvbGUubG9nKGAke2RhdGVTdHIoKX0gSW5kZXhlZERCOiBzYXZlVHVwbGVzYFxuICAgICAgICAgKyBgIHRvb2sgJHt0aW1lVGFrZW59bXMgKGluIHRocmVhZClgXG4gICAgICAgICArIGAgSW5zZXJ0ZWQvdXBkYXRlZCAke3R1cGxlcy5sZW5ndGh9IHR1cGxlc2ApO1xuICAgICAgICAgcmVzb2x2ZSgpO1xuICAgICAgICAgfTtcblxuICAgICAgICAgKi9cblxuICAgIH1cbn1cbiJdfQ==