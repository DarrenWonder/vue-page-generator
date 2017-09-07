"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander = require("commander");
const config_loader_1 = require("../utils/config-loader");
const tools_1 = require("../utils/tools");
const fs = require("fs-extra");
const path = require("path");
const ora = require('ora')
const chalk = require('chalk');
const log = console.log
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
        if (this.program.path.trim() === '') {
          log(chalk.red('\n⚠️  必须指定路由'));
          process.exit(1);
        }
        this.spinner = ora('开始生成文件...').start();
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
        const self = this
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
                    log(chalk.green(`\n✔️ 生成路由记录成功`));
                } else {
                    log(chalk.red('✖️ 路由记录已存在！'));
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
                log(chalk.green(`\n✔️ 生成主路由成功`));
            });
        }
        this.spinner.stop();
    }
    generateFile(p) {
        const self = this
        fs.pathExists(p, function (err, exists) {
            if (exists) {
                self.spinner.fail(chalk.red('文件已经存在了，不能再次生成！'));
                process.exit(1);
            }
            let template = '../template/starter.vue';
            if (path.basename(p) === 'Index.vue')
                template = '../template/Index.vue';
            fs.copy(path.resolve(__dirname, template), p, err => {
              if (err) {
                self.spinner.fail(chalk.red(err.message));
                process.exit();
              }
              log(chalk.green(`\n✔️ 生成${p}页面成功`));
            });
        });
    }
}
new Route();
