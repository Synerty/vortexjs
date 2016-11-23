/*
 * ###############################################################################
 * Common Serialisation functions
 * ###############################################################################
 */

import {dictKeysFromObject} from "./UtilMisc";


export default class SerialiseUtil {

    public static readonly T_RAPUI_TUPLE = "rt";
    public static readonly T_RAPUI_PAYLOAD = "rp";
    public static readonly T_GENERIC_CLASS = "gen"; // NOT SUPPORTED
    public static readonly T_FLOAT = "float";
    public static readonly T_INT = "int";
    public static readonly T_STR = "str";
    public static readonly T_BYTES = "bytes";
    public static readonly T_BOOL = "bool";
    public static readonly T_DATETIME = "datetime";
    public static readonly T_DICT = "dict";
    public static readonly T_LIST = "list";

    public static readonly V_NULL = "null";
    public static readonly V_TRUE = "1";
    public static readonly V_FALSE = "0";

    public static readonly ISO8601 = "%Y-%m-%d %H:%M:%S.%f";


    protected __rapuiSerialiseType__: string;

    toStr(obj: any): string {
        let self = this;

        if (obj instanceof Date)
            return obj.toISOString().replace("T", " ").replace("Z", "");

        if (obj.constructor === Boolean)
            return obj ? SerialiseUtil.V_TRUE : SerialiseUtil.V_FALSE;

        if (obj.constructor === String)
            return obj;

        return obj.toString();
    }

    fromStr(val: string, typeName: string): any {
        let self = this;

        if (typeName === SerialiseUtil.T_STR)
            return val;

        if (typeName === SerialiseUtil.T_BOOL)
            return val === SerialiseUtil.V_TRUE;

        if (typeName === SerialiseUtil.T_FLOAT || typeName === SerialiseUtil.T_INT)
            return parseFloat(val);

        if (typeName === SerialiseUtil.T_DATETIME)
            return new Date(val.replace(" ", "T") + "Z");

        alert("fromStr - UNKNOWN TYPE");
    }

    toRapuiType(value: any): string {
        let self = this;

        let TupleMod = require("./Tuple");
        let PayloadMod = require("./Payload");

        if (value instanceof TupleMod.Tuple)
            return SerialiseUtil.T_RAPUI_TUPLE;

        if (value instanceof PayloadMod.default)
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
    }


    rapuiEquals(obj1: any, obj2: any,
                obj1FieldNames: string[],
                obj2FieldNames: string[]): boolean {
        let self = this;

        let fieldNames1: string[] = obj1FieldNames;
        fieldNames1.sort();

        let fieldNames2: string[] = obj2FieldNames;
        fieldNames2.sort();

        if (!fieldNames1.equals(fieldNames2))
            return false;

        // Create the <items> base element
        for (let fieldIndex = 0; fieldIndex < fieldNames1.length; ++fieldIndex) {
            let name = fieldNames1[fieldIndex];
            let field1 = obj1[name];
            let field2 = obj2[name];

            if (field1 === undefined && field2 === undefined)
                continue;
            else if (field1 === undefined || field2 === undefined)
                return false;

            let type1 = self.toRapuiType(field1);
            let type2 = self.toRapuiType(field2);

            if (type1 !== type2)
                return false;

            if (type1 === SerialiseUtil.T_RAPUI_TUPLE
                || type1 === SerialiseUtil.T_RAPUI_PAYLOAD) {
                if (!field1.equals(field2))
                    return false;

            } else if (type1 === SerialiseUtil.T_LIST) {
                let indexes = [];
                for (let index = 0; index < field1.length; index++) {
                    indexes.push(index);
                }

                let isEqual = self.rapuiEquals(field1, field2, indexes, indexes);
                if (!isEqual)
                    return false;

            } else if (type1 === SerialiseUtil.T_DICT) {
                let isEqual = self.rapuiEquals(field1, field2,
                    dictKeysFromObject(field1),
                    dictKeysFromObject(field2));
                if (!isEqual)
                    return false;

            } else if (type1 === SerialiseUtil.T_DATETIME) {
                if (field1.getTime() !== field2.getTime())
                    return false;

            } else {
                if (field1 !== field2)
                    return false;

            }
        }

        return true;
    }
}
