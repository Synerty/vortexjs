"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var SerialiseUtil_1 = require("./SerialiseUtil");
var UtilMisc_1 = require("./UtilMisc");
require("./UtilString");
/**
 * ############################################################################### #
 * JSON Serialisation functions
 * ###############################################################################
 */
var Jsonable = (function (_super) {
    __extends(Jsonable, _super);
    function Jsonable() {
        var _this = _super.call(this) || this;
        /*
         * Jsonable This class gives simple objects suport for serialising to/from json.
         * It handles Number, String, Array and Date. It doesn't handle more complex
         * structures (hence why Payloads have their own functions to do this)
         */
        var self = _this;
        self.__isJsonable = true;
        self.__rapuiSerialiseType__ = SerialiseUtil_1.default.T_GENERIC_CLASS;
        return _this;
    }
    Jsonable.prototype._fieldNames = function () {
        var self = this;
        var keys = [];
        for (var k in self) {
            if (!k.startsWith("_") && self.hasOwnProperty(k))
                keys.push(k);
        }
        return keys;
    };
    Jsonable.prototype.equals = function (other) {
        var self = this;
        return self.rapuiEquals(self, other, self._fieldNames(), other._fieldNames());
    };
    Jsonable.prototype.toJsonDict = function () {
        var self = this;
        var jsonDict = {};
        jsonDict[Jsonable.JSON_CLASS_TYPE] = self.__rapuiSerialiseType__;
        if (self._tupleType != null)
            jsonDict[Jsonable.JSON_TUPLE_TYPE] = self._tupleType;
        /* This is in the PY version
         else
         jsonDict[JSON_CLASS] = className(self)
         */
        var fieldNames = self._fieldNames();
        // fieldNames.sort(); // Why?
        // Create the <items> base element
        for (var i = 0; i < fieldNames.length; ++i) {
            var name_1 = fieldNames[i];
            self.toJsonField(self[name_1], jsonDict, name_1);
        }
        return jsonDict;
    };
    Jsonable.prototype.fromJsonDict = function (jsonDict) {
        /*
         * From Json Returns and instance of this object populated with data from the
         * json dict
         *
         */
        var fieldNames = UtilMisc_1.dictKeysFromObject(jsonDict);
        for (var i = 0; i < fieldNames.length; ++i) {
            var name_2 = fieldNames[i];
            if (name_2.startsWith("_"))
                continue;
            this[name_2] = this.fromJsonField(jsonDict[name_2]);
        }
        // This is only required for unit tests new Tuple().fromJsonDict(..)
        if (jsonDict[Jsonable.JSON_CLASS_TYPE] == SerialiseUtil_1.default.T_RAPUI_TUPLE) {
            this._tupleType = jsonDict[Jsonable.JSON_TUPLE_TYPE];
        }
        return this;
    };
    Jsonable.prototype.toJsonField = function (value, jsonDict, name) {
        if (jsonDict === void 0) { jsonDict = null; }
        if (name === void 0) { name = null; }
        var self = this;
        var convertedValue = null;
        var valueType = value == null
            ? SerialiseUtil_1.default.V_NULL
            : self.toRapuiType(value);
        if (valueType === SerialiseUtil_1.default.T_RAPUI_TUPLE
            || valueType === SerialiseUtil_1.default.T_RAPUI_PAYLOAD) {
            convertedValue = value.toJsonDict();
        }
        else if (valueType === SerialiseUtil_1.default.T_DICT) {
            // Treat these like dicts
            convertedValue = {};
            var keys = UtilMisc_1.dictKeysFromObject(value);
            for (var keyIndex = 0; keyIndex < keys.length; ++keyIndex) {
                var keyName = keys[keyIndex];
                self.toJsonField(value[keyName], convertedValue, keyName);
            }
        }
        else if (valueType === SerialiseUtil_1.default.T_LIST) {
            convertedValue = [];
            // List
            for (var i = 0; i < value.length; ++i) {
                convertedValue.push(self.toJsonField(value[i]));
            }
        }
        else if (valueType === SerialiseUtil_1.default.T_FLOAT
            || valueType === SerialiseUtil_1.default.T_INT
            || valueType === SerialiseUtil_1.default.T_BOOL
            || valueType === SerialiseUtil_1.default.T_STR) {
            convertedValue = value;
        }
        else if (valueType === SerialiseUtil_1.default.V_NULL) {
            convertedValue = null;
        }
        else {
            convertedValue = self.toStr(value);
        }
        // Non standard values need a dict to store their value type attributes
        // Create a sub dict that contains the value and type
        var jsonStandardTypes = [SerialiseUtil_1.default.T_FLOAT, SerialiseUtil_1.default.T_STR,
            SerialiseUtil_1.default.T_INT, SerialiseUtil_1.default.V_NULL,
            SerialiseUtil_1.default.T_BOOL, SerialiseUtil_1.default.T_LIST, SerialiseUtil_1.default.T_DICT];
        if (jsonStandardTypes.indexOf(valueType) === -1 && value.__isJsonable !== true) {
            var typedData = {};
            typedData[Jsonable.JSON_FIELD_TYPE] = valueType;
            typedData[Jsonable.JSON_FIELD_DATA] = convertedValue;
            convertedValue = typedData;
        }
        /* Now assign the value and it's value type if applicable */
        if (name != null && jsonDict != null)
            jsonDict[name] = convertedValue;
        return convertedValue;
    };
    // ----------------------------------------------------------------------------
    Jsonable.prototype.fromJsonField = function (value, valueType) {
        if (valueType === void 0) { valueType = null; }
        var self = this;
        if (valueType === SerialiseUtil_1.default.V_NULL || value == null)
            return null;
        if (valueType === SerialiseUtil_1.default.T_INT)
            return value;
        if (value[Jsonable.JSON_CLASS_TYPE] != null)
            valueType = value[Jsonable.JSON_CLASS_TYPE];
        // JSON handles these types natively,
        // if there is no type then these are the right types
        if (valueType == null) {
            valueType = self.toRapuiType(value);
            if ([SerialiseUtil_1.default.T_BOOL, SerialiseUtil_1.default.T_FLOAT,
                SerialiseUtil_1.default.T_INT, SerialiseUtil_1.default.T_STR].indexOf(valueType) !== -1)
                return value;
        }
        if (value[Jsonable.JSON_FIELD_TYPE] != null)
            return self.fromJsonField(value[Jsonable.JSON_FIELD_DATA], value[Jsonable.JSON_FIELD_TYPE]);
        // Tuple
        if (valueType === SerialiseUtil_1.default.T_RAPUI_TUPLE) {
            var TupleMod = require("./Tuple");
            var tupleType = value[Jsonable.JSON_TUPLE_TYPE];
            var newTuple = null;
            if (TupleMod.TUPLE_TYPES[tupleType] == null) {
                var Tuple = require("./Tuple");
                newTuple = new TupleMod.Tuple(tupleType);
            }
            else {
                // Tuples set their own types, don't pass anything to the constructor
                newTuple = new TupleMod.TUPLE_TYPES[tupleType]();
            }
            return newTuple.fromJsonDict(value);
        }
        // Payload
        if (valueType === SerialiseUtil_1.default.T_RAPUI_PAYLOAD) {
            var Payload = require("./Payload");
            return new Payload().fromJsonDict(value);
        }
        /* SKIP T_GENERIC_CLASS */
        if (valueType === SerialiseUtil_1.default.T_DICT) {
            var restoredDict = {};
            var keys = UtilMisc_1.dictKeysFromObject(value);
            for (var i = 0; i < keys.length; ++i) {
                var subName = keys[i];
                restoredDict[subName] = self.fromJsonField(value[subName]);
            }
            return restoredDict;
        }
        if (valueType === SerialiseUtil_1.default.T_LIST) {
            var restoredList = [];
            for (var i = 0; i < value.length; ++i)
                restoredList.push(self.fromJsonField(value[i]));
            return restoredList;
        }
        // Handle single value
        return self.fromStr(value, valueType);
    };
    return Jsonable;
}(SerialiseUtil_1.default));
Jsonable.JSON_CLASS_TYPE = "_ct";
// private static readonly JSON_CLASS = "_c";
Jsonable.JSON_TUPLE_TYPE = "_c";
Jsonable.JSON_FIELD_TYPE = "_ft";
Jsonable.JSON_FIELD_DATA = "_fd";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Jsonable;
