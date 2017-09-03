"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tools_1 = require("../utils/tools");
const defaults = {
    page: 'src/pages',
    router: 'src/router'
};
class ConfigLoader {
    constructor(p) {
        this.loadConfig(p);
    }
    loadConfig(p = 'vpg.rc.js') {
        let configPath = tools_1.default.getAbsoultePath(p);
        let config = require(configPath);
        config = Object.assign(defaults, config);
        for (let i in config) {
            config[i] = tools_1.default.getAbsoultePath(config[i]);
        }
        this.config = config;
    }
}
exports.ConfigLoader = ConfigLoader;
