import SerialiseUtil from "./SerialiseUtil";
import { dictKeysFromObject } from "./UtilMisc";
import "./UtilString";

// Typedef for require
declare let require: any;

/**
 * ############################################################################### #
 * JSON Serialisation functions
 * ###############################################################################
 */
export default class Jsonable extends SerialiseUtil {
    protected _tupleType: string;
    protected _rawJonableFields = null;

    public static readonly JSON_CLASS_TYPE = "_ct";
    // private static readonly JSON_CLASS = "_c";
    private static readonly JSON_TUPLE_TYPE = "_c";
    private static readonly JSON_FIELD_TYPE = "_ft";
    private static readonly JSON_FIELD_DATA = "_fd";

    constructor() {
        super();
        /*
         * Jsonable This class gives simple objects suport for serialising to/from json.
         * It handles Number, String, Array and Date. It doesn't handle more complex
         * structures (hence why Payloads have their own functions to do this)
         */
        let self: Jsonable = this;

        self.__rst = SerialiseUtil.T_GENERIC_CLASS;
    }

    private _isRawJsonableField(name: string): boolean {
        if (name == null || name.length == 0)
            return false;
        if (this._rawJonableFields == null)
            return false;
        return this._rawJonableFields.indexOf(name) != -1;
    }


    _fieldNames() {
        let self = this;

        let keys = [];
        for (let k in self) {
            if (!k.startsWith("_") && self.hasOwnProperty(k))
                keys.push(k);
        }
        return keys;
    }

    equals(other) {
        let self = this;

        return self.rapuiEquals(self, other, self._fieldNames(),
            other._fieldNames());

    }


    toJsonDict() {
        let self = this;

        let jsonDict = {};
        jsonDict[Jsonable.JSON_CLASS_TYPE] = self.__rst;

        if (self._tupleType != null)
            jsonDict[Jsonable.JSON_TUPLE_TYPE] = self._tupleType;

        /* This is in the PY version
         else
         jsonDict[JSON_CLASS] = className(self)
         */

        let fieldNames = self._fieldNames();
        // fieldNames.sort(); // Why?

        // Create the <items> base element
        for (let i = 0; i < fieldNames.length; ++i) {
            let name = fieldNames[i];
            self.toJsonField(self[name], jsonDict, name);
        }

        return jsonDict;
    }


    fromJsonDict(jsonDict: {}): any {
        /*
         * From Json Returns and instance of this object populated with data from the
         * json dict
         *
         */
        let fieldNames = dictKeysFromObject(jsonDict);

        for (let i = 0; i < fieldNames.length; ++i) {
            let name = fieldNames[i];
            if (name.startsWith("_"))
                continue;

            if (this._isRawJsonableField(name))
                this[name] = JSON.parse(jsonDict[name]);
            else
                this[name] = this.fromJsonField(jsonDict[name]);
        }

        // This is only required for unit tests new Tuple().fromJsonDict(..)
        if (jsonDict[Jsonable.JSON_CLASS_TYPE] == SerialiseUtil.T_RAPUI_TUPLE) {
            this._tupleType = jsonDict[Jsonable.JSON_TUPLE_TYPE];
        }

        return this;
    }


