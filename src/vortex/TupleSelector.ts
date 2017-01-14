import {jsonOrderedStringify} from "./UtilMisc";
import {Tuple, addTupleType} from "./Tuple";

export interface TupleSelectorJsonI {
    name: string;
    selector: { [name: string]: any };
}

@addTupleType
export class TupleSelector extends Tuple {

    constructor(public name: string,
                public selector: { [name: string]: any }) {
        super("vortex.TupleSelector")

    }

    toOrderedJsonStr(): string {
        return jsonOrderedStringify({
            'name': this.name,
            'selector': this.selector
        });
    }

    static fromJsonStr(jsonStr: string): TupleSelector {
        let args = JSON.parse(jsonStr);
        return new TupleSelector(args.name, args.selector);
    }
}
