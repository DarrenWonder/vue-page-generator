"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander = require("commander");
const config_loader_1 = require("../utils/config-loader");
const tools_1 = require("../utils/tools");
const fs = require("fs-extra");
const path = require("path");
class Route {
    constructor() {
        this.program = commander;
        this.version = require('../../package.json').version;
        this.initialize();
    }
    initialize() {
        this.program
            .version(this.version)
            .option('-p, --path <path>', '指定路由路径')
            .parse(process.argv);
        if (typeof this.program.path === 'undefined') {
            console.error('需要指定路由');
            process.exit(1);
        }
        this.loader = new config_loader_1.ConfigLoader();
        this.parsePath(this.program.path);
    }
    parsePath(p) {
        const pagePath = `${this.loader.config.page}/${p}`;
        const routerPath = `${this.loader.config.router}/${p.split('/')[0]}`;
        this.generatePage(p, pagePath);
        this.generateRouter(p, routerPath);
    }
    generatePage(p, pagePath) {
        const fileName = tools_1.default.camelCase(path.basename(p)) + '.vue';
        const filePath = pagePath + '/' + fileName;
        this.generateFile(filePath);
        const ps = p.split('/');
        if (ps.length === 1) {
            this.generateFile(`${this.loader.config.page}/${ps[0]}/Index.vue`);
        }
    }
    generateRouter(p, routerPath) {
        const filePath = routerPath + '/index.js';
        const arr = p.split('/');
        fs.pathExists(filePath, function (err, exists) {
            if (!exists) {
                const t = `export default [
]
`;
                fs.ensureFileSync(filePath);
                const ws = fs.createWriteStream(filePath);
                ws.write(t);
            }
            fs.readFile(filePath, 'utf8', (err, data) => {
                if (err)
                    throw err;
                let cPath;
                if (arr.length === 1) {
                    cPath = '';
                }
                else {
                    cPath = arr.slice(1).join('/');
                }
                const component = `pages/${p}/${tools_1.default.camelCase(path.basename(p))}`;
                if (data.indexOf(component) === -1) {
                    let newData;
                    if (/}\n]/.test(data)) {
                        newData = data.replace(/}\n]/, `},
  {
    path: '${cPath}',
    component: () => import('${component}')
  }
]`);
                    }
                    else {
                        newData = data.replace(/\n]/, `
  {
    path: '${cPath}',
    component: () => import('${component}')
  }
]`);
                    }
                    const ws = fs.createWriteStream(filePath);
                    ws.write(newData);
                }
            });
        });
        if (arr.length === 1) {
            fs.readFile(this.loader.config.router + '/index.js', 'utf8', (err, data) => {
                const reg = /(import \w* from \S*)(\n\n)/g;
                const s1 = data.replace(reg, function (match, p1, p2) {
                    return `${p1}\nimport ${arr[0]} from './${arr[0]}'${p2}`;
                });
                const s2 = s1.replace(/(})\n\s*]/, function (match, p1) {
                    return `${p1},
    {
      path: '/${arr[0]}',
      component: () => import('pages/${arr[0]}'),
      children: ${arr[0]}
    }
  ]`;
                });
                const ws = fs.createWriteStream(this.loader.config.router + '/index.js');
                ws.write(s2);
            });
        }
    }
    generateFile(p) {
        fs.pathExists(p, function (err, exists) {
            if (exists) {
                console.error('文件已经存在了');
                process.exit(1);
            }
            let template = '../template/starter.vue';
            if (path.basename(p) === 'Index.vue')
                template = '../template/Index.vue';
            fs.copy(path.resolve(__dirname, template), p, err => {
                console.log(err);
            });
        });
    }
}
new Route();
