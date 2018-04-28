export default class SerialiseUtil {
    static readonly T_RAPUI_TUPLE: string;
    static readonly T_RAPUI_PAYLOAD: string;
    static readonly T_RAPUI_PAYLOAD_ENVELOPE: string;
    static readonly T_GENERIC_CLASS: string;
    static readonly T_FLOAT: string;
    static readonly T_INT: string;
    static readonly T_STR: string;
    static readonly T_BYTES: string;
    static readonly T_BOOL: string;
    static readonly T_DATETIME: string;
    static readonly T_DICT: string;
    static readonly T_LIST: string;
    static readonly V_NULL: string;
    static readonly V_TRUE: string;
    static readonly V_FALSE: string;
    static readonly ISO8601_PY: string;
    static readonly ISO8601: string;
    protected __rst: string;
    toStr(obj: any): string;
    fromStr(val: string, typeName: string): any;
    toRapuiType(value: any): string;
    rapuiEquals(obj1: any, obj2: any, obj1FieldNames: string[], obj2FieldNames: string[]): boolean;
}
