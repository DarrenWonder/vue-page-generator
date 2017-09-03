export interface Config {
    page: string;
    router: string;
    [index: string]: string;
}
export declare class ConfigLoader {
    config: Config;
    constructor(p?: string);
    private loadConfig(p?);
}
