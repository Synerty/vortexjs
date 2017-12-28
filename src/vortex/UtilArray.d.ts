interface Array<T> {
    diff(a: Array<T>): Array<T>;
    intersect(a: Array<T>): Array<T>;
    remove(a: Array<T> | T): Array<T>;
    add(a: Array<T> | T): Array<T>;
    equals(array: Array<T> | null): boolean;
    bubbleSort(compFunc: (left: T, right: T) => number): Array<T>;
    indexOf(item: T): number;
}
