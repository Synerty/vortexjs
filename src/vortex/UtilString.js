// Declare the TypeScript for Declaration Merging
// https://www.typescriptlang.org/docs/handbook/declaration-merging.html
if (String.prototype.replaceAll == null) {
    String.prototype.replaceAll = function (stringToFind, stringToReplace) {
        var temp = this;
        while (temp.indexOf(stringToFind) !== -1)
            temp = temp.replace(stringToFind, stringToReplace);
        return temp;
    };
}
if (String.prototype.format == null) {
    String.prototype.format = function () {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function (match, num) {
            return typeof args[num] !== "undefined" ? args[num] : match;
        });
    };
}
if (String.prototype.trim == null) {
    String.prototype.trim = function () {
        return String(this).replace(/^\s+|\s+$/g, "");
    };
}
if (String.prototype.startsWith == null) {
    // see below for better implementation!
    String.prototype.startsWith = function (str) {
        return this.slice(0, str.length) === str;
    };
}
if (String.prototype.endsWith == null) {
    String.prototype.endsWith = function (pattern) {
        var d = this.length - pattern.length;
        return d >= 0 && this.lastIndexOf(pattern) === d;
    };
}
if (String.prototype.isPrintable == null) {
    String.prototype.isPrintable = function () {
        var re = /^[\x20-\x7e]*$/;
        return re.test(this);
    };
}
//# sourceMappingURL=/Users/jchesney/dev-peek-util/vortexjs/src/vortex/UtilString.js.map