    toJsonField(value: any,
        jsonDict: {} | null = null,
        name: string | null = null): any {

        let self = this;

        let convertedValue = null;
        let valueType = value == null
            ? SerialiseUtil.V_NULL
            : self.toRapuiType(value);


        if (this._isRawJsonableField(name)) {
            convertedValue = JSON.stringify(value);

        } else if (valueType === SerialiseUtil.T_RAPUI_TUPLE
            || valueType === SerialiseUtil.T_RAPUI_PAYLOAD) {
            convertedValue = value.toJsonDict();

        } else if (valueType === SerialiseUtil.T_DICT) {
            // Treat these like dicts
            convertedValue = {};
            let keys: string[] = dictKeysFromObject(value);
            for (let keyIndex = 0; keyIndex < keys.length; ++keyIndex) {
                let keyName = keys[keyIndex];
                self.toJsonField(value[keyName], convertedValue, keyName);
            }

        } else if (valueType === SerialiseUtil.T_LIST) {
            convertedValue = [];
            // List
            for (let i = 0; i < value.length; ++i) {
                convertedValue.push(self.toJsonField(value[i]));
            }

        } else if (valueType === SerialiseUtil.T_FLOAT
            || valueType === SerialiseUtil.T_INT
            || valueType === SerialiseUtil.T_BOOL
            || valueType === SerialiseUtil.T_STR) {
            convertedValue = value;

        } else if (valueType === SerialiseUtil.V_NULL) {
            convertedValue = null;

        } else {
            convertedValue = self.toStr(value);

        }

        // Non standard values need a dict to store their value type attributes
        // Create a sub dict that contains the value and type
        let jsonStandardTypes = [SerialiseUtil.T_FLOAT, SerialiseUtil.T_STR,
        SerialiseUtil.T_INT, SerialiseUtil.V_NULL,
        SerialiseUtil.T_BOOL, SerialiseUtil.T_LIST, SerialiseUtil.T_DICT];

        if (jsonStandardTypes.indexOf(valueType) === -1 && !(value instanceof Jsonable)) {
            let typedData = {};
            typedData[Jsonable.JSON_FIELD_TYPE] = valueType;
            typedData[Jsonable.JSON_FIELD_DATA] = convertedValue;
            convertedValue = typedData;
        }


        /* Now assign the value and it's value type if applicable */
        if (name != null && jsonDict != null)
            jsonDict[name] = convertedValue;


        return convertedValue;
    }

    // ----------------------------------------------------------------------------
    fromJsonField(value: any, valueType: string = null) {
        let self = this;
        if (valueType === SerialiseUtil.V_NULL || value == null)
            return null;

        if (valueType === SerialiseUtil.T_INT)
            return value;

        if (value[Jsonable.JSON_CLASS_TYPE] != null)
            valueType = value[Jsonable.JSON_CLASS_TYPE];

        // JSON handles these types natively,
        // if there is no type then these are the right types
        if (valueType == null) {
            valueType = self.toRapuiType(value);
            if ([SerialiseUtil.T_BOOL, SerialiseUtil.T_FLOAT,
            SerialiseUtil.T_INT, SerialiseUtil.T_STR].indexOf(valueType) !== -1)
                return value;
        }

        if (value[Jsonable.JSON_FIELD_TYPE] != null)
            return self.fromJsonField(
                value[Jsonable.JSON_FIELD_DATA],
                value[Jsonable.JSON_FIELD_TYPE]);


        // Tuple
        if (valueType === SerialiseUtil.T_RAPUI_TUPLE) {
            let TupleMod = require("./Tuple");

            let tupleType = value[Jsonable.JSON_TUPLE_TYPE];

            let newTuple = null;
            if (TupleMod.TUPLE_TYPES[tupleType] == null) {
                let Tuple = require("./Tuple");
                newTuple = new TupleMod.Tuple(tupleType);
            } else {
                // Tuples set their own types, don't pass anything to the constructor
                newTuple = new TupleMod.TUPLE_TYPES[tupleType]();
            }

            return newTuple.fromJsonDict(value);

        }

        // Payload
        if (valueType === SerialiseUtil.T_RAPUI_PAYLOAD) {

            let Payload = require("./Payload");
            return new Payload().fromJsonDict(value);
        }

        /* SKIP T_GENERIC_CLASS */


        if (valueType === SerialiseUtil.T_DICT) {
            let restoredDict = {};
            let keys = dictKeysFromObject(value);
            for (let i = 0; i < keys.length; ++i) {
                let subName = keys[i];
                restoredDict[subName] = self.fromJsonField(value[subName]);
            }

            return restoredDict;
        }


        if (valueType === SerialiseUtil.T_LIST) {
            let restoredList = [];
            for (let i = 0; i < value.length; ++i)
                restoredList.push(self.fromJsonField(value[i]));

            return restoredList;
        }

        // Handle single value
        return self.fromStr(value, valueType);
    }

}