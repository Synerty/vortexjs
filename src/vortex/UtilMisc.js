/**
 * Created by Jarrod Chesney / Synerty on 22/11/16.
 */
// ----------------------------------------------------------------------------
/**
 * Keys from Object
 *
 * Extract an array of keys from a json object.
 * This will not include keys starting with an underscore.
 *
 * @param obj : The object to get the keys from.
 * @return A list of keys from the object.
 */
/**
 * Created by Jarrod Chesney / Synerty on 22/11/16.
 */ export function dictKeysFromObject(obj) {
    var keys = [];
    for (var k in obj) {
        if (!k.startsWith("_") && obj.hasOwnProperty(k)) {
            keys.push(k);
        }
    }
    return keys;
}
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
export { AssertException };
/**
 * A simple assert statement
 * @param exp : The boolean to assert
 * @param message : The message to log when the assertion fails.
 */
export function assert(exp, message) {
    if (message === void 0) { message = null; }
    if (exp)
        return;
    console.trace();
    throw new AssertException(message);
}
// ----------------------------------------------------------------------------
/**
 * Create url encoded arguments
 *
 * @param filter : The object containing the key:value pairs to convert into a url
 *
 */
export function getFiltStr(filter) {
    var filtStr = "";
    for (var key in filter) {
        if (!filter.hasOwnProperty(key))
            continue;
        filtStr += (filtStr.length ? "&" : "?") + key + "=" + filter[key];
    }
    return filtStr;
}
// ----------------------------------------------------------------------------
/**
 * Date String
 *
 * @return A date and time formatted to a string for log messages.
 */
export function dateStr() {
    var d = new Date();
    return d.toTimeString().split(" ")[0] + "." + d.getUTCMilliseconds() + ": ";
}
// ----------------------------------------------------------------------------
/**
 * Bind a function
 * @param obj : The object to bind the function for.
 * @param method : The method to bind onto to the object.
 *
 * @return A callable function that will call the method correctly bound to "this"
 */
export function bind(obj, method) {
    return function () {
        return method.apply(obj, arguments);
    };
}
//# sourceMappingURL=/home/peek/project/vortexjs/src/src/vortex/UtilMisc.js.map