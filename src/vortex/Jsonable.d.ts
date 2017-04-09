import SerialiseUtil from "./SerialiseUtil";
import "./UtilString";
/**
 * ############################################################################### #
 * JSON Serialisation functions
 * ###############################################################################
 */
export default class Jsonable extends SerialiseUtil {
    protected _tupleType: string;
    static readonly JSON_CLASS_TYPE: string;
    private static readonly JSON_TUPLE_TYPE;
    private static readonly JSON_FIELD_TYPE;
    private static readonly JSON_FIELD_DATA;
    constructor();
    _fieldNames(): any[];
    equals(other: any): boolean;
    toJsonDict(): {};
    fromJsonDict(jsonDict: {}): any;
    toJsonField(value: any, jsonDict?: {} | null, name?: string | null): any;
    fromJsonField(value: any, valueType?: string): any;
}
