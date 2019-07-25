export default class SerialiseUtil {
    static readonly T_RAPUI_TUPLE = "rt";
    static readonly T_RAPUI_PAYLOAD = "rp";
    static readonly T_RAPUI_PAYLOAD_ENVELOPE = "rpe";
    static readonly T_GENERIC_CLASS = "gen";
    static readonly T_FLOAT = "float";
    static readonly T_INT = "int";
    static readonly T_STR = "str";
    static readonly T_BYTES = "bytes";
    static readonly T_BOOL = "bool";
    static readonly T_DATETIME = "datetime";
    static readonly T_DICT = "dict";
    static readonly T_LIST = "list";
    static readonly V_NULL = "null";
    static readonly V_TRUE = "1";
    static readonly V_FALSE = "0";
    static readonly ISO8601_PY = "%Y-%m-%d %H:%M:%S.%f%z";
    static readonly ISO8601 = "YYYY-MM-DD HH:mm:ss.SSSSSSZZ";
    protected __rst: string;
    toStr(obj: any): string;
    fromStr(val: string, typeName: string): any;
    toRapuiType(value: any): string;
    rapuiEquals(obj1: any, obj2: any, obj1FieldNames: string[], obj2FieldNames: string[]): boolean;
}
