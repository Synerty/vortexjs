import { jsonOrderedStringify } from "./UtilMisc"
import { addTupleType, Tuple } from "./exports"

// export interface TupleSelectorJsonI {
//     name: string;
//     selector: { [name: string]: any };
// }

@addTupleType
export class TupleSelector extends Tuple {
    constructor(
        public name: string,
        public selector: any
    ) {
        super("vortex.TupleSelector")
    }
    
    toOrderedJsonStr(): string {
        const fieldJsonDict = this.toJsonField(this.selector)
        return jsonOrderedStringify({
            "name": this.name,
            "selector": fieldJsonDict
        })
    }
    
    static fromJsonStr(jsonStr: string): TupleSelector {
        const data = JSON.parse(jsonStr)
        const newTs = new TupleSelector(data.name, {})
        newTs.selector = newTs.fromJsonField(data.selector)
        return newTs
    }
}
