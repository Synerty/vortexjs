"use strict";
/**
 * Created by Jarrod Chesney / Synerty on 22/11/16.
 */
Object.defineProperty(exports, "__esModule", { value: true });
// ----------------------------------------------------------------------------
/**
 * Keys from Object
 *
 * Extract an array of keys from a json object.
 * This will not include keys starting with an underscore.
 *
 * @param obj: The object to get the keys from.
 * @param includeUnderscore: Should keys with underscores be included?
 * @return A list of keys from the object.
 */
function dictKeysFromObject(obj, includeUnderscore) {
    if (includeUnderscore === void 0) { includeUnderscore = false; }
    var keys = [];
    for (var k in obj) {
        if ((!k.startsWith("_") || includeUnderscore)
            && obj.hasOwnProperty(k) && typeof k !== 'function') {
            keys.push(k);
        }
    }
    return keys;
}
exports.dictKeysFromObject = dictKeysFromObject;
// ----------------------------------------------------------------------------
var AssertException = (function () {
    function AssertException(message) {
        var self = this;
        self.message = message;
    }
    AssertException.prototype.toString = function () {
        var self = this;
        return "AssertException: " + self.message;
    };
    return AssertException;
}());
exports.AssertException = AssertException;
/**
 * A simple assert statement
 * @param exp : The boolean to assert
 * @param message : The message to log when the assertion fails.
 */
function assert(exp, message) {
    if (message === void 0) { message = null; }
    if (exp)
        return;
    console.trace();
    throw new AssertException(message);
}
exports.assert = assert;
// ----------------------------------------------------------------------------
/**
 * Create url encoded arguments
 *
 * @param filter : The object containing the key:value pairs to convert into a url
 *
 */
function getFiltStr(filter) {
    var filtStr = "";
    for (var key in filter) {
        if (!filter.hasOwnProperty(key))
            continue;
        filtStr += (filtStr.length ? "&" : "?") + key + "=" + filter[key];
    }
    return filtStr;
}
exports.getFiltStr = getFiltStr;
// ----------------------------------------------------------------------------
/**
 * Date String
 *
 * @return A date and time formatted to a string for log messages.
 */
function dateStr() {
    var d = new Date();
    return d.toTimeString().split(" ")[0] + "." + d.getUTCMilliseconds() + ": ";
}
exports.dateStr = dateStr;
// ----------------------------------------------------------------------------
/**
 * Bind a function
 * @param obj : The object to bind the function for.
 * @param method : The method to bind onto to the object.
 *
 * @return A callable function that will call the method correctly bound to "this"
 */
function bind(obj, method) {
    return function () {
        return method.apply(obj, arguments);
    };
}
exports.bind = bind;
// ----------------------------------------------------------------------------
/**
 * Bind a function
 * @param err : The err object to convert to a string.
 *
 * @return A callable function that will call the method correctly bound to "this"
 */
