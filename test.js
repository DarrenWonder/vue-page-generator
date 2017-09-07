var ora = require('ora')
const chalk = require('chalk');
var spinner = ora('开始生成...').start();
setTimeout(function () {
    console.log(chalk.green('\n✔ 剩菜✖'))
    spinner.succeed(chalk.green('生成成功！'))
}, 2000)