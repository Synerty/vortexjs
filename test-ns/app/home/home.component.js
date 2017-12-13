"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var sidedrawer_1 = require("nativescript-pro-ui/sidedrawer");
var angular_1 = require("nativescript-pro-ui/sidedrawer/angular");
// Enable the use of workers for the payload
var vortexjs_1 = require("../vortexjs");
var index_nativescript_1 = require("../vortexjs/index-nativescript");
var HomeComponent = (function () {
    function HomeComponent() {
        this.payloadWorkerStatus = 'idle';
    }
    /* ***********************************************************
    * Use the sideDrawerTransition property to change the open/close animation of the drawer.
    *************************************************************/
    HomeComponent.prototype.ngOnInit = function () {
        this._sideDrawerTransition = new sidedrawer_1.SlideInOnTopTransition();
    };
    Object.defineProperty(HomeComponent.prototype, "sideDrawerTransition", {
        get: function () {
            return this._sideDrawerTransition;
        },
        enumerable: true,
        configurable: true
    });
    /* ***********************************************************
    * According to guidelines, if you have a drawer on your page, you should always
    * have a button that opens it. Use the showDrawer() function to open the app drawer section.
    *************************************************************/
    HomeComponent.prototype.onDrawerButtonTap = function () {
        this.drawerComponent.sideDrawer.showDrawer();
    };
    HomeComponent.prototype.testPayloadEncoding = function () {
        var _this = this;
        this.payloadWorkerStatus = 'started';
        vortexjs_1.Payload.setWorkerDelegate(new index_nativescript_1.PayloadDelegateNs());
        var payload = new vortexjs_1.Payload();
        payload.toVortexMsg()
            .then(function (vortexMsg) {
            _this.payloadWorkerStatus = 'encoded';
            return vortexjs_1.Payload.fromVortexMsg(vortexMsg)
                .then(function (vortexMsg) {
                _this.payloadWorkerStatus = "SUCCESS";
            });
        })
            .catch(function (err) {
            _this.payloadWorkerStatus = "Failed : \n" + err;
        });
    };
    __decorate([
        core_1.ViewChild("drawer"),
        __metadata("design:type", angular_1.RadSideDrawerComponent)
    ], HomeComponent.prototype, "drawerComponent", void 0);
    HomeComponent = __decorate([
        core_1.Component({
            selector: "Home",
            moduleId: module.id,
            templateUrl: "./home.component.html"
        })
    ], HomeComponent);
    return HomeComponent;
}());
exports.HomeComponent = HomeComponent;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaG9tZS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJob21lLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHNDQUE2RDtBQUM3RCw2REFBOEY7QUFDOUYsa0VBQWdGO0FBRWhGLDRDQUE0QztBQUM1Qyx3Q0FBc0M7QUFDdEMscUVBQW1FO0FBT25FO0lBTEE7UUFNSSx3QkFBbUIsR0FBRyxNQUFNLENBQUM7SUFpRGpDLENBQUM7SUF2Q0c7O2tFQUU4RDtJQUM5RCxnQ0FBUSxHQUFSO1FBQ0ksSUFBSSxDQUFDLHFCQUFxQixHQUFHLElBQUksbUNBQXNCLEVBQUUsQ0FBQztJQUM5RCxDQUFDO0lBRUQsc0JBQUksK0NBQW9CO2FBQXhCO1lBQ0ksTUFBTSxDQUFDLElBQUksQ0FBQyxxQkFBcUIsQ0FBQztRQUN0QyxDQUFDOzs7T0FBQTtJQUVEOzs7a0VBRzhEO0lBQzlELHlDQUFpQixHQUFqQjtRQUNJLElBQUksQ0FBQyxlQUFlLENBQUMsVUFBVSxDQUFDLFVBQVUsRUFBRSxDQUFDO0lBQ2pELENBQUM7SUFFRCwyQ0FBbUIsR0FBbkI7UUFBQSxpQkFrQkM7UUFqQkcsSUFBSSxDQUFDLG1CQUFtQixHQUFHLFNBQVMsQ0FBQztRQUNyQyxrQkFBTyxDQUFDLGlCQUFpQixDQUFDLElBQUksc0NBQWlCLEVBQUUsQ0FBQyxDQUFDO1FBRW5ELElBQUksT0FBTyxHQUFHLElBQUksa0JBQU8sRUFBRSxDQUFDO1FBRTVCLE9BQU8sQ0FBQyxXQUFXLEVBQUU7YUFDaEIsSUFBSSxDQUFDLFVBQUMsU0FBUztZQUNaLEtBQUksQ0FBQyxtQkFBbUIsR0FBRyxTQUFTLENBQUM7WUFDckMsTUFBTSxDQUFDLGtCQUFPLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQztpQkFDbEMsSUFBSSxDQUFDLFVBQUMsU0FBUztnQkFDWixLQUFJLENBQUMsbUJBQW1CLEdBQUcsU0FBUyxDQUFDO1lBQ3pDLENBQUMsQ0FBQyxDQUFDO1FBQ1gsQ0FBQyxDQUFDO2FBQ0QsS0FBSyxDQUFDLFVBQUMsR0FBRztZQUNQLEtBQUksQ0FBQyxtQkFBbUIsR0FBRyxnQkFBYyxHQUFLLENBQUM7UUFDbkQsQ0FBQyxDQUFDLENBQUM7SUFFWCxDQUFDO0lBekNvQjtRQUFwQixnQkFBUyxDQUFDLFFBQVEsQ0FBQztrQ0FBa0IsZ0NBQXNCOzBEQUFDO0lBUHBELGFBQWE7UUFMekIsZ0JBQVMsQ0FBQztZQUNQLFFBQVEsRUFBRSxNQUFNO1lBQ2hCLFFBQVEsRUFBRSxNQUFNLENBQUMsRUFBRTtZQUNuQixXQUFXLEVBQUUsdUJBQXVCO1NBQ3ZDLENBQUM7T0FDVyxhQUFhLENBa0R6QjtJQUFELG9CQUFDO0NBQUEsQUFsREQsSUFrREM7QUFsRFksc0NBQWEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQsIE9uSW5pdCwgVmlld0NoaWxkIH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcbmltcG9ydCB7IERyYXdlclRyYW5zaXRpb25CYXNlLCBTbGlkZUluT25Ub3BUcmFuc2l0aW9uIH0gZnJvbSBcIm5hdGl2ZXNjcmlwdC1wcm8tdWkvc2lkZWRyYXdlclwiO1xuaW1wb3J0IHsgUmFkU2lkZURyYXdlckNvbXBvbmVudCB9IGZyb20gXCJuYXRpdmVzY3JpcHQtcHJvLXVpL3NpZGVkcmF3ZXIvYW5ndWxhclwiO1xuXG4vLyBFbmFibGUgdGhlIHVzZSBvZiB3b3JrZXJzIGZvciB0aGUgcGF5bG9hZFxuaW1wb3J0IHsgUGF5bG9hZCB9IGZyb20gXCIuLi92b3J0ZXhqc1wiO1xuaW1wb3J0IHsgUGF5bG9hZERlbGVnYXRlTnMgfSBmcm9tIFwiLi4vdm9ydGV4anMvaW5kZXgtbmF0aXZlc2NyaXB0XCI7XG5cbkBDb21wb25lbnQoe1xuICAgIHNlbGVjdG9yOiBcIkhvbWVcIixcbiAgICBtb2R1bGVJZDogbW9kdWxlLmlkLFxuICAgIHRlbXBsYXRlVXJsOiBcIi4vaG9tZS5jb21wb25lbnQuaHRtbFwiXG59KVxuZXhwb3J0IGNsYXNzIEhvbWVDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xuICAgIHBheWxvYWRXb3JrZXJTdGF0dXMgPSAnaWRsZSc7XG5cbiAgICAvKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICogVXNlIHRoZSBAVmlld0NoaWxkIGRlY29yYXRvciB0byBnZXQgYSByZWZlcmVuY2UgdG8gdGhlIGRyYXdlciBjb21wb25lbnQuXG4gICAgKiBJdCBpcyB1c2VkIGluIHRoZSBcIm9uRHJhd2VyQnV0dG9uVGFwXCIgZnVuY3Rpb24gYmVsb3cgdG8gbWFuaXB1bGF0ZSB0aGUgZHJhd2VyLlxuICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4gICAgQFZpZXdDaGlsZChcImRyYXdlclwiKSBkcmF3ZXJDb21wb25lbnQ6IFJhZFNpZGVEcmF3ZXJDb21wb25lbnQ7XG5cbiAgICBwcml2YXRlIF9zaWRlRHJhd2VyVHJhbnNpdGlvbjogRHJhd2VyVHJhbnNpdGlvbkJhc2U7XG5cbiAgICAvKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICogVXNlIHRoZSBzaWRlRHJhd2VyVHJhbnNpdGlvbiBwcm9wZXJ0eSB0byBjaGFuZ2UgdGhlIG9wZW4vY2xvc2UgYW5pbWF0aW9uIG9mIHRoZSBkcmF3ZXIuXG4gICAgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbiAgICBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5fc2lkZURyYXdlclRyYW5zaXRpb24gPSBuZXcgU2xpZGVJbk9uVG9wVHJhbnNpdGlvbigpO1xuICAgIH1cblxuICAgIGdldCBzaWRlRHJhd2VyVHJhbnNpdGlvbigpOiBEcmF3ZXJUcmFuc2l0aW9uQmFzZSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9zaWRlRHJhd2VyVHJhbnNpdGlvbjtcbiAgICB9XG5cbiAgICAvKiAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAgICogQWNjb3JkaW5nIHRvIGd1aWRlbGluZXMsIGlmIHlvdSBoYXZlIGEgZHJhd2VyIG9uIHlvdXIgcGFnZSwgeW91IHNob3VsZCBhbHdheXNcbiAgICAqIGhhdmUgYSBidXR0b24gdGhhdCBvcGVucyBpdC4gVXNlIHRoZSBzaG93RHJhd2VyKCkgZnVuY3Rpb24gdG8gb3BlbiB0aGUgYXBwIGRyYXdlciBzZWN0aW9uLlxuICAgICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4gICAgb25EcmF3ZXJCdXR0b25UYXAoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuZHJhd2VyQ29tcG9uZW50LnNpZGVEcmF3ZXIuc2hvd0RyYXdlcigpO1xuICAgIH1cblxuICAgIHRlc3RQYXlsb2FkRW5jb2RpbmcoKTogdm9pZCB7XG4gICAgICAgIHRoaXMucGF5bG9hZFdvcmtlclN0YXR1cyA9ICdzdGFydGVkJztcbiAgICAgICAgUGF5bG9hZC5zZXRXb3JrZXJEZWxlZ2F0ZShuZXcgUGF5bG9hZERlbGVnYXRlTnMoKSk7XG5cbiAgICAgICAgbGV0IHBheWxvYWQgPSBuZXcgUGF5bG9hZCgpO1xuXG4gICAgICAgIHBheWxvYWQudG9Wb3J0ZXhNc2coKVxuICAgICAgICAgICAgLnRoZW4oKHZvcnRleE1zZykgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMucGF5bG9hZFdvcmtlclN0YXR1cyA9ICdlbmNvZGVkJztcbiAgICAgICAgICAgICAgICByZXR1cm4gUGF5bG9hZC5mcm9tVm9ydGV4TXNnKHZvcnRleE1zZylcbiAgICAgICAgICAgICAgICAgICAgLnRoZW4oKHZvcnRleE1zZykgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5wYXlsb2FkV29ya2VyU3RhdHVzID0gXCJTVUNDRVNTXCI7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIC5jYXRjaCgoZXJyKSA9PiB7XG4gICAgICAgICAgICAgICAgdGhpcy5wYXlsb2FkV29ya2VyU3RhdHVzID0gYEZhaWxlZCA6IFxcbiR7ZXJyfWA7XG4gICAgICAgICAgICB9KTtcblxuICAgIH1cblxufVxuIl19