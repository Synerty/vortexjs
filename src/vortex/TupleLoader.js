"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var rxjs_1 = require("rxjs");
var Payload_1 = require("./Payload");
var PayloadEndpoint_1 = require("./PayloadEndpoint");
var core_1 = require("@angular/core");
var VortexClientABC_1 = require("./VortexClientABC");
var PayloadFilterKeys_1 = require("./PayloadFilterKeys");
var UtilMisc_1 = require("./UtilMisc");
// ------------------
// Some private structures
var TupleLoaderEventEnum;
(function (TupleLoaderEventEnum) {
    TupleLoaderEventEnum[TupleLoaderEventEnum["Load"] = 0] = "Load";
    TupleLoaderEventEnum[TupleLoaderEventEnum["Save"] = 1] = "Save";
    TupleLoaderEventEnum[TupleLoaderEventEnum["Delete"] = 2] = "Delete";
})(TupleLoaderEventEnum = exports.TupleLoaderEventEnum || (exports.TupleLoaderEventEnum = {}));
/**
 * TupleLoader for Angular2 + Synerty Vortex
 *
 * @param: vortex The vortex instance to send via.
 *
 * @param: component The component to register our events on.
 *
 * @param: filterUpdateCallable A IFilterUpdateCallable callable that returns null
 * or an IPayloadFilter
 *
 * @param: balloonMsg The Ng2BalloonMsgService
 *
 * Manual changes can be triggerd as follows.
 * * "load()"
 * * "save()"
 * * "del()"
 */
