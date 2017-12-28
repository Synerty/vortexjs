import { Tuple } from "./Tuple";
export declare class TupleSelector extends Tuple {
    name: string;
    selector: {
        [name: string]: any;
    };
    constructor(name: string, selector: {
        [name: string]: any;
    });
    toOrderedJsonStr(): string;
    static fromJsonStr(jsonStr: string): TupleSelector;
}
