"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const SPECIAL_CHARS_REGEXP = /(?:^\w|[A-Z]|\b\w)/g;
class Tools {
    static getAbsoultePath(p) {
        return path.resolve(process.cwd(), p);
    }
}
Tools.camelCase = function (name) {
    return name.replace(SPECIAL_CHARS_REGEXP, function (letter, index) {
        return letter.toUpperCase();
    }).replace(/\-/g, '');
};
exports.default = Tools;
