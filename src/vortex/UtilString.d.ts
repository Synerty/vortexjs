interface String {
    replaceAll(stringToFind: string, stringToReplace: string): string;
    format(...args: any[]): string;
    startsWith(str: string): boolean;
    endsWith(str: string): boolean;
    isPrintable(): boolean;
}
