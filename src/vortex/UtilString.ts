// Declare the TypeScript for Declaration Merging
// https://www.typescriptlang.org/docs/handbook/declaration-merging.html

interface String {
    replaceAll(stringToFind: string, stringToReplace: string): string ;
    format(...args: any[]): string;
    startsWith(str: string): boolean;
    endsWith(str: string): boolean;
    isPrintable(): boolean;
}


if (String.prototype.replaceAll == null) {
    String.prototype.replaceAll = function (stringToFind: string,
                                            stringToReplace: string): string {
        let temp = this;
        while (temp.indexOf(stringToFind) !== -1)
            temp = temp.replace(stringToFind, stringToReplace);
        return temp;
    };
}

if (String.prototype.format == null) {
    String.prototype.format = function () {
        let args = arguments;
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
    String.prototype.startsWith = function (str: string): boolean {
        return this.slice(0, str.length) === str;
    };
}

if (String.prototype.endsWith == null) {
    String.prototype.endsWith = function (pattern: string): boolean {
        let d = this.length - pattern.length;
        return d >= 0 && this.lastIndexOf(pattern) === d;
    };
}

if (String.prototype.isPrintable == null) {
    String.prototype.isPrintable = function (): boolean {
        let re = /^[\x20-\x7e]*$/;
        return re.test(this);
    };
}