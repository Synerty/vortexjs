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
//# sourceMappingURL=/Users/jchesney/project/vortexjs/src/vortex/UtilMisc.js.map