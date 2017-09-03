import Tools from '../utils/tools'

export interface Config {
    page: string;
    router: string;
    [index: string]: string;
}

const defaults: Config = {
    page: 'src/pages',
    router: 'src/router'
}

export class ConfigLoader {

    public config: Config;

    constructor(p?: string) {
        this.loadConfig(p)
    }

    private loadConfig(p: string = 'vpg.rc.js') {
        let configPath: string = Tools.getAbsoultePath(p)
        let config: Config = require(configPath)
        
        config = Object.assign(defaults, config)
        for (let i in config) {
            config[i] = Tools.getAbsoultePath(config[i])
        }
        this.config = config
    }
}