function errToStr(err) {
    if (err.message != null)
        return err.message;
    try {
        var jsonStr = JSON.stringify(err);
        if (jsonStr != '{}')
            return jsonStr;
    }
    catch (ignore) {
    }
    return err.toString();
}
exports.errToStr = errToStr;
// ----------------------------------------------------------------------------
/* Add a imports for these requires */
exports.extend = require('extend');
exports.deepEqual = require('deep-equal');
// https://www.npmjs.com/package/json-stable-stringify
exports.jsonOrderedStringify = require('json-stable-stringify');
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiVXRpbE1pc2MuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJVdGlsTWlzYy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7O0dBRUc7O0FBR0gsK0VBQStFO0FBQy9FOzs7Ozs7Ozs7R0FTRztBQUNILDRCQUFtQyxHQUFPLEVBQUUsaUJBQXlCO0lBQXpCLGtDQUFBLEVBQUEseUJBQXlCO0lBQ2pFLElBQUksSUFBSSxHQUFHLEVBQUUsQ0FBQztJQUNkLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDaEIsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLElBQUksaUJBQWlCLENBQUM7ZUFDdEMsR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUMsSUFBSSxPQUFPLENBQUMsS0FBSyxVQUFVLENBQUMsQ0FBQyxDQUFDO1lBQ3RELElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDakIsQ0FBQztJQUNMLENBQUM7SUFDRCxNQUFNLENBQUMsSUFBSSxDQUFDO0FBQ2hCLENBQUM7QUFURCxnREFTQztBQUdELCtFQUErRTtBQUUvRTtJQUdJLHlCQUFZLE9BQWU7UUFDdkIsSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2hCLElBQUksQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDO0lBQzNCLENBQUM7SUFFRCxrQ0FBUSxHQUFSO1FBQ0ksSUFBSSxJQUFJLEdBQUcsSUFBSSxDQUFDO1FBQ2hCLE1BQU0sQ0FBQyxtQkFBbUIsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDO0lBQzlDLENBQUM7SUFDTCxzQkFBQztBQUFELENBQUMsQUFaRCxJQVlDO0FBWlksMENBQWU7QUFjNUI7Ozs7R0FJRztBQUNILGdCQUF1QixHQUFZLEVBQUUsT0FBNkI7SUFBN0Isd0JBQUEsRUFBQSxjQUE2QjtJQUM5RCxFQUFFLENBQUMsQ0FBQyxHQUFHLENBQUM7UUFDSixNQUFNLENBQUM7SUFFWCxPQUFPLENBQUMsS0FBSyxFQUFFLENBQUM7SUFDaEIsTUFBTSxJQUFJLGVBQWUsQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUN2QyxDQUFDO0FBTkQsd0JBTUM7QUFHRCwrRUFBK0U7QUFFL0U7Ozs7O0dBS0c7QUFDSCxvQkFBMkIsTUFBVTtJQUNqQyxJQUFJLE9BQU8sR0FBRyxFQUFFLENBQUM7SUFFakIsR0FBRyxDQUFDLENBQUMsSUFBSSxHQUFHLElBQUksTUFBTSxDQUFDLENBQUMsQ0FBQztRQUNyQixFQUFFLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLENBQUM7WUFDNUIsUUFBUSxDQUFDO1FBRWIsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFDLEdBQUcsR0FBRyxHQUFHLEdBQUcsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDdEUsQ0FBQztJQUVELE1BQU0sQ0FBQyxPQUFPLENBQUM7QUFDbkIsQ0FBQztBQVhELGdDQVdDO0FBR0QsK0VBQStFO0FBRS9FOzs7O0dBSUc7QUFDSDtJQUNJLElBQUksQ0FBQyxHQUFHLElBQUksSUFBSSxFQUFFLENBQUM7SUFDbkIsTUFBTSxDQUFDLENBQUMsQ0FBQyxZQUFZLEVBQUUsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQyxrQkFBa0IsRUFBRSxHQUFHLElBQUksQ0FBQztBQUNoRixDQUFDO0FBSEQsMEJBR0M7QUFHRCwrRUFBK0U7QUFFL0U7Ozs7OztHQU1HO0FBQ0gsY0FBcUIsR0FBUSxFQUFFLE1BQVc7SUFDdEMsTUFBTSxDQUFDO1FBQ0gsTUFBTSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLFNBQVMsQ0FBQyxDQUFDO0lBQ3hDLENBQUMsQ0FBQztBQUNOLENBQUM7QUFKRCxvQkFJQztBQUVELCtFQUErRTtBQUUvRTs7Ozs7R0FLRztBQUNILGtCQUF5QixHQUFRO0lBRTdCLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLElBQUksSUFBSSxDQUFDO1FBQ3BCLE1BQU0sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDO0lBRXZCLElBQUksQ0FBQztRQUNELElBQUksT0FBTyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDbEMsRUFBRSxDQUFDLENBQUMsT0FBTyxJQUFJLElBQUksQ0FBQztZQUNoQixNQUFNLENBQUMsT0FBTyxDQUFDO0lBRXZCLENBQUM7SUFBQyxLQUFLLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0lBQ2xCLENBQUM7SUFFRCxNQUFNLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxDQUFDO0FBQzFCLENBQUM7QUFkRCw0QkFjQztBQUVELCtFQUErRTtBQUUvRSxzQ0FBc0M7QUFFM0IsUUFBQSxNQUFNLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0FBQzNCLFFBQUEsU0FBUyxHQUFHLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUU3QyxzREFBc0Q7QUFDM0MsUUFBQSxvQkFBb0IsR0FBRyxPQUFPLENBQUMsdUJBQXVCLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQ3JlYXRlZCBieSBKYXJyb2QgQ2hlc25leSAvIFN5bmVydHkgb24gMjIvMTEvMTYuXG4gKi9cblxuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4vKipcbiAqIEtleXMgZnJvbSBPYmplY3RcbiAqXG4gKiBFeHRyYWN0IGFuIGFycmF5IG9mIGtleXMgZnJvbSBhIGpzb24gb2JqZWN0LlxuICogVGhpcyB3aWxsIG5vdCBpbmNsdWRlIGtleXMgc3RhcnRpbmcgd2l0aCBhbiB1bmRlcnNjb3JlLlxuICpcbiAqIEBwYXJhbSBvYmo6IFRoZSBvYmplY3QgdG8gZ2V0IHRoZSBrZXlzIGZyb20uXG4gKiBAcGFyYW0gaW5jbHVkZVVuZGVyc2NvcmU6IFNob3VsZCBrZXlzIHdpdGggdW5kZXJzY29yZXMgYmUgaW5jbHVkZWQ/XG4gKiBAcmV0dXJuIEEgbGlzdCBvZiBrZXlzIGZyb20gdGhlIG9iamVjdC5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRpY3RLZXlzRnJvbU9iamVjdChvYmo6IHt9LCBpbmNsdWRlVW5kZXJzY29yZSA9IGZhbHNlKTogc3RyaW5nW10ge1xuICAgIGxldCBrZXlzID0gW107XG4gICAgZm9yIChsZXQgayBpbiBvYmopIHtcbiAgICAgICAgaWYgKCghay5zdGFydHNXaXRoKFwiX1wiKSB8fCBpbmNsdWRlVW5kZXJzY29yZSlcbiAgICAgICAgICAgICYmIG9iai5oYXNPd25Qcm9wZXJ0eShrKSAmJiB0eXBlb2YgayAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAga2V5cy5wdXNoKGspO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBrZXlzO1xufVxuXG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuZXhwb3J0IGNsYXNzIEFzc2VydEV4Y2VwdGlvbiB7XG4gICAgbWVzc2FnZTogc3RyaW5nO1xuXG4gICAgY29uc3RydWN0b3IobWVzc2FnZTogc3RyaW5nKSB7XG4gICAgICAgIGxldCBzZWxmID0gdGhpcztcbiAgICAgICAgc2VsZi5tZXNzYWdlID0gbWVzc2FnZTtcbiAgICB9XG5cbiAgICB0b1N0cmluZygpOiBzdHJpbmcge1xuICAgICAgICBsZXQgc2VsZiA9IHRoaXM7XG4gICAgICAgIHJldHVybiBcIkFzc2VydEV4Y2VwdGlvbjogXCIgKyBzZWxmLm1lc3NhZ2U7XG4gICAgfVxufVxuXG4vKipcbiAqIEEgc2ltcGxlIGFzc2VydCBzdGF0ZW1lbnRcbiAqIEBwYXJhbSBleHAgOiBUaGUgYm9vbGVhbiB0byBhc3NlcnRcbiAqIEBwYXJhbSBtZXNzYWdlIDogVGhlIG1lc3NhZ2UgdG8gbG9nIHdoZW4gdGhlIGFzc2VydGlvbiBmYWlscy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGFzc2VydChleHA6IGJvb2xlYW4sIG1lc3NhZ2U6IHN0cmluZyB8IG51bGwgPSBudWxsKTogbnVsbCB7XG4gICAgaWYgKGV4cClcbiAgICAgICAgcmV0dXJuO1xuXG4gICAgY29uc29sZS50cmFjZSgpO1xuICAgIHRocm93IG5ldyBBc3NlcnRFeGNlcHRpb24obWVzc2FnZSk7XG59XG5cblxuLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4vKipcbiAqIENyZWF0ZSB1cmwgZW5jb2RlZCBhcmd1bWVudHNcbiAqXG4gKiBAcGFyYW0gZmlsdGVyIDogVGhlIG9iamVjdCBjb250YWluaW5nIHRoZSBrZXk6dmFsdWUgcGFpcnMgdG8gY29udmVydCBpbnRvIGEgdXJsXG4gKlxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0RmlsdFN0cihmaWx0ZXI6IHt9KTogc3RyaW5nIHtcbiAgICBsZXQgZmlsdFN0ciA9IFwiXCI7XG5cbiAgICBmb3IgKGxldCBrZXkgaW4gZmlsdGVyKSB7XG4gICAgICAgIGlmICghZmlsdGVyLmhhc093blByb3BlcnR5KGtleSkpXG4gICAgICAgICAgICBjb250aW51ZTtcblxuICAgICAgICBmaWx0U3RyICs9IChmaWx0U3RyLmxlbmd0aCA/IFwiJlwiIDogXCI/XCIpICsga2V5ICsgXCI9XCIgKyBmaWx0ZXJba2V5XTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmlsdFN0cjtcbn1cblxuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbi8qKlxuICogRGF0ZSBTdHJpbmdcbiAqXG4gKiBAcmV0dXJuIEEgZGF0ZSBhbmQgdGltZSBmb3JtYXR0ZWQgdG8gYSBzdHJpbmcgZm9yIGxvZyBtZXNzYWdlcy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRhdGVTdHIoKTogc3RyaW5nIHtcbiAgICBsZXQgZCA9IG5ldyBEYXRlKCk7XG4gICAgcmV0dXJuIGQudG9UaW1lU3RyaW5nKCkuc3BsaXQoXCIgXCIpWzBdICsgXCIuXCIgKyBkLmdldFVUQ01pbGxpc2Vjb25kcygpICsgXCI6IFwiO1xufVxuXG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuLyoqXG4gKiBCaW5kIGEgZnVuY3Rpb25cbiAqIEBwYXJhbSBvYmogOiBUaGUgb2JqZWN0IHRvIGJpbmQgdGhlIGZ1bmN0aW9uIGZvci5cbiAqIEBwYXJhbSBtZXRob2QgOiBUaGUgbWV0aG9kIHRvIGJpbmQgb250byB0byB0aGUgb2JqZWN0LlxuICpcbiAqIEByZXR1cm4gQSBjYWxsYWJsZSBmdW5jdGlvbiB0aGF0IHdpbGwgY2FsbCB0aGUgbWV0aG9kIGNvcnJlY3RseSBib3VuZCB0byBcInRoaXNcIlxuICovXG5leHBvcnQgZnVuY3Rpb24gYmluZChvYmo6IGFueSwgbWV0aG9kOiBhbnkpOiBhbnkge1xuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiBtZXRob2QuYXBwbHkob2JqLCBhcmd1bWVudHMpO1xuICAgIH07XG59XG5cbi8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cblxuLyoqXG4gKiBCaW5kIGEgZnVuY3Rpb25cbiAqIEBwYXJhbSBlcnIgOiBUaGUgZXJyIG9iamVjdCB0byBjb252ZXJ0IHRvIGEgc3RyaW5nLlxuICpcbiAqIEByZXR1cm4gQSBjYWxsYWJsZSBmdW5jdGlvbiB0aGF0IHdpbGwgY2FsbCB0aGUgbWV0aG9kIGNvcnJlY3RseSBib3VuZCB0byBcInRoaXNcIlxuICovXG5leHBvcnQgZnVuY3Rpb24gZXJyVG9TdHIoZXJyOiBhbnkpOiBzdHJpbmcge1xuXG4gICAgaWYgKGVyci5tZXNzYWdlICE9IG51bGwpXG4gICAgICAgIHJldHVybiBlcnIubWVzc2FnZTtcblxuICAgIHRyeSB7XG4gICAgICAgIGxldCBqc29uU3RyID0gSlNPTi5zdHJpbmdpZnkoZXJyKTtcbiAgICAgICAgaWYgKGpzb25TdHIgIT0gJ3t9JylcbiAgICAgICAgICAgIHJldHVybiBqc29uU3RyO1xuXG4gICAgfSBjYXRjaCAoaWdub3JlKSB7XG4gICAgfVxuXG4gICAgcmV0dXJuIGVyci50b1N0cmluZygpO1xufVxuXG4vLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG5cbi8qIEFkZCBhIGltcG9ydHMgZm9yIHRoZXNlIHJlcXVpcmVzICovXG5cbmV4cG9ydCBsZXQgZXh0ZW5kID0gcmVxdWlyZSgnZXh0ZW5kJyk7XG5leHBvcnQgbGV0IGRlZXBFcXVhbCA9IHJlcXVpcmUoJ2RlZXAtZXF1YWwnKTtcblxuLy8gaHR0cHM6Ly93d3cubnBtanMuY29tL3BhY2thZ2UvanNvbi1zdGFibGUtc3RyaW5naWZ5XG5leHBvcnQgbGV0IGpzb25PcmRlcmVkU3RyaW5naWZ5ID0gcmVxdWlyZSgnanNvbi1zdGFibGUtc3RyaW5naWZ5Jyk7XG5cblxuIl19