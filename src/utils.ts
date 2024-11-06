
import Papa, { ParseResult } from "papaparse";

export const parseCSV = (file: File) => {
    return new Promise<ParseResult<string[]>>((resolve, reject) => {
        Papa.parse(file, {
            complete: (results: ParseResult<string[]>) => {
                resolve(results);
            },
            header: false,
            worker: true,
            dynamicTyping: false,
            error: (e) => {
                reject(e);
            },
        });
    });
};

export const uniqueFilter = (array: any[]) =>
    array.filter((element, index, self) => self.findIndex(e => {
        return Object.keys(e).every(
            key => e[key] === element[key]
        )
    }) === index)

export const escapeForRegex = (input: string): string => {
    return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export const regexUrlFilter = (url: string) => {
    return `^(https?://)${escapeForRegex(url)}(/|$)`
}