var TupleLoader = (function () {
    function TupleLoader(vortex, component, zone, filterUpdateCallable, balloonMsg) {
        if (balloonMsg === void 0) { balloonMsg = null; }
        var _this = this;
        this.vortex = vortex;
        this.component = component;
        this.zone = zone;
        this.balloonMsg = balloonMsg;
        this.lastPayloadFilt = null;
        this.lastTuples = null;
        this.timer = null;
        this.lastPromise = null;
        this.event = new core_1.EventEmitter();
        this.endpoint = null;
        if (filterUpdateCallable instanceof Function) {
            this.filterUpdateCallable = filterUpdateCallable;
        }
        else {
            this.filterUpdateCallable = (function () {
                return filterUpdateCallable;
            });
        }
        // Regiseter for the angular docheck
        var doCheckSub = this.component.doCheckEvent
            .subscribe(function () { return _this.filterChangeCheck(); });
        // Create the observable object
        this._observable = rxjs_1.Observable.create(function (observer) { return _this.observer = observer; });
        // Call subscribe, otherwise the observer is never created, and we can never call
        // next() on it.
        this._observable.subscribe().unsubscribe();
        // Remove all observers when the component is destroyed.
        var onDestroySub = this.component.onDestroyEvent.subscribe(function () {
            if (_this._observable['observers'] != null) {
                for (var _i = 0, _a = _this._observable['observers']; _i < _a.length; _i++) {
                    var observer = _a[_i];
                    observer.unsubscribe();
                }
            }
            doCheckSub.unsubscribe();
            onDestroySub.unsubscribe();
        });
    }
    Object.defineProperty(TupleLoader.prototype, "observable", {
        /**
         * @property: The tuple observable to subscribe to.
         */
        get: function () {
            return this._observable;
        },
        enumerable: true,
        configurable: true
    });
    TupleLoader.prototype.filterChangeCheck = function () {
        var _this = this;
        // Create a copy
        var newFilter = UtilMisc_1.extend({}, this.filterUpdateCallable());
        if (newFilter == null) {
            if (this.endpoint != null) {
                this.endpoint.shutdown();
                this.endpoint = null;
            }
            this.lastTuples = null;
            this.lastPayloadFilt = null;
            return;
        }
        if (this.lastPayloadFilt != null &&
            UtilMisc_1.deepEqual(newFilter, this.lastPayloadFilt, { strict: true })) {
            return;
        }
        this.lastPayloadFilt = newFilter;
        this.endpoint = new PayloadEndpoint_1.PayloadEndpoint(this.component, this.lastPayloadFilt, true);
        this.endpoint.observable.subscribe(function (payload) { return _this.processPayload(payload); });
        this.vortex.send(new Payload_1.Payload(this.lastPayloadFilt));
    };
    /**
     * Load Loads the data from a server
     *
     * @returns: Promise<Payload>, which is called when the load succeeds or fails.
     *
     */
    TupleLoader.prototype.load = function () {
        return this.saveOrLoad(TupleLoaderEventEnum.Load);
    };
    /**
     * Save
     *
     * Collects the data from the form, into the tuple and sends it through the
     * vortex.
     *
     * @param: tuples The tuples to save, if tuples is null, the last loaded tuples will
     * be used.
     *
     * @returns: Promise, which is called when the save succeeds or fails.
     *
     */
    TupleLoader.prototype.save = function (tuples) {
        if (tuples === void 0) { tuples = null; }
        return this.saveOrLoad(TupleLoaderEventEnum.Save, tuples);
    };
    TupleLoader.prototype.saveOrLoad = function (type, tuples) {
        var _this = this;
        if (tuples === void 0) { tuples = null; }
        // I'm not sure if the promise is set straight away, so at least null out
        // the last one.
        this.lastPromise = null;
        // Initialise the promise
        var promise = new Promise(function (resolve, reject) {
            return _this.lastPromise = {
                type: type,
                resolve: resolve,
                reject: reject
            };
        });
        // Check if there is already a load or save in progress
        if (this.setupTimer() !== true) {
            setTimeout(function () {
                _this.lastPromise.reject("Another save or load is still in progress.");
                _this.lastPromise = null;
            }, 0);
            return promise;
        }
        if (type === TupleLoaderEventEnum.Load) {
            // Force a filter update and reload
            this.lastPayloadFilt = null;
            this.filterChangeCheck();
            // If there was no filter update, fail
            if (this.lastPayloadFilt == null) {
                this.lastPromise.reject("There is no payload filter provided, load failed");
                this.lastPromise = null;
                return promise;
            }
        }
        else if (type === TupleLoaderEventEnum.Save
            || type === TupleLoaderEventEnum.Delete) {
            if (tuples != null)
                this.lastTuples = tuples;
            // Check if we have tuples to save.
            if (this.lastTuples == null) {
                this.lastPromise.reject("No tuples to save. " +
                    " Provide one to with the save(tuples) call or load some first " +
                    " with the filterUpdateCallable");
                this.lastPromise = null;
                return promise;
            }
            // Save the tuples
            this.vortex.send(new Payload_1.Payload(this.lastPayloadFilt, this.lastTuples));
        }
        else {
            throw new Error("Type " + type + " is not implemented.");
        }
        // Return the promise
        return promise;
    };
    /**
     * Delete
     *
     * Sends the tuples to the server for it to delete them.
     *
     * @returns :Promise, which is called when the save succeeds or fails.
     *
     */
    TupleLoader.prototype.del = function (tuples) {
        if (tuples === void 0) { tuples = null; }
        // Set the delete key. The server will delete objects with this set.
        this.lastPayloadFilt[PayloadFilterKeys_1.plDeleteKey] = true;
        var promise = this.saveOrLoad(TupleLoaderEventEnum.Delete, tuples);
        // Remove the delete key
        delete this.lastPayloadFilt[PayloadFilterKeys_1.plDeleteKey];
        return promise;
    };
    TupleLoader.prototype.processPayload = function (payload) {
        var _this = this;
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }
        // No result, means this was a load
        if (payload.result == null) {
            try {
                this.event.emit(TupleLoaderEventEnum.Load);
            }
            catch (e) {
                console.log("TupleLoader - Load event emit error");
                console.error(e);
            }
            // Result, means this was a save
        }
        else if (payload.result === true) {
            try {
                if (payload.filt.hasOwnProperty(PayloadFilterKeys_1.plDeleteKey)) {
                    this.event.emit(TupleLoaderEventEnum.Delete);
                }
                else {
                    this.event.emit(TupleLoaderEventEnum.Save);
                }
            }
            catch (e) {
                console.log("TupleLoader - Save/Delete event emit error");
                console.error(e);
            }
            // Else, treat this as a failure
        }
        else {
            if (this.lastPromise) {
                this.lastPromise.reject(payload.result.toString());
                this.lastPromise = null;
            }
            this.balloonMsg && this.balloonMsg.showError(payload.result.toString());
            return;
        }
        if (this.lastPromise) {
            this.lastPromise.resolve(payload);
            this.lastPromise = null;
        }
        this.lastTuples = payload.tuples;
        this.zone.run(function () { return _this.observer.next(payload.tuples); });
    };
    TupleLoader.prototype.resetTimer = function () {
        this.operationTimeout(false);
    };
    TupleLoader.prototype.setupTimer = function () {
        var self = this;
        if (self.timer != null) {
            this.balloonMsg && this.balloonMsg.showWarning("We're already processing a request, Action failed");
            return false;
        }
        self.timer = setTimeout(UtilMisc_1.bind(self, self.operationTimeout), VortexClientABC_1.SERVER_RESPONSE_TIMEOUT);
        return true;
    };
    TupleLoader.prototype.operationTimeout = function (showBaloon) {
        if (showBaloon === void 0) { showBaloon = true; }
        this.timer = null;
        var msg = "The server failed to respond, operaton timed out";
        if (this.lastPromise) {
            msg = this.lastPromise.type + " Failed, Response Timed out";
            this.lastPromise.reject(msg);
            this.lastPromise = null;
        }
        showBaloon && this.balloonMsg && this.balloonMsg.showError(msg);
    };
    return TupleLoader;
}());
exports.TupleLoader = TupleLoader;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVHVwbGVMb2FkZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJUdXBsZUxvYWRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDZCQUEwQztBQUMxQyxxQ0FBZ0Q7QUFDaEQscURBQWtEO0FBQ2xELHNDQUFtRDtBQUVuRCxxREFBMkU7QUFFM0UseURBQWdEO0FBRWhELHVDQUFtRDtBQUduRCxxQkFBcUI7QUFDckIsMEJBQTBCO0FBRTFCLElBQVksb0JBSVg7QUFKRCxXQUFZLG9CQUFvQjtJQUM1QiwrREFBSSxDQUFBO0lBQ0osK0RBQUksQ0FBQTtJQUNKLG1FQUFNLENBQUE7QUFDVixDQUFDLEVBSlcsb0JBQW9CLEdBQXBCLDRCQUFvQixLQUFwQiw0QkFBb0IsUUFJL0I7QUF1QkQ7Ozs7Ozs7Ozs7Ozs7Ozs7R0FnQkc7QUFDSDtJQWtCSSxxQkFBb0IsTUFBdUIsRUFDdkIsU0FBeUMsRUFDekMsSUFBWSxFQUNwQixvQkFBMEQsRUFDbEQsVUFBOEM7UUFBOUMsMkJBQUEsRUFBQSxpQkFBOEM7UUFKbEUsaUJBbUNDO1FBbkNtQixXQUFNLEdBQU4sTUFBTSxDQUFpQjtRQUN2QixjQUFTLEdBQVQsU0FBUyxDQUFnQztRQUN6QyxTQUFJLEdBQUosSUFBSSxDQUFRO1FBRVosZUFBVSxHQUFWLFVBQVUsQ0FBb0M7UUFuQjFELG9CQUFlLEdBQXdCLElBQUksQ0FBQztRQUM1QyxlQUFVLEdBQTJCLElBQUksQ0FBQztRQUUxQyxVQUFLLEdBQWtCLElBQUksQ0FBQztRQUU1QixnQkFBVyxHQUE0QixJQUFJLENBQUM7UUFFcEQsVUFBSyxHQUF1QyxJQUFJLG1CQUFZLEVBQXdCLENBQUM7UUFFN0UsYUFBUSxHQUEyQixJQUFJLENBQUM7UUFZNUMsRUFBRSxDQUFDLENBQUMsb0JBQW9CLFlBQVksUUFBUSxDQUFDLENBQUMsQ0FBQztZQUMzQyxJQUFJLENBQUMsb0JBQW9CLEdBQUcsb0JBQW9CLENBQUM7UUFDckQsQ0FBQztRQUFDLElBQUksQ0FBQyxD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SUFBSSxnQ0FBNkIsQ0FBQztZQUM1RCxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUM3QixJQUFJLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQztRQUM1QixDQUFDO1FBRUQsVUFBVSxJQUFJLElBQUksQ0FBQyxVQUFVLElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDcEUsQ0FBQztJQUNMLGtCQUFDO0FBQUQsQ0FBQyxBQTFSRCxJQTBSQztBQTFSWSxrQ0FBVyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7T2JzZXJ2YWJsZSwgT2JzZXJ2ZXJ9IGZyb20gXCJyeGpzXCI7XG5pbXBvcnQge1BheWxvYWQsIElQYXlsb2FkRmlsdH0gZnJvbSBcIi4vUGF5bG9hZFwiO1xuaW1wb3J0IHtQYXlsb2FkRW5kcG9pbnR9IGZyb20gXCIuL1BheWxvYWRFbmRwb2ludFwiO1xuaW1wb3J0IHtFdmVudEVtaXR0ZXIsIE5nWm9uZX0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcbmltcG9ydCB7Q29tcG9uZW50TGlmZWN5Y2xlRXZlbnRFbWl0dGVyfSBmcm9tIFwiLi9Db21wb25lbnRMaWZlY3ljbGVFdmVudEVtaXR0ZXJcIjtcbmltcG9ydCB7Vm9ydGV4Q2xpZW50QUJDLCBTRVJWRVJfUkVTUE9OU0VfVElNRU9VVH0gZnJvbSBcIi4vVm9ydGV4Q2xpZW50QUJDXCI7XG5pbXBvcnQge1R1cGxlfSBmcm9tIFwiLi9UdXBsZVwiO1xuaW1wb3J0IHtwbERlbGV0ZUtleX0gZnJvbSBcIi4vUGF5bG9hZEZpbHRlcktleXNcIjtcbmltcG9ydCB7TmcyQmFsbG9vbk1zZ1NlcnZpY2V9IGZyb20gXCJAc3luZXJ0eS9uZzItYmFsbG9vbi1tc2dcIjtcbmltcG9ydCB7YmluZCwgZXh0ZW5kLCBkZWVwRXF1YWx9IGZyb20gXCIuL1V0aWxNaXNjXCI7XG5cblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tXG4vLyBTb21lIHByaXZhdGUgc3RydWN0dXJlc1xuXG5leHBvcnQgZW51bSBUdXBsZUxvYWRlckV2ZW50RW51bSB7XG4gICAgTG9hZCxcbiAgICBTYXZlLFxuICAgIERlbGV0ZVxufVxuXG5pbnRlcmZhY2UgSVByb21pc2VDYWxsYmFja3Mge1xuICAgIHR5cGU6IFR1cGxlTG9hZGVyRXZlbnRFbnVtO1xuICAgIHJlc29sdmU6IGFueTtcbiAgICByZWplY3Q6IGFueTtcbn1cblxuLyoqXG4gKiBGaWx0ZXIgVXBkYXRlIGNhbGxhYmxlLlxuICpcbiAqIFRoaXMgd2lsbCBiZSBjYWxsZWQgdG8gcmV0dXJuIGEgcGF5bG9hZCBmaWx0ZXIuXG4gKiBJZiB0aGUgcGF5bG9hZCBmaWx0ZXIgaXMgbnVsbCwgVHVwbGVMb2FkZXIgd2lsbCByZW1vdmUgaXQncyByZWZlcmVuY2UgdG8gb2xkIGRhdGFcbiAqIGFuZCB3YWl0LlxuICpcbiAqIElmIHRoZSBwYXlsb2FkIGZpbHRlciBpcyBub3QgbnVsbCBhbmQgZGlmZmVycyBmcm9tIHRoZSBsYXN0IHBheWxvYWQgZmlsdGVyLCB0aGVcbiAqIFR1cGxlTG9hZGVyIHdpbGwgc2VuZCBhIHJlcXVlc3QgdG8gdGhlIHNlcnZlci4uXG4gKlxuICovXG5leHBvcnQgaW50ZXJmYWNlIElGaWx0ZXJVcGRhdGVDYWxsYWJsZSB7XG4gICAgKCk6IElQYXlsb2FkRmlsdCB8IG51bGw7XG59XG5cbi8qKlxuICogVHVwbGVMb2FkZXIgZm9yIEFuZ3VsYXIyICsgU3luZXJ0eSBWb3J0ZXhcbiAqXG4gKiBAcGFyYW06IHZvcnRleCBUaGUgdm9ydGV4IGluc3RhbmNlIHRvIHNlbmQgdmlhLlxuICpcbiAqIEBwYXJhbTogY29tcG9uZW50IFRoZSBjb21wb25lbnQgdG8gcmVnaXN0ZXIgb3VyIGV2ZW50cyBvbi5cbiAqXG4gKiBAcGFyYW06IGZpbHRlclVwZGF0ZUNhbGxhYmxlIEEgSUZpbHRlclVwZGF0ZUNhbGxhYmxlIGNhbGxhYmxlIHRoYXQgcmV0dXJucyBudWxsXG4gKiBvciBhbiBJUGF5bG9hZEZpbHRlclxuICpcbiAqIEBwYXJhbTogYmFsbG9vbk1zZyBUaGUgTmcyQmFsbG9vbk1zZ1NlcnZpY2VcbiAqXG4gKiBNYW51YWwgY2hhbmdlcyBjYW4gYmUgdHJpZ2dlcmQgYXMgZm9sbG93cy5cbiAqICogXCJsb2FkKClcIlxuICogKiBcInNhdmUoKVwiXG4gKiAqIFwiZGVsKClcIlxuICovXG5leHBvcnQgY2xhc3MgVHVwbGVMb2FkZXIge1xuICAgIHByaXZhdGUgZmlsdGVyVXBkYXRlQ2FsbGFibGU6IElGaWx0ZXJVcGRhdGVDYWxsYWJsZTtcblxuICAgIHByaXZhdGUgbGFzdFBheWxvYWRGaWx0OiBJUGF5bG9hZEZpbHQgfCBudWxsID0gbnVsbDtcbiAgICBwcml2YXRlIGxhc3RUdXBsZXM6IGFueVtdIHwgVHVwbGVbXSB8IG51bGwgPSBudWxsO1xuXG4gICAgcHJpdmF0ZSB0aW1lcjogbnVtYmVyIHwgbnVsbCA9IG51bGw7XG5cbiAgICBwcml2YXRlIGxhc3RQcm9taXNlOiBJUHJvbWlzZUNhbGxiYWNrc3wgbnVsbCA9IG51bGw7XG5cbiAgICBldmVudDogRXZlbnRFbWl0dGVyPFR1cGxlTG9hZGVyRXZlbnRFbnVtPiA9IG5ldyBFdmVudEVtaXR0ZXI8VHVwbGVMb2FkZXJFdmVudEVudW0+KCk7XG5cbiAgICBwcml2YXRlIGVuZHBvaW50OiBQYXlsb2FkRW5kcG9pbnQgfCBudWxsID0gbnVsbDtcblxuICAgIHByaXZhdGUgX29ic2VydmFibGU6IE9ic2VydmFibGU8VHVwbGVbXSB8IGFueVtdPjtcbiAgICBwcml2YXRlIG9ic2VydmVyOiBPYnNlcnZlcjxUdXBsZVtdIHwgYW55W10+O1xuXG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHZvcnRleDogVm9ydGV4Q2xpZW50QUJDLFxuICAgICAgICAgICAgICAgIHByaXZhdGUgY29tcG9uZW50OiBDb21wb25lbnRMaWZlY3ljbGVFdmVudEVtaXR0ZXIsXG4gICAgICAgICAgICAgICAgcHJpdmF0ZSB6b25lOiBOZ1pvbmUsXG4gICAgICAgICAgICAgICAgZmlsdGVyVXBkYXRlQ2FsbGFibGU6IElGaWx0ZXJVcGRhdGVDYWxsYWJsZSB8IElQYXlsb2FkRmlsdCxcbiAgICAgICAgICAgICAgICBwcml2YXRlIGJhbGxvb25Nc2c6IE5nMkJhbGxvb25Nc2dTZXJ2aWNlIHwgbnVsbCA9IG51bGwpIHtcblxuICAgICAgICBpZiAoZmlsdGVyVXBkYXRlQ2FsbGFibGUgaW5zdGFuY2VvZiBGdW5jdGlvbikge1xuICAgICAgICAgICAgdGhpcy5maWx0ZXJVcGRhdGVDYWxsYWJsZSA9IGZpbHRlclVwZGF0ZUNhbGxhYmxlO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5maWx0ZXJVcGRhdGVDYWxsYWJsZSA9ICgoKSA9PiB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZpbHRlclVwZGF0ZUNhbGxhYmxlXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFJlZ2lzZXRlciBmb3IgdGhlIGFuZ3VsYXIgZG9jaGVja1xuICAgICAgICBsZXQgZG9DaGVja1N1YiA9IHRoaXMuY29tcG9uZW50LmRvQ2hlY2tFdmVudFxuICAgICAgICAgICAgLnN1YnNjcmliZSgoKSA9PiB0aGlzLmZpbHRlckNoYW5nZUNoZWNrKCkpO1xuXG4gICAgICAgIC8vIENyZWF0ZSB0aGUgb2JzZXJ2YWJsZSBvYmplY3RcbiAgICAgICAgdGhpcy5fb2JzZXJ2YWJsZSA9IE9ic2VydmFibGUuY3JlYXRlKG9ic2VydmVyID0+IHRoaXMub2JzZXJ2ZXIgPSBvYnNlcnZlcik7XG5cbiAgICAgICAgLy8gQ2FsbCBzdWJzY3JpYmUsIG90aGVyd2lzZSB0aGUgb2JzZXJ2ZXIgaXMgbmV2ZXIgY3JlYXRlZCwgYW5kIHdlIGNhbiBuZXZlciBjYWxsXG4gICAgICAgIC8vIG5leHQoKSBvbiBpdC5cbiAgICAgICAgdGhpcy5fb2JzZXJ2YWJsZS5zdWJzY3JpYmUoKS51bnN1YnNjcmliZSgpO1xuXG4gICAgICAgIC8vIFJlbW92ZSBhbGwgb2JzZXJ2ZXJzIHdoZW4gdGhlIGNvbXBvbmVudCBpcyBkZXN0cm95ZWQuXG4gICAgICAgIGxldCBvbkRlc3Ryb3lTdWIgPSB0aGlzLmNvbXBvbmVudC5vbkRlc3Ryb3lFdmVudC5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICAgICAgaWYgKHRoaXMuX29ic2VydmFibGVbJ29ic2VydmVycyddICE9IG51bGwpIHtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBvYnNlcnZlciBvZiB0aGlzLl9vYnNlcnZhYmxlWydvYnNlcnZlcnMnXSkge1xuICAgICAgICAgICAgICAgICAgICBvYnNlcnZlci51bnN1YnNjcmliZSgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGRvQ2hlY2tTdWIudW5zdWJzY3JpYmUoKTtcbiAgICAgICAgICAgIG9uRGVzdHJveVN1Yi51bnN1YnNjcmliZSgpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcHJvcGVydHk6IFRoZSB0dXBsZSBvYnNlcnZhYmxlIHRvIHN1YnNjcmliZSB0by5cbiAgICAgKi9cbiAgICBnZXQgb2JzZXJ2YWJsZSgpOiBPYnNlcnZhYmxlPFR1cGxlW10gfCBhbnlbXT4ge1xuICAgICAgICByZXR1cm4gdGhpcy5fb2JzZXJ2YWJsZTtcbiAgICB9XG5cbiAgICBmaWx0ZXJDaGFuZ2VDaGVjaygpOiB2b2lkIHtcbiAgICAgICAgLy8gQ3JlYXRlIGEgY29weVxuICAgICAgICBsZXQgbmV3RmlsdGVyID0gZXh0ZW5kKHt9LCB0aGlzLmZpbHRlclVwZGF0ZUNhbGxhYmxlKCkpO1xuXG4gICAgICAgIGlmIChuZXdGaWx0ZXIgPT0gbnVsbCkge1xuICAgICAgICAgICAgaWYgKHRoaXMuZW5kcG9pbnQgIT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHRoaXMuZW5kcG9pbnQuc2h1dGRvd24oKTtcbiAgICAgICAgICAgICAgICB0aGlzLmVuZHBvaW50ID0gbnVsbDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5sYXN0VHVwbGVzID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMubGFzdFBheWxvYWRGaWx0ID0gbnVsbDtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG5cbiAgICAgICAgaWYgKHRoaXMubGFzdFBheWxvYWRGaWx0ICE9IG51bGwgJiZcbiAgICAgICAgICAgIGRlZXBFcXVhbChuZXdGaWx0ZXIsIHRoaXMubGFzdFBheWxvYWRGaWx0LCB7c3RyaWN0OiB0cnVlfSkpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMubGFzdFBheWxvYWRGaWx0ID0gbmV3RmlsdGVyO1xuICAgICAgICB0aGlzLmVuZHBvaW50ID0gbmV3IFBheWxvYWRFbmRwb2ludCh0aGlzLmNvbXBvbmVudCwgdGhpcy5sYXN0UGF5bG9hZEZpbHQsIHRydWUpO1xuICAgICAgICB0aGlzLmVuZHBvaW50Lm9ic2VydmFibGUuc3Vic2NyaWJlKHBheWxvYWQgPT4gdGhpcy5wcm9jZXNzUGF5bG9hZChwYXlsb2FkKSk7XG5cbiAgICAgICAgdGhpcy52b3J0ZXguc2VuZChuZXcgUGF5bG9hZCh0aGlzLmxhc3RQYXlsb2FkRmlsdCkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIExvYWQgTG9hZHMgdGhlIGRhdGEgZnJvbSBhIHNlcnZlclxuICAgICAqXG4gICAgICogQHJldHVybnM6IFByb21pc2U8UGF5bG9hZD4sIHdoaWNoIGlzIGNhbGxlZCB3aGVuIHRoZSBsb2FkIHN1Y2NlZWRzIG9yIGZhaWxzLlxuICAgICAqXG4gICAgICovXG4gICAgbG9hZCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2F2ZU9yTG9hZChUdXBsZUxvYWRlckV2ZW50RW51bS5Mb2FkKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBTYXZlXG4gICAgICpcbiAgICAgKiBDb2xsZWN0cyB0aGUgZGF0YSBmcm9tIHRoZSBmb3JtLCBpbnRvIHRoZSB0dXBsZSBhbmQgc2VuZHMgaXQgdGhyb3VnaCB0aGVcbiAgICAgKiB2b3J0ZXguXG4gICAgICpcbiAgICAgKiBAcGFyYW06IHR1cGxlcyBUaGUgdHVwbGVzIHRvIHNhdmUsIGlmIHR1cGxlcyBpcyBudWxsLCB0aGUgbGFzdCBsb2FkZWQgdHVwbGVzIHdpbGxcbiAgICAgKiBiZSB1c2VkLlxuICAgICAqXG4gICAgICogQHJldHVybnM6IFByb21pc2UsIHdoaWNoIGlzIGNhbGxlZCB3aGVuIHRoZSBzYXZlIHN1Y2NlZWRzIG9yIGZhaWxzLlxuICAgICAqXG4gICAgICovXG4gICAgc2F2ZSh0dXBsZXM6IFR1cGxlW10gfCBhbnlbXSB8IG51bGwgPSBudWxsKTogUHJvbWlzZTxQYXlsb2FkPiB7XG4gICAgICAgIHJldHVybiB0aGlzLnNhdmVPckxvYWQoVHVwbGVMb2FkZXJFdmVudEVudW0uU2F2ZSwgdHVwbGVzKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHNhdmVPckxvYWQodHlwZTogVHVwbGVMb2FkZXJFdmVudEVudW0sXG4gICAgICAgICAgICAgICAgICAgICAgIHR1cGxlczogYW55W10gfCBUdXBsZVtdIHwgbnVsbCA9IG51bGwpOiBQcm9taXNlPFBheWxvYWQ+IHtcblxuICAgICAgICAvLyBJJ20gbm90IHN1cmUgaWYgdGhlIHByb21pc2UgaXMgc2V0IHN0cmFpZ2h0IGF3YXksIHNvIGF0IGxlYXN0IG51bGwgb3V0XG4gICAgICAgIC8vIHRoZSBsYXN0IG9uZS5cbiAgICAgICAgdGhpcy5sYXN0UHJvbWlzZSA9IG51bGw7XG5cbiAgICAgICAgLy8gSW5pdGlhbGlzZSB0aGUgcHJvbWlzZVxuICAgICAgICBsZXQgcHJvbWlzZSA9IG5ldyBQcm9taXNlPFBheWxvYWQ+KChyZXNvbHZlLCByZWplY3QpID0+XG4gICAgICAgICAgICB0aGlzLmxhc3RQcm9taXNlID0ge1xuICAgICAgICAgICAgICAgIHR5cGU6IHR5cGUsXG4gICAgICAgICAgICAgICAgcmVzb2x2ZTogcmVzb2x2ZSxcbiAgICAgICAgICAgICAgICByZWplY3Q6IHJlamVjdFxuICAgICAgICAgICAgfVxuICAgICAgICApO1xuXG4gICAgICAgIC8vIENoZWNrIGlmIHRoZXJlIGlzIGFscmVhZHkgYSBsb2FkIG9yIHNhdmUgaW4gcHJvZ3Jlc3NcbiAgICAgICAgaWYgKHRoaXMuc2V0dXBUaW1lcigpICE9PSB0cnVlKSB7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmxhc3RQcm9taXNlLnJlamVjdChcIkFub3RoZXIgc2F2ZSBvciBsb2FkIGlzIHN0aWxsIGluIHByb2dyZXNzLlwiKTtcbiAgICAgICAgICAgICAgICB0aGlzLmxhc3RQcm9taXNlID0gbnVsbDtcbiAgICAgICAgICAgIH0sIDApO1xuICAgICAgICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodHlwZSA9PT0gVHVwbGVMb2FkZXJFdmVudEVudW0uTG9hZCkge1xuICAgICAgICAgICAgLy8gRm9yY2UgYSBmaWx0ZXIgdXBkYXRlIGFuZCByZWxvYWRcbiAgICAgICAgICAgIHRoaXMubGFzdFBheWxvYWRGaWx0ID0gbnVsbDtcbiAgICAgICAgICAgIHRoaXMuZmlsdGVyQ2hhbmdlQ2hlY2soKTtcblxuICAgICAgICAgICAgLy8gSWYgdGhlcmUgd2FzIG5vIGZpbHRlciB1cGRhdGUsIGZhaWxcbiAgICAgICAgICAgIGlmICh0aGlzLmxhc3RQYXlsb2FkRmlsdCA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5sYXN0UHJvbWlzZS5yZWplY3QoXG4gICAgICAgICAgICAgICAgICAgIFwiVGhlcmUgaXMgbm8gcGF5bG9hZCBmaWx0ZXIgcHJvdmlkZWQsIGxvYWQgZmFpbGVkXCIpO1xuICAgICAgICAgICAgICAgIHRoaXMubGFzdFByb21pc2UgPSBudWxsO1xuICAgICAgICAgICAgICAgIHJldHVybiBwcm9taXNlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gVHVwbGVMb2FkZXJFdmVudEVudW0uU2F2ZVxuICAgICAgICAgICAgfHwgdHlwZSA9PT0gVHVwbGVMb2FkZXJFdmVudEVudW0uRGVsZXRlKSB7XG4gICAgICAgICAgICBpZiAodHVwbGVzICE9IG51bGwpXG4gICAgICAgICAgICAgICAgdGhpcy5sYXN0VHVwbGVzID0gdHVwbGVzO1xuXG4gICAgICAgICAgICAvLyBDaGVjayBpZiB3ZSBoYXZlIHR1cGxlcyB0byBzYXZlLlxuICAgICAgICAgICAgaWYgKHRoaXMubGFzdFR1cGxlcyA9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5sYXN0UHJvbWlzZS5yZWplY3QoXG4gICAgICAgICAgICAgICAgICAgIFwiTm8gdHVwbGVzIHRvIHNhdmUuIFwiICtcbiAgICAgICAgICAgICAgICAgICAgXCIgUHJvdmlkZSBvbmUgdG8gd2l0aCB0aGUgc2F2ZSh0dXBsZXMpIGNhbGwgb3IgbG9hZCBzb21lIGZpcnN0IFwiICtcbiAgICAgICAgICAgICAgICAgICAgXCIgd2l0aCB0aGUgZmlsdGVyVXBkYXRlQ2FsbGFibGVcIik7XG4gICAgICAgICAgICAgICAgdGhpcy5sYXN0UHJvbWlzZSA9IG51bGw7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHByb21pc2U7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFNhdmUgdGhlIHR1cGxlc1xuICAgICAgICAgICAgdGhpcy52b3J0ZXguc2VuZChuZXcgUGF5bG9hZCh0aGlzLmxhc3RQYXlsb2FkRmlsdCwgdGhpcy5sYXN0VHVwbGVzKSk7XG5cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgVHlwZSAke3R5cGV9IGlzIG5vdCBpbXBsZW1lbnRlZC5gKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFJldHVybiB0aGUgcHJvbWlzZVxuICAgICAgICByZXR1cm4gcHJvbWlzZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBEZWxldGVcbiAgICAgKlxuICAgICAqIFNlbmRzIHRoZSB0dXBsZXMgdG8gdGhlIHNlcnZlciBmb3IgaXQgdG8gZGVsZXRlIHRoZW0uXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyA6UHJvbWlzZSwgd2hpY2ggaXMgY2FsbGVkIHdoZW4gdGhlIHNhdmUgc3VjY2VlZHMgb3IgZmFpbHMuXG4gICAgICpcbiAgICAgKi9cbiAgICBkZWwodHVwbGVzOiBhbnlbXSB8IFR1cGxlW10gfCBudWxsID0gbnVsbCk6IFByb21pc2U8UGF5bG9hZD4ge1xuICAgICAgICAvLyBTZXQgdGhlIGRlbGV0ZSBrZXkuIFRoZSBzZXJ2ZXIgd2lsbCBkZWxldGUgb2JqZWN0cyB3aXRoIHRoaXMgc2V0LlxuICAgICAgICB0aGlzLmxhc3RQYXlsb2FkRmlsdFtwbERlbGV0ZUtleV0gPSB0cnVlO1xuXG4gICAgICAgIGxldCBwcm9taXNlID0gdGhpcy5zYXZlT3JMb2FkKFR1cGxlTG9hZGVyRXZlbnRFbnVtLkRlbGV0ZSwgdHVwbGVzKTtcblxuICAgICAgICAvLyBSZW1vdmUgdGhlIGRlbGV0ZSBrZXlcbiAgICAgICAgZGVsZXRlIHRoaXMubGFzdFBheWxvYWRGaWx0W3BsRGVsZXRlS2V5XTtcblxuICAgICAgICByZXR1cm4gcHJvbWlzZTtcblxuICAgIH1cblxuICAgIHByaXZhdGUgcHJvY2Vzc1BheWxvYWQocGF5bG9hZDogUGF5bG9hZCkge1xuXG4gICAgICAgIGlmICh0aGlzLnRpbWVyKSB7XG4gICAgICAgICAgICBjbGVhclRpbWVvdXQodGhpcy50aW1lcik7XG4gICAgICAgICAgICB0aGlzLnRpbWVyID0gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIE5vIHJlc3VsdCwgbWVhbnMgdGhpcyB3YXMgYSBsb2FkXG4gICAgICAgIGlmIChwYXlsb2FkLnJlc3VsdCA9PSBudWxsKSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHRoaXMuZXZlbnQuZW1pdChUdXBsZUxvYWRlckV2ZW50RW51bS5Mb2FkKTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlR1cGxlTG9hZGVyIC0gTG9hZCBldmVudCBlbWl0IGVycm9yXCIpO1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIFJlc3VsdCwgbWVhbnMgdGhpcyB3YXMgYSBzYXZlXG4gICAgICAgIH0gZWxzZSBpZiAocGF5bG9hZC5yZXN1bHQgPT09IHRydWUpIHtcbiAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgaWYgKHBheWxvYWQuZmlsdC5oYXNPd25Qcm9wZXJ0eShwbERlbGV0ZUtleSkpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ldmVudC5lbWl0KFR1cGxlTG9hZGVyRXZlbnRFbnVtLkRlbGV0ZSk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ldmVudC5lbWl0KFR1cGxlTG9hZGVyRXZlbnRFbnVtLlNhdmUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIlR1cGxlTG9hZGVyIC0gU2F2ZS9EZWxldGUgZXZlbnQgZW1pdCBlcnJvclwiKTtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmVycm9yKGUpO1xuICAgICAgICAgICAgfVxuXG5cbiAgICAgICAgICAgIC8vIEVsc2UsIHRyZWF0IHRoaXMgYXMgYSBmYWlsdXJlXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBpZiAodGhpcy5sYXN0UHJvbWlzZSkge1xuICAgICAgICAgICAgICAgIHRoaXMubGFzdFByb21pc2UucmVqZWN0KHBheWxvYWQucmVzdWx0LnRvU3RyaW5nKCkpO1xuICAgICAgICAgICAgICAgIHRoaXMubGFzdFByb21pc2UgPSBudWxsO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLmJhbGxvb25Nc2cgJiYgdGhpcy5iYWxsb29uTXNnLnNob3dFcnJvcihwYXlsb2FkLnJlc3VsdC50b1N0cmluZygpKTtcblxuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMubGFzdFByb21pc2UpIHtcbiAgICAgICAgICAgIHRoaXMubGFzdFByb21pc2UucmVzb2x2ZShwYXlsb2FkKTtcbiAgICAgICAgICAgIHRoaXMubGFzdFByb21pc2UgPSBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5sYXN0VHVwbGVzID0gcGF5bG9hZC50dXBsZXM7XG4gICAgICAgIHRoaXMuem9uZS5ydW4oKCkgPT4gdGhpcy5vYnNlcnZlci5uZXh0KHBheWxvYWQudHVwbGVzKSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSByZXNldFRpbWVyKCk6IHZvaWQge1xuICAgICAgICB0aGlzLm9wZXJhdGlvblRpbWVvdXQoZmFsc2UpO1xuICAgIH1cblxuICAgIHByaXZhdGUgc2V0dXBUaW1lcigpOiBib29sZWFuIHtcbiAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuICAgICAgICBpZiAoc2VsZi50aW1lciAhPSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLmJhbGxvb25Nc2cgJiYgdGhpcy5iYWxsb29uTXNnLnNob3dXYXJuaW5nKFxuICAgICAgICAgICAgICAgIFwiV2UncmUgYWxyZWFkeSBwcm9jZXNzaW5nIGEgcmVxdWVzdCwgQWN0aW9uIGZhaWxlZFwiKTtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHNlbGYudGltZXIgPSBzZXRUaW1lb3V0KGJpbmQoc2VsZiwgc2VsZi5vcGVyYXRpb25UaW1lb3V0KSxcbiAgICAgICAgICAgIFNFUlZFUl9SRVNQT05TRV9USU1FT1VUKTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBvcGVyYXRpb25UaW1lb3V0KHNob3dCYWxvb246IGJvb2xlYW4gPSB0cnVlKTogdm9pZCB7XG4gICAgICAgIHRoaXMudGltZXIgPSBudWxsO1xuXG4gICAgICAgIGxldCBtc2c6IHN0cmluZyA9IFwiVGhlIHNlcnZlciBmYWlsZWQgdG8gcmVzcG9uZCwgb3BlcmF0b24gdGltZWQgb3V0XCI7XG5cbiAgICAgICAgaWYgKHRoaXMubGFzdFByb21pc2UpIHtcbiAgICAgICAgICAgIG1zZyA9IGAke3RoaXMubGFzdFByb21pc2UudHlwZX0gRmFpbGVkLCBSZXNwb25zZSBUaW1lZCBvdXRgO1xuICAgICAgICAgICAgdGhpcy5sYXN0UHJvbWlzZS5yZWplY3QobXNnKTtcbiAgICAgICAgICAgIHRoaXMubGFzdFByb21pc2UgPSBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgc2hvd0JhbG9vbiAmJiB0aGlzLmJhbGxvb25Nc2cgJiYgdGhpcy5iYWxsb29uTXNnLnNob3dFcnJvcihtc2cpO1xuICAgIH1cbn1cblxuIl19