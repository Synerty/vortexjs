/**
 * Created by Jarrod Chesney / Synerty on 22/11/16.
 */
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
export declare function dictKeysFromObject(obj: {}, includeUnderscore?: boolean): string[];
export declare class AssertException {
    message: string;
    constructor(message: string);
    toString(): string;
}
/**
 * A simple assert statement
 * @param exp : The boolean to assert
 * @param message : The message to log when the assertion fails.
 */
export declare function assert(exp: boolean, message?: string | null): null;
/**
 * Create url encoded arguments
 *
 * @param filter : The object containing the key:value pairs to convert into a url
 *
 */
export declare function getFiltStr(filter: {}): string;
/**
 * Date String
 *
 * @return A date and time formatted to a string for log messages.
 */
export declare function dateStr(): string;
/**
 * Bind a function
 * @param obj : The object to bind the function for.
 * @param method : The method to bind onto to the object.
 *
 * @return A callable function that will call the method correctly bound to "this"
 */
export declare function bind(obj: any, method: any): any;
/**
 * Bind a function
 * @param err : The err object to convert to a string.
 *
 * @return A callable function that will call the method correctly bound to "this"
 */
export declare function errToStr(err: any): string;
/** Deep Clone
 * @param data: Deep Clone an entire JSON data structure
 * @param ignoreFieldNames: An array of field names not to copy.
 *
 * @return A clone of the data
 */
export declare function deepCopy(data: any, ignoreFieldNames?: string[] | null): any;
export declare let extend: any;
export declare let deepEqual: any;
export declare let jsonOrderedStringify: any;
