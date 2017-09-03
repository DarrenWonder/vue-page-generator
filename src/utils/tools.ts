import path = require('path')
const SPECIAL_CHARS_REGEXP = /(?:^\w|[A-Z]|\b\w)/g;

export default class Tools {
    static getAbsoultePath(p: string) {
        return path.resolve(process.cwd(), p)
    }

    static camelCase = function(name: string) {
        return name.replace(SPECIAL_CHARS_REGEXP, function(letter, index) {
            return letter.toUpperCase();
        }).replace(/\-/g, '');
    };
}