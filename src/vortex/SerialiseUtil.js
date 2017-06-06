"use strict";
/*
 * ###############################################################################
 * Common Serialisation functions
 * ###############################################################################
 */
Object.defineProperty(exports, "__esModule", { value: true });
var UtilMisc_1 = require("./UtilMisc");
var moment = require("moment");
var SerialiseUtil = (function () {
    function SerialiseUtil() {
    }
    SerialiseUtil.prototype.toStr = function (obj) {
        var self = this;
        if (obj instanceof Date)
            return obj.toISOString().replace("T", " ").replace("Z", "");
        if (obj.constructor === Boolean)
            return obj ? SerialiseUtil.V_TRUE : SerialiseUtil.V_FALSE;
        if (obj.constructor === String)
            return obj;
        return obj.toString();
    };
    SerialiseUtil.prototype.fromStr = function (val, typeName) {
        var self = this;
        if (typeName === SerialiseUtil.T_STR)
            return val;
        if (typeName === SerialiseUtil.T_BOOL)
            return val === SerialiseUtil.V_TRUE;
        if (typeName === SerialiseUtil.T_FLOAT || typeName === SerialiseUtil.T_INT)
            return parseFloat(val);
        if (typeName === SerialiseUtil.T_DATETIME)
            return moment(val).toDate();
        alert("fromStr - UNKNOWN TYPE");
    };
    SerialiseUtil.prototype.toRapuiType = function (value) {
        var self = this;
        if (value == null)
            return SerialiseUtil.V_NULL;
        var TupleMod = require("./Tuple");
        var PayloadMod = require("./Payload");
        if (value instanceof TupleMod.Tuple)
            return SerialiseUtil.T_RAPUI_TUPLE;
        if (value instanceof PayloadMod.Payload)
            return SerialiseUtil.T_RAPUI_PAYLOAD;
        if (value instanceof Date)
            return SerialiseUtil.T_DATETIME;
        if (value.constructor === Number)
            return SerialiseUtil.T_FLOAT;
        if (value.constructor === String)
            return SerialiseUtil.T_STR;
        if (value.constructor === Boolean)
            return SerialiseUtil.T_BOOL;
        if (value.constructor === Array)
            return SerialiseUtil.T_LIST;
        if (value.constructor === Object)
            return SerialiseUtil.T_DICT;
        alert("toRapuiType - UNKNOWN TYPE");
    };
    SerialiseUtil.prototype.rapuiEquals = function (obj1, obj2, obj1FieldNames, obj2FieldNames) {
        var self = this;
        var fieldNames1 = obj1FieldNames;
        fieldNames1.sort();
        var fieldNames2 = obj2FieldNames;
        fieldNames2.sort();
        if (!fieldNames1.equals(fieldNames2))
            return false;
        // Create the <items> base element
        for (var fieldIndex = 0; fieldIndex < fieldNames1.length; ++fieldIndex) {
            var name_1 = fieldNames1[fieldIndex];
            var field1 = obj1[name_1];
            var field2 = obj2[name_1];
            if (field1 === undefined && field2 === undefined)
                continue;
            else if (field1 === undefined || field2 === undefined)
                return false;
            var type1 = self.toRapuiType(field1);
            var type2 = self.toRapuiType(field2);
            if (type1 !== type2)
                return false;
            if (type1 === SerialiseUtil.T_RAPUI_TUPLE
                || type1 === SerialiseUtil.T_RAPUI_PAYLOAD) {
                if (!field1.equals(field2))
                    return false;
            }
            else if (type1 === SerialiseUtil.T_LIST) {
                var indexes = [];
                for (var index = 0; index < field1.length; index++) {
                    indexes.push(index);
                }
                var isEqual = self.rapuiEquals(field1, field2, indexes, indexes);
                if (!isEqual)
                    return false;
            }
            else if (type1 === SerialiseUtil.T_DICT) {
                var isEqual = self.rapuiEquals(field1, field2, UtilMisc_1.dictKeysFromObject(field1), UtilMisc_1.dictKeysFromObject(field2));
                if (!isEqual)
                    return false;
            }
            else if (type1 === SerialiseUtil.T_DATETIME) {
                if (field1.getTime() !== field2.getTime())
                    return false;
            }
            else {
                if (field1 !== field2)
                    return false;
            }
        }
        return true;
    };
    return SerialiseUtil;
}());
SerialiseUtil.T_RAPUI_TUPLE = "rt";
SerialiseUtil.T_RAPUI_PAYLOAD = "rp";
SerialiseUtil.T_GENERIC_CLASS = "gen"; // NOT SUPPORTED
SerialiseUtil.T_FLOAT = "float";
SerialiseUtil.T_INT = "int";
SerialiseUtil.T_STR = "str";
SerialiseUtil.T_BYTES = "bytes";
SerialiseUtil.T_BOOL = "bool";
SerialiseUtil.T_DATETIME = "datetime";
SerialiseUtil.T_DICT = "dict";
SerialiseUtil.T_LIST = "list";
SerialiseUtil.V_NULL = "null";
SerialiseUtil.V_TRUE = "1";
SerialiseUtil.V_FALSE = "0";
SerialiseUtil.ISO8601 = "%Y-%m-%d %H:%M:%S.%f%z";
exports.default = SerialiseUtil;
//# sourceMappingURL=/home/peek/project/vortexjs/src/vortex/SerialiseUtil.js.map