export declare let indexedDB: any;
export declare let IDBTransaction: any;
export declare let IDBKeyRange: any;
export declare function supportsIndexedDb(): boolean;
export declare class IDBException {
    message: string;
    constructor(message: string);
    toString(): string;
}
export declare function addIndexedDbHandlers(request: any, stacktraceFunctor: any): void;
