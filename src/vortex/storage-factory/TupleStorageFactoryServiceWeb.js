"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var WebSqlService_1 = require("../../websql/WebSqlService");
var TupleStorageIndexedDbService_1 = require("../storage/TupleStorageIndexedDbService");
var TupleStorageWebSqlService_1 = require("../storage/TupleStorageWebSqlService");
var TupleStorageNullService_1 = require("../storage/TupleStorageNullService");
var TupleStorageFactoryService_1 = require("./TupleStorageFactoryService");
var IndexedDb_1 = require("../storage/IndexedDb");
var TupleActionStorageWebSqlService_1 = require("../action-storage/TupleActionStorageWebSqlService");
// import {TupleActionStorageIndexedDbService} from "../action-storage/TupleActionStorageIndexedDbService";
var TupleStorageFactoryServiceWeb = (function (_super) {
    __extends(TupleStorageFactoryServiceWeb, _super);
    function TupleStorageFactoryServiceWeb(webSqlFactory) {
        return _super.call(this, webSqlFactory) || this;
    }
    TupleStorageFactoryServiceWeb.prototype.create = function (name) {
        // Prefer Web SQL
        if (this.webSqlFactory.supportsWebSql()
            && !this.webSqlFactory.hasStorageLimitations()) {
            console.log("TupleStorageFactoryService: Choosing WebSQL Storage");
            return new TupleStorageWebSqlService_1.TupleStorageWebSqlService(this.webSqlFactory, name);
        }
        // Fallback to Indexed DB, It gives mega space on mobile iOS
        if (IndexedDb_1.supportsIndexedDb()) {
            console.log("TupleStorageFactoryService: Choosing IndexedDB Storage");
            return new TupleStorageIndexedDbService_1.TupleStorageIndexedDbService(name);
        }
        // Otheriwse, the null service just silently does nothing.
        console.log("TupleStorageFactoryService: Choosing Null Storage");
        return new TupleStorageNullService_1.TupleStorageNullService(name);
    };
    TupleStorageFactoryServiceWeb.prototype.createActionStorage = function () {
        console.log("TupleStorageFactoryService: FORCING WebSQL Storage");
        return new TupleActionStorageWebSqlService_1.TupleActionStorageWebSqlService(this.webSqlFactory);
        /*
            // Prefer Web SQL
            if (this.webSqlFactory.supportsWebSql()
                && !this.webSqlFactory.hasStorageLimitations()) {
                console.log("TupleStorageFactoryService: Choosing WebSQL Storage");
                return new TupleActionStorageWebSqlService(this.webSqlFactory);
            }

            // Fallback to Indexed DB, It gives mega space on mobile iOS
            if (supportsIndexedDb()) {
                console.log("TupleStorageFactoryService: Choosing IndexedDB Storage");
                return new TupleActionStorageIndexedDbService();
            }

            // Otheriwse, raise an exception.
            console.log("TupleStorageFactoryService: Choosing Null Storage");
            throw new Error("Failed to choose a suitable storage backend for" +
                " offline TupleActions");

            // Maybe we could have an in memory tuple action cache, but it wouldn't be the
            // same.
            */
    };
    TupleStorageFactoryServiceWeb = __decorate([
        core_1.Injectable(),
        __metadata("design:paramtypes", [WebSqlService_1.WebSqlFactoryService])
    ], TupleStorageFactoryServiceWeb);
    return TupleStorageFactoryServiceWeb;
}(TupleStorageFactoryService_1.TupleStorageFactoryService));
exports.TupleStorageFactoryServiceWeb = TupleStorageFactoryServiceWeb;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVHVwbGVTdG9yYWdlRmFjdG9yeVNlcnZpY2VXZWIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJUdXBsZVN0b3JhZ2VGYWN0b3J5U2VydmljZVdlYi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHNDQUF5QztBQUN6Qyw0REFBZ0U7QUFHaEUsd0ZBQXFGO0FBQ3JGLGtGQUErRTtBQUMvRSw4RUFBMkU7QUFDM0UsMkVBQXdFO0FBRXhFLGtEQUF1RDtBQUN2RCxxR0FBa0c7QUFDbEcsMkdBQTJHO0FBRzNHO0lBQW1ELGlEQUEwQjtJQUN6RSx1Q0FBWSxhQUFtQztlQUMzQyxrQkFBTSxhQUFhLENBQUM7SUFDeEIsQ0FBQztJQUVELDhDQUFNLEdBQU4sVUFBTyxJQUFvQztRQUV2QyxpQkFBaUI7UUFDakIsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxjQUFjLEVBQUU7ZUFDaEMsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLHFCQUFxQixFQUFFLENBQUMsQ0FBQyxDQUFDO1lBQ2pELE9BQU8sQ0FBQyxHQUFHLENBQUMscURBQXFELENBQUMsQ0FBQztZQUNuRSxNQUFNLENBQUMsSUFBSSxxREFBeUIsQ0FBQyxJQUFJLENBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ25FLENBQUM7UUFFRCw0REFBNEQ7UUFDNUQsRUFBRSxDQUFDLENBQUMsNkJBQWlCLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDdEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyx3REFBd0QsQ0FBQyxDQUFDO1lBQ3RFLE1BQU0sQ0FBQyxJQUFJLDJEQUE0QixDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2xELENBQUM7UUFFRCwwREFBMEQ7UUFDMUQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxtREFBbUQsQ0FBQyxDQUFDO1FBQ2pFLE1BQU0sQ0FBQyxJQUFJLGlEQUF1QixDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzdDLENBQUM7SUFFRCwyREFBbUIsR0FBbkI7UUFDWSxPQUFPLENBQUMsR0FBRyxDQUFDLG9EQUFvRCxDQUFDLENBQUM7UUFDbEUsTUFBTSxDQUFDLElBQUksaUVBQStCLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQ3ZFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Y0FxQk07SUFDVixDQUFDO0lBbERRLDZCQUE2QjtRQUR6QyxpQkFBVSxFQUFFO3lDQUVrQixvQ0FBb0I7T0FEdEMsNkJBQTZCLENBbUR6QztJQUFELG9DQUFDO0NBQUEsQUFuREQsQ0FBbUQsdURBQTBCLEdBbUQ1RTtBQW5EWSxzRUFBNkIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0luamVjdGFibGV9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XG5pbXBvcnQge1dlYlNxbEZhY3RvcnlTZXJ2aWNlfSBmcm9tIFwiLi4vLi4vd2Vic3FsL1dlYlNxbFNlcnZpY2VcIjtcbmltcG9ydCB7VHVwbGVTdG9yYWdlU2VydmljZUFCQ30gZnJvbSBcIi4uL3N0b3JhZ2UvVHVwbGVTdG9yYWdlU2VydmljZUFCQ1wiO1xuaW1wb3J0IHtUdXBsZU9mZmxpbmVTdG9yYWdlTmFtZVNlcnZpY2V9IGZyb20gXCIuLi9UdXBsZU9mZmxpbmVTdG9yYWdlTmFtZVNlcnZpY2VcIjtcbmltcG9ydCB7VHVwbGVTdG9yYWdlSW5kZXhlZERiU2VydmljZX0gZnJvbSBcIi4uL3N0b3JhZ2UvVHVwbGVTdG9yYWdlSW5kZXhlZERiU2VydmljZVwiO1xuaW1wb3J0IHtUdXBsZVN0b3JhZ2VXZWJTcWxTZXJ2aWNlfSBmcm9tIFwiLi4vc3RvcmFnZS9UdXBsZVN0b3JhZ2VXZWJTcWxTZXJ2aWNlXCI7XG5pbXBvcnQge1R1cGxlU3RvcmFnZU51bGxTZXJ2aWNlfSBmcm9tIFwiLi4vc3RvcmFnZS9UdXBsZVN0b3JhZ2VOdWxsU2VydmljZVwiO1xuaW1wb3J0IHtUdXBsZVN0b3JhZ2VGYWN0b3J5U2VydmljZX0gZnJvbSBcIi4vVHVwbGVTdG9yYWdlRmFjdG9yeVNlcnZpY2VcIjtcbmltcG9ydCB7VHVwbGVBY3Rpb25TdG9yYWdlU2VydmljZUFCQ30gZnJvbSBcIi4uL2FjdGlvbi1zdG9yYWdlL1R1cGxlQWN0aW9uU3RvcmFnZVNlcnZpY2VBQkNcIjtcbmltcG9ydCB7c3VwcG9ydHNJbmRleGVkRGJ9IGZyb20gXCIuLi9zdG9yYWdlL0luZGV4ZWREYlwiO1xuaW1wb3J0IHtUdXBsZUFjdGlvblN0b3JhZ2VXZWJTcWxTZXJ2aWNlfSBmcm9tIFwiLi4vYWN0aW9uLXN0b3JhZ2UvVHVwbGVBY3Rpb25TdG9yYWdlV2ViU3FsU2VydmljZVwiO1xuLy8gaW1wb3J0IHtUdXBsZUFjdGlvblN0b3JhZ2VJbmRleGVkRGJTZXJ2aWNlfSBmcm9tIFwiLi4vYWN0aW9uLXN0b3JhZ2UvVHVwbGVBY3Rpb25TdG9yYWdlSW5kZXhlZERiU2VydmljZVwiO1xuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgVHVwbGVTdG9yYWdlRmFjdG9yeVNlcnZpY2VXZWIgZXh0ZW5kcyBUdXBsZVN0b3JhZ2VGYWN0b3J5U2VydmljZSB7XG4gICAgY29uc3RydWN0b3Iod2ViU3FsRmFjdG9yeTogV2ViU3FsRmFjdG9yeVNlcnZpY2UpIHtcbiAgICAgICAgc3VwZXIod2ViU3FsRmFjdG9yeSk7XG4gICAgfVxuXG4gICAgY3JlYXRlKG5hbWU6IFR1cGxlT2ZmbGluZVN0b3JhZ2VOYW1lU2VydmljZSk6IFR1cGxlU3RvcmFnZVNlcnZpY2VBQkMge1xuXG4gICAgICAgIC8vIFByZWZlciBXZWIgU1FMXG4gICAgICAgIGlmICh0aGlzLndlYlNxbEZhY3Rvcnkuc3VwcG9ydHNXZWJTcWwoKVxuICAgICAgICAgICAgJiYgIXRoaXMud2ViU3FsRmFjdG9yeS5oYXNTdG9yYWdlTGltaXRhdGlvbnMoKSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJUdXBsZVN0b3JhZ2VGYWN0b3J5U2VydmljZTogQ2hvb3NpbmcgV2ViU1FMIFN0b3JhZ2VcIik7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFR1cGxlU3RvcmFnZVdlYlNxbFNlcnZpY2UodGhpcy53ZWJTcWxGYWN0b3J5LCBuYW1lKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEZhbGxiYWNrIHRvIEluZGV4ZWQgREIsIEl0IGdpdmVzIG1lZ2Egc3BhY2Ugb24gbW9iaWxlIGlPU1xuICAgICAgICBpZiAoc3VwcG9ydHNJbmRleGVkRGIoKSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJUdXBsZVN0b3JhZ2VGYWN0b3J5U2VydmljZTogQ2hvb3NpbmcgSW5kZXhlZERCIFN0b3JhZ2VcIik7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFR1cGxlU3RvcmFnZUluZGV4ZWREYlNlcnZpY2UobmFtZSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBPdGhlcml3c2UsIHRoZSBudWxsIHNlcnZpY2UganVzdCBzaWxlbnRseSBkb2VzIG5vdGhpbmcuXG4gICAgICAgIGNvbnNvbGUubG9nKFwiVHVwbGVTdG9yYWdlRmFjdG9yeVNlcnZpY2U6IENob29zaW5nIE51bGwgU3RvcmFnZVwiKTtcbiAgICAgICAgcmV0dXJuIG5ldyBUdXBsZVN0b3JhZ2VOdWxsU2VydmljZShuYW1lKTtcbiAgICB9XG5cbiAgICBjcmVhdGVBY3Rpb25TdG9yYWdlKCk6IFR1cGxlQWN0aW9uU3RvcmFnZVNlcnZpY2VBQkMge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiVHVwbGVTdG9yYWdlRmFjdG9yeVNlcnZpY2U6IEZPUkNJTkcgV2ViU1FMIFN0b3JhZ2VcIik7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBUdXBsZUFjdGlvblN0b3JhZ2VXZWJTcWxTZXJ2aWNlKHRoaXMud2ViU3FsRmFjdG9yeSk7XG4gICAgICAgIC8qXG4gICAgICAgICAgICAvLyBQcmVmZXIgV2ViIFNRTFxuICAgICAgICAgICAgaWYgKHRoaXMud2ViU3FsRmFjdG9yeS5zdXBwb3J0c1dlYlNxbCgpXG4gICAgICAgICAgICAgICAgJiYgIXRoaXMud2ViU3FsRmFjdG9yeS5oYXNTdG9yYWdlTGltaXRhdGlvbnMoKSkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiVHVwbGVTdG9yYWdlRmFjdG9yeVNlcnZpY2U6IENob29zaW5nIFdlYlNRTCBTdG9yYWdlXCIpO1xuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgVHVwbGVBY3Rpb25TdG9yYWdlV2ViU3FsU2VydmljZSh0aGlzLndlYlNxbEZhY3RvcnkpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBGYWxsYmFjayB0byBJbmRleGVkIERCLCBJdCBnaXZlcyBtZWdhIHNwYWNlIG9uIG1vYmlsZSBpT1NcbiAgICAgICAgICAgIGlmIChzdXBwb3J0c0luZGV4ZWREYigpKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJUdXBsZVN0b3JhZ2VGYWN0b3J5U2VydmljZTogQ2hvb3NpbmcgSW5kZXhlZERCIFN0b3JhZ2VcIik7XG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBUdXBsZUFjdGlvblN0b3JhZ2VJbmRleGVkRGJTZXJ2aWNlKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIE90aGVyaXdzZSwgcmFpc2UgYW4gZXhjZXB0aW9uLlxuICAgICAgICAgICAgY29uc29sZS5sb2coXCJUdXBsZVN0b3JhZ2VGYWN0b3J5U2VydmljZTogQ2hvb3NpbmcgTnVsbCBTdG9yYWdlXCIpO1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiRmFpbGVkIHRvIGNob29zZSBhIHN1aXRhYmxlIHN0b3JhZ2UgYmFja2VuZCBmb3JcIiArXG4gICAgICAgICAgICAgICAgXCIgb2ZmbGluZSBUdXBsZUFjdGlvbnNcIik7XG5cbiAgICAgICAgICAgIC8vIE1heWJlIHdlIGNvdWxkIGhhdmUgYW4gaW4gbWVtb3J5IHR1cGxlIGFjdGlvbiBjYWNoZSwgYnV0IGl0IHdvdWxkbid0IGJlIHRoZVxuICAgICAgICAgICAgLy8gc2FtZS5cbiAgICAgICAgICAgICovXG4gICAgfVxufVxuXG4iXX0=