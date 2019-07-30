export interface SortKeyCallableI {
    (object: any): any;
}
export declare function sortText(collection: any[], key?: SortKeyCallableI | string | null): any[];
export declare function sortNumeric(collection: any[], key?: SortKeyCallableI | string | null): any[];
export declare function sortCurrency(collection: any[], key?: SortKeyCallableI | string | null): any[];
export declare function sortDate(collection: any[], key?: SortKeyCallableI | string | null): any[];
