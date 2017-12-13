"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var PayloadIO_1 = require("./PayloadIO");
var UtilMisc_1 = require("./UtilMisc");
require("./UtilArray");
var rxjs_1 = require("rxjs"); // Ensure it's included and defined
var PayloadEndpoint = (function () {
    function PayloadEndpoint(component, filter, processLatestOnly) {
        if (processLatestOnly === void 0) { processLatestOnly = false; }
        var _this = this;
        var self = this;
        self._filt = filter;
        self._lastPayloadDate = null;
        self._processLatestOnly = processLatestOnly === true;
        UtilMisc_1.assert(self._filt != null, 'Payload filter is null');
        if (self._filt.key == null) {
            var e = new Error("There is no 'key' in the payload filt                 , There must be one for routing - " + JSON.stringify(self._filt));
            console.log(e);
            throw e;
        }
        PayloadIO_1.payloadIO.add(self);
        // Add auto tear downs for angular scopes
        var subscription = component.onDestroyEvent.subscribe(function () {
            _this.shutdown();
            subscription.unsubscribe();
        });
        this._observable = new rxjs_1.Subject();
    }
    Object.defineProperty(PayloadEndpoint.prototype, "observable", {
        get: function () {
            return this._observable;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Process Payload
     * Check if the payload is meant for us then process it.
     *
     * @return null, or if the function is overloaded, you could return STOP_PROCESSING
     * from PayloadIO, which will tell it to stop processing further endpoints.
     */
    PayloadEndpoint.prototype.process = function (payload) {
        if (!this.checkFilt(this._filt, payload.filt))
            return null;
        if (!this.checkDate(payload))
            return null;
        try {
            this._observable.next(payload);
        }
        catch (e) {
            // NOTE: Observables automatically remove observers when the raise exceptions.
            console.log("ERROR: PayloadEndpoint.process, observable has been removed\n            " + e.toString() + "\n            " + JSON.stringify(payload.filt));
        }
        return null;
    };
    ;
    PayloadEndpoint.prototype.checkFilt = function (leftFilt, rightFilt) {
        for (var _i = 0, _a = UtilMisc_1.dictKeysFromObject(leftFilt, true); _i < _a.length; _i++) {
            var key = _a[_i];
            if (!rightFilt.hasOwnProperty(key))
                return false;
            var left = leftFilt[key];
            var right = rightFilt[key];
            if (typeof left !== typeof right)
                return false;
            // Handle special case for Arrays using our equals method in ArrayUtil
            if (left instanceof Array) {
                if (left.sort().equals(right.sort()))
                    continue;
                else
                    return false;
            }
            // Handle special case for Arrays using our equals method in ArrayUtil
            if (left instanceof Object) {
                if (this.checkFilt(left, right))
                    continue;
                else
                    return false;
            }
            if (left !== right)
                return false;
        }
        return true;
    };
    ;
    PayloadEndpoint.prototype.checkDate = function (payload) {
        if (this._processLatestOnly) {
            if (this._lastPayloadDate == null || this._lastPayloadDate < payload.date)
                this._lastPayloadDate = payload.date;
            else
                return false;
        }
        return true;
    };
    ;
    PayloadEndpoint.prototype.shutdown = function () {
        var self = this;
        PayloadIO_1.payloadIO.remove(self);
        if (this._observable['observers'] != null) {
            for (var _i = 0, _a = this._observable['observers']; _i < _a.length; _i++) {
                var observer = _a[_i];
                observer["unsubscribe"]();
            }
        }
    };
    ;
    return PayloadEndpoint;
}());
exports.PayloadEndpoint = PayloadEndpoint;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUGF5bG9hZEVuZHBvaW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiUGF5bG9hZEVuZHBvaW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEseUNBQXNDO0FBRXRDLHVDQUFzRDtBQUN0RCx1QkFBcUI7QUFFckIsNkJBQTZCLENBQUMsbUNBQW1DO0FBR2pFO0lBT0kseUJBQVksU0FBeUMsRUFDekMsTUFBb0IsRUFDcEIsaUJBQWtDO1FBQWxDLGtDQUFBLEVBQUEseUJBQWtDO1FBRjlDLGlCQTRCQztRQXpCRyxJQUFJLElBQUksR0FBRyxJQUFJLENBQUM7UUFFaEIsSUFBSSxDQUFDLEtBQUssR0FBRyxNQUFNLENBQUM7UUFDcEIsSUFBSSxDQUFDLGdCQUFnQixHQUFHLElBQUksQ0FBQztRQUM3QixJQUFJLENBQUMsa0JBQWtCLEdBQUcsaUJBQWlCLEtBQUssSUFBSSxDQUFDO1FBRXJELGlCQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssSUFBSSxJQUFJLEVBQUUsd0JBQXdCLENBQUMsQ0FBQztRQUVyRCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ3pCLElBQUksQ0FBQyxHQUFHLElBQUksS0FBSyxDQUFDLDZGQUNzQixJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUcsQ0FBQyxDQUFDO1lBQ3RFLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDZixNQUFNLENBQUMsQ0FBQztRQUNaLENBQUM7UUFFRCxxQkFBUyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUVwQix5Q0FBeUM7UUFDekMsSUFBSSxZQUFZLEdBQUcsU0FBUyxDQUFDLGNBQWMsQ0FBQyxTQUFTLENBQUM7WUFDOUMsS0FBSSxDQUFDLFFBQVEsRUFBRSxDQUFDO1lBQ2hCLFlBQVksQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUMvQixDQUFDLENBQ0os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QUksQ0FBQyxnQkFBZ0IsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDO1lBQ3pDLElBQUk7Z0JBQ0EsTUFBTSxDQUFDLEtBQUssQ0FBQztRQUNyQixDQUFDO1FBRUQsTUFBTSxDQUFDLElBQUksQ0FBQztJQUNoQixDQUFDO0lBQUEsQ0FBQztJQUVGLGtDQUFRLEdBQVI7UUFDSSxJQUFJLElBQUksR0FBRyxJQUFJLENBQUM7UUFDaEIscUJBQVMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDdkIsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxXQUFXLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ3hDLEdBQUcsQ0FBQyxDQUFpQixVQUE2QixFQUE3QixLQUFBLElBQUksQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDLEVBQTdCLGNBQTZCLEVBQTdCLElBQTZCO2dCQUE3QyxJQUFJLFFBQVEsU0FBQTtnQkFDYixRQUFRLENBQUMsYUFBYSxDQUFDLEVBQUUsQ0FBQzthQUM3QjtRQUNMLENBQUM7SUFDTCxDQUFDO0lBQUEsQ0FBQztJQUVOLHNCQUFDO0FBQUQsQ0FBQyxBQTVIRCxJQTRIQztBQTVIWSwwQ0FBZSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7cGF5bG9hZElPfSBmcm9tIFwiLi9QYXlsb2FkSU9cIjtcbmltcG9ydCB7SVBheWxvYWRGaWx0LCBQYXlsb2FkfSBmcm9tIFwiLi9QYXlsb2FkXCI7XG5pbXBvcnQge2Fzc2VydCwgZGljdEtleXNGcm9tT2JqZWN0fSBmcm9tIFwiLi9VdGlsTWlzY1wiO1xuaW1wb3J0IFwiLi9VdGlsQXJyYXlcIjtcbmltcG9ydCB7Q29tcG9uZW50TGlmZWN5Y2xlRXZlbnRFbWl0dGVyfSBmcm9tIFwiLi9Db21wb25lbnRMaWZlY3ljbGVFdmVudEVtaXR0ZXJcIjtcbmltcG9ydCB7U3ViamVjdH0gZnJvbSBcInJ4anNcIjsgLy8gRW5zdXJlIGl0J3MgaW5jbHVkZWQgYW5kIGRlZmluZWRcblxuXG5leHBvcnQgY2xhc3MgUGF5bG9hZEVuZHBvaW50IHtcbiAgICBwcml2YXRlIF9vYnNlcnZhYmxlOiBTdWJqZWN0PFBheWxvYWQ+O1xuXG4gICAgcHJpdmF0ZSBfZmlsdDogeyBrZXk6IHN0cmluZyB9O1xuICAgIHByaXZhdGUgX2xhc3RQYXlsb2FkRGF0ZTogRGF0ZSB8IG51bGw7XG4gICAgcHJpdmF0ZSBfcHJvY2Vzc0xhdGVzdE9ubHk6IGJvb2xlYW47XG5cbiAgICBjb25zdHJ1Y3Rvcihjb21wb25lbnQ6IENvbXBvbmVudExpZmVjeWNsZUV2ZW50RW1pdHRlcixcbiAgICAgICAgICAgICAgICBmaWx0ZXI6IElQYXlsb2FkRmlsdCxcbiAgICAgICAgICAgICAgICBwcm9jZXNzTGF0ZXN0T25seTogYm9vbGVhbiA9IGZhbHNlKSB7XG4gICAgICAgIGxldCBzZWxmID0gdGhpcztcblxuICAgICAgICBzZWxmLl9maWx0ID0gZmlsdGVyO1xuICAgICAgICBzZWxmLl9sYXN0UGF5bG9hZERhdGUgPSBudWxsO1xuICAgICAgICBzZWxmLl9wcm9jZXNzTGF0ZXN0T25seSA9IHByb2Nlc3NMYXRlc3RPbmx5ID09PSB0cnVlO1xuXG4gICAgICAgIGFzc2VydChzZWxmLl9maWx0ICE9IG51bGwsICdQYXlsb2FkIGZpbHRlciBpcyBudWxsJyk7XG5cbiAgICAgICAgaWYgKHNlbGYuX2ZpbHQua2V5ID09IG51bGwpIHtcbiAgICAgICAgICAgIGxldCBlID0gbmV3IEVycm9yKGBUaGVyZSBpcyBubyAna2V5JyBpbiB0aGUgcGF5bG9hZCBmaWx0IFxcXG4gICAgICAgICAgICAgICAgLCBUaGVyZSBtdXN0IGJlIG9uZSBmb3Igcm91dGluZyAtICR7SlNPTi5zdHJpbmdpZnkoc2VsZi5fZmlsdCl9YCk7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlKTtcbiAgICAgICAgICAgIHRocm93IGU7XG4gICAgICAgIH1cblxuICAgICAgICBwYXlsb2FkSU8uYWRkKHNlbGYpO1xuXG4gICAgICAgIC8vIEFkZCBhdXRvIHRlYXIgZG93bnMgZm9yIGFuZ3VsYXIgc2NvcGVzXG4gICAgICAgIGxldCBzdWJzY3JpcHRpb24gPSBjb21wb25lbnQub25EZXN0cm95RXZlbnQuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnNodXRkb3duKCk7XG4gICAgICAgICAgICAgICAgc3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG5cbiAgICAgICAgdGhpcy5fb2JzZXJ2YWJsZSA9IG5ldyBTdWJqZWN0PFBheWxvYWQ+KCk7XG4gICAgfVxuXG4gICAgZ2V0IG9ic2VydmFibGUoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9vYnNlcnZhYmxlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFByb2Nlc3MgUGF5bG9hZFxuICAgICAqIENoZWNrIGlmIHRoZSBwYXlsb2FkIGlzIG1lYW50IGZvciB1cyB0aGVuIHByb2Nlc3MgaXQuXG4gICAgICpcbiAgICAgKiBAcmV0dXJuIG51bGwsIG9yIGlmIHRoZSBmdW5jdGlvbiBpcyBvdmVybG9hZGVkLCB5b3UgY291bGQgcmV0dXJuIFNUT1BfUFJPQ0VTU0lOR1xuICAgICAqIGZyb20gUGF5bG9hZElPLCB3aGljaCB3aWxsIHRlbGwgaXQgdG8gc3RvcCBwcm9jZXNzaW5nIGZ1cnRoZXIgZW5kcG9pbnRzLlxuICAgICAqL1xuICAgIHByb2Nlc3MocGF5bG9hZDogUGF5bG9hZCk6IG51bGwgfCBzdHJpbmcge1xuICAgICAgICBpZiAoIXRoaXMuY2hlY2tGaWx0KHRoaXMuX2ZpbHQsIHBheWxvYWQuZmlsdCkpXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcblxuICAgICAgICBpZiAoIXRoaXMuY2hlY2tEYXRlKHBheWxvYWQpKVxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG5cbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHRoaXMuX29ic2VydmFibGUubmV4dChwYXlsb2FkKTtcbiAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgLy8gTk9URTogT2JzZXJ2YWJsZXMgYXV0b21hdGljYWxseSByZW1vdmUgb2JzZXJ2ZXJzIHdoZW4gdGhlIHJhaXNlIGV4Y2VwdGlvbnMuXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhgRVJST1I6IFBheWxvYWRFbmRwb2ludC5wcm9jZXNzLCBvYnNlcnZhYmxlIGhhcyBiZWVuIHJlbW92ZWRcbiAgICAgICAgICAgICR7ZS50b1N0cmluZygpfVxuICAgICAgICAgICAgJHtKU09OLnN0cmluZ2lmeShwYXlsb2FkLmZpbHQpfWApO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfTtcblxuICAgIHByaXZhdGUgY2hlY2tGaWx0KGxlZnRGaWx0LCByaWdodEZpbHQpOiBib29sZWFuIHtcblxuICAgICAgICBmb3IgKGxldCBrZXkgb2YgZGljdEtleXNGcm9tT2JqZWN0KGxlZnRGaWx0LCB0cnVlKSkge1xuICAgICAgICAgICAgaWYgKCFyaWdodEZpbHQuaGFzT3duUHJvcGVydHkoa2V5KSlcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG5cbiAgICAgICAgICAgIGxldCBsZWZ0ID0gbGVmdEZpbHRba2V5XTtcbiAgICAgICAgICAgIGxldCByaWdodCA9IHJpZ2h0RmlsdFtrZXldO1xuXG4gICAgICAgICAgICBpZiAodHlwZW9mIGxlZnQgIT09IHR5cGVvZiByaWdodClcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG5cbiAgICAgICAgICAgIC8vIEhhbmRsZSBzcGVjaWFsIGNhc2UgZm9yIEFycmF5cyB1c2luZyBvdXIgZXF1YWxzIG1ldGhvZCBpbiBBcnJheVV0aWxcbiAgICAgICAgICAgIGlmIChsZWZ0IGluc3RhbmNlb2YgQXJyYXkpIHtcbiAgICAgICAgICAgICAgICBpZiAobGVmdC5zb3J0KCkuZXF1YWxzKHJpZ2h0LnNvcnQoKSkpXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBIYW5kbGUgc3BlY2lhbCBjYXNlIGZvciBBcnJheXMgdXNpbmcgb3VyIGVxdWFscyBtZXRob2QgaW4gQXJyYXlVdGlsXG4gICAgICAgICAgICBpZiAobGVmdCBpbnN0YW5jZW9mIE9iamVjdCkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmNoZWNrRmlsdChsZWZ0LCByaWdodCkpXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAobGVmdCAhPT0gcmlnaHQpXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfTtcblxuICAgIHByaXZhdGUgY2hlY2tEYXRlKHBheWxvYWQpOiBib29sZWFuIHtcblxuICAgICAgICBpZiAodGhpcy5fcHJvY2Vzc0xhdGVzdE9ubHkpIHtcbiAgICAgICAgICAgIGlmICh0aGlzLl9sYXN0UGF5bG9hZERhdGUgPT0gbnVsbCB8fCB0aGlzLl9sYXN0UGF5bG9hZERhdGUgPCBwYXlsb2FkLmRhdGUpXG4gICAgICAgICAgICAgICAgdGhpcy5fbGFzdFBheWxvYWREYXRlID0gcGF5bG9hZC5kYXRlO1xuICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH07XG5cbiAgICBzaHV0ZG93bigpIHtcbiAgICAgICAgbGV0IHNlbGYgPSB0aGlzO1xuICAgICAgICBwYXlsb2FkSU8ucmVtb3ZlKHNlbGYpO1xuICAgICAgICBpZiAodGhpcy5fb2JzZXJ2YWJsZVsnb2JzZXJ2ZXJzJ10gIT0gbnVsbCkge1xuICAgICAgICAgICAgZm9yIChsZXQgb2JzZXJ2ZXIgb2YgdGhpcy5fb2JzZXJ2YWJsZVsnb2JzZXJ2ZXJzJ10pIHtcbiAgICAgICAgICAgICAgICBvYnNlcnZlcltcInVuc3Vic2NyaWJlXCJdKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuXG59XG4iXX0=