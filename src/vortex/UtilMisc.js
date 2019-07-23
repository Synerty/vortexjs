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
        if ((!k.startsWith('_') || includeUnderscore)
            && obj.hasOwnProperty(k) && typeof k !== 'function') {
            keys.push(k);
        }
    }
    return keys;
}
exports.dictKeysFromObject = dictKeysFromObject;
// ----------------------------------------------------------------------------
var AssertException = /** @class */ (function () {
    function AssertException(message) {
        var self = this;
        self.message = message;
    }
    AssertException.prototype.toString = function () {
        var self = this;
        return 'AssertException: ' + self.message;
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
    var filtStr = '';
    for (var key in filter) {
        if (!filter.hasOwnProperty(key))
            continue;
        filtStr += (filtStr.length ? '&' : '?') + key + '=' + filter[key];
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
    return d.toTimeString().split(' ')[0] + '.' + d.getUTCMilliseconds() + ': ';
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
;
/** Deep Clone
 * @param data: Deep Clone an entire JSON data structure
 * @param ignoreFieldNames: An array of field names not to copy.
 *
 * @return A clone of the data
 */
function deepCopy(data, ignoreFieldNames) {
    if (ignoreFieldNames === void 0) { ignoreFieldNames = null; }
    var dict = {};
    if (ignoreFieldNames != null
        && Object.prototype.toString.call(ignoreFieldNames).slice(8, -1) == 'Array') {
        for (var _i = 0, ignoreFieldNames_1 = ignoreFieldNames; _i < ignoreFieldNames_1.length; _i++) {
            var fieldName = ignoreFieldNames_1[_i];
            dict[fieldName] = true;
        }
    }
    return _deepCopy(data, dict);
}
exports.deepCopy = deepCopy;
function _deepCopy(data, ignoreFieldNames) {
    // If the data is null or undefined then we return undefined
    if (data === null || data === undefined)
        return undefined;
    // Get the data type and store it
    var dataType = Object.prototype.toString.call(data).slice(8, -1);
    // DATE
    if (dataType == 'Date') {
        var clonedDate = new Date();
        clonedDate.setTime(data.getTime());
        return clonedDate;
    }
    // OBJECT
    if (dataType == 'Object') {
        var copiedObject = {};
        for (var _i = 0, _a = Object.keys(data); _i < _a.length; _i++) {
            var key = _a[_i];
            if (ignoreFieldNames != null && ignoreFieldNames[key] === true)
                continue;
            copiedObject[key] = _deepCopy(data[key], ignoreFieldNames);
        }
        return copiedObject;
    }
    // ARRAY
    if (dataType == 'Array') {
        var copiedArray = [];
        for (var _b = 0, data_1 = data; _b < data_1.length; _b++) {
            var item = data_1[_b];
            copiedArray.push(_deepCopy(item, ignoreFieldNames));
        }
        return copiedArray;
    }
    return data;
}
;
// ----------------------------------------------------------------------------
/* Add a imports for these requires */
exports.extend = require('extend');
exports.deepEqual = require('deep-equal');
// https://www.npmjs.com/package/json-stable-stringify
exports.jsonOrderedStringify = require('json-stable-stringify');
//# sourceMappingURL=/Users/jchesney/dev-peek-util/vortexjs/src/vortex/UtilMisc.js.map