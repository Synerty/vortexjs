/**
 * Created by Jarrod Chesney / Synerty on 22/11/16.
 */

// ----------------------------------------------------------------------------
/**
 * Keys from Object
 *
 * Extract an array of keys from a json object.
 * This will not include keys starting with an underscore.
 *
 * @param obj: The object to get the keys from.
 * @param includeUnderscore: Should keys with underscores be included?
 * @return A list of keys from the object.
 */
export function dictKeysFromObject(
    obj: {},
    includeUnderscore = false
): string[] {
    let keys = []
    for (let k in obj) {
        if ((!k.startsWith("_") || includeUnderscore)
            && obj.hasOwnProperty(k) && typeof k !== "function") {
            keys.push(k)
        }
    }
    return keys
}

// ----------------------------------------------------------------------------

export class AssertException {
    message: string
    
    constructor(message: string) {
        let self = this
        self.message = message
    }
    
    toString(): string {
        let self = this
        return "AssertException: " + self.message
    }
}

/**
 * A simple assert statement
 * @param exp : The boolean to assert
 * @param message : The message to log when the assertion fails.
 */
export function assert(
    exp: boolean,
    message: string | null = null
): null {
    if (exp)
        return
    
    console.trace()
    throw new AssertException(message)
}

// ----------------------------------------------------------------------------

/**
 * Create url encoded arguments
 *
 * @param filter : The object containing the key:value pairs to convert into a url
 *
 */
export function getFiltStr(filter: {}): string {
    let filtStr = ""
    
    for (let key in filter) {
        if (!filter.hasOwnProperty(key))
            continue
        
        filtStr += (filtStr.length ? "&" : "?") + key + "=" + filter[key]
    }
    
    return filtStr
}

// ----------------------------------------------------------------------------

/**
 * Date String
 *
 * @return A date and time formatted to a string for log messages.
 */
export function dateStr(): string {
    let d = new Date()
    return d.toTimeString()
        .split(" ")[0] + "." + d.getUTCMilliseconds() + ": "
}

// ----------------------------------------------------------------------------

/**
 * Bind a function
 * @param obj : The object to bind the function for.
 * @param method : The method to bind onto to the object.
 *
 * @return A callable function that will call the method correctly bound to "this"
 */
export function bind(
    obj: any,
    method: any
): any {
    return function () {
        return method.apply(obj, arguments)
    }
}

// ----------------------------------------------------------------------------

/**
 * Bind a function
 * @param err : The err object to convert to a string.
 *
 * @return A callable function that will call the method correctly bound to "this"
 */
export function errToStr(err: any): string {
    
    if (err.message != null)
        return err.message
    
    try {
        let jsonStr = JSON.stringify(err)
        if (jsonStr != "{}")
            return jsonStr
        
    }
    catch (ignore) {
    }
    
    return err.toString()
}

// ----------------------------------------------------------------------------

interface ignoreDictType {
    [name: string]: any
}

/** Deep Clone
 * @param data: Deep Clone an entire JSON data structure
 * @param ignoreFieldNames: An array of field names not to copy.
 *
 * @return A clone of the data
 */

export function deepCopy(
    data,
    ignoreFieldNames: string[] | null = null
) {
    const dict: ignoreDictType = {}
    if (ignoreFieldNames != null
        && Object.prototype.toString.call(ignoreFieldNames)
            .slice(8, -1) == "Array") {
        for (const fieldName of ignoreFieldNames)
            dict[fieldName] = true
    }
    return _deepCopy(data, dict)
    
}

function _deepCopy(
    data,
    ignoreFieldNames: ignoreDictType
) {
    
    // If the data is null or undefined then we return undefined
    if (data === null || data === undefined)
        return undefined
    
    // Get the data type and store it
    const dataType = Object.prototype.toString.call(data)
        .slice(8, -1)
    
    // DATE
    if (dataType == "Date") {
        const clonedDate = new Date()
        clonedDate.setTime(data.getTime())
        return clonedDate
    }
    
    // OBJECT
    if (dataType == "Object") {
        let copiedObject = {}
        
        for (const key of Object.keys(data)) {
            if (ignoreFieldNames != null && ignoreFieldNames[key] === true)
                continue
            copiedObject[key] = _deepCopy(data[key], ignoreFieldNames)
        }
        
        return copiedObject
    }
    
    // ARRAY
    if (dataType == "Array") {
        let copiedArray = []
        
        for (const item of data)
            copiedArray.push(_deepCopy(item, ignoreFieldNames))
        
        return copiedArray
    }
    
    return data
}

// ----------------------------------------------------------------------------

/* Add a imports for these requires */

export let extend = require("extend")
export let deepEqual = require("deep-equal")

// https://www.npmjs.com/package/json-stable-stringify
export let jsonOrderedStringify = require("json-stable-stringify")


