"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function parseCurrency(value) {
    return Number(value.replace(/[^0-9\.\-]+/g, ''));
}
function parseDate(date) {
    if (date.toString().match(/^\d{4}-\d{2}-\d{2}$/g)) {
        date += ' 00:00:00';
    }
    return Date.parse(date);
}
function compareText(a, b) {
    var x = a.toLowerCase();
    var y = b.toLowerCase();
    return x > y ? 1 : x < y ? -1 : 0;
}
function compareNumeric(a, b) {
    return a - b;
}
function compareCurrency(a, b) {
    return parseCurrency(a) - parseCurrency(b);
}
function compareDate(a, b) {
    return parseDate(a) - parseDate(b);
}
function getKey(object, key) {
    if (key == null)
        return key;
    if (typeof key === 'function')
        return key(object);
    return object[key];
}
function sortText(collection, key) {
    if (key === void 0) { key = null; }
    return collection.sort(function (a, b) { return compareText(getKey(a, key), getKey(b, key)); });
}
exports.sortText = sortText;
function sortNumeric(collection, key) {
    if (key === void 0) { key = null; }
    return collection.sort(function (a, b) { return compareNumeric(getKey(a, key), getKey(b, key)); });
}
exports.sortNumeric = sortNumeric;
function sortCurrency(collection, key) {
    if (key === void 0) { key = null; }
    return collection.sort(function (a, b) { return compareCurrency(getKey(a, key), getKey(b, key)); });
}
exports.sortCurrency = sortCurrency;
function sortDate(collection, key) {
    if (key === void 0) { key = null; }
    return collection.sort(function (a, b) { return compareDate(getKey(a, key), getKey(b, key)); });
}
exports.sortDate = sortDate;
//# sourceMappingURL=UtilSort.js.map