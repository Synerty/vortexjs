function parseCurrency(value) {
    return Number(value.replace(/[^0-9\.\-]+/g, ""))
}

function parseDate(date) {
    if (date.toString()
        .match(/^\d{4}-\d{2}-\d{2}$/g)) {
        date += " 00:00:00"
    }
    
    return Date.parse(date)
}

function compareText(
    a,
    b
) {
    const x = a.toLowerCase()
    const y = b.toLowerCase()
    
    return x > y ? 1 : x < y ? -1 : 0
}

function compareNumeric(
    a,
    b
) {
    return a - b
}

function compareCurrency(
    a,
    b
) {
    return parseCurrency(a) - parseCurrency(b)
}

function compareDate(
    a,
    b
) {
    return parseDate(a) - parseDate(b)
}

function getKey(
    object: any,
    key
): any {
    if (key == null)
        return key
    
    if (typeof key === "function")
        return key(object)
    
    return object[key]
}

export interface SortKeyCallableI {
    (object: any): any;
}

export function sortText(
    collection: any[],
    key: SortKeyCallableI | string | null = null
): any[] {
    return collection.sort((
        a,
        b
    ) => compareText(getKey(a, key), getKey(b, key)))
}

export function sortNumeric(
    collection: any[],
    key: SortKeyCallableI | string | null = null
): any[] {
    return collection.sort((
        a,
        b
    ) => compareNumeric(getKey(a, key), getKey(b, key)))
}

export function sortCurrency(
    collection: any[],
    key: SortKeyCallableI | string | null = null
): any[] {
    return collection.sort((
        a,
        b
    ) => compareCurrency(getKey(a, key), getKey(b, key)))
}

export function sortDate(
    collection: any[],
    key: SortKeyCallableI | string | null = null
): any[] {
    return collection.sort((
        a,
        b
    ) => compareDate(getKey(a, key), getKey(b, key)))
}
