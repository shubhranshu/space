import chalk from 'chalk';

export const log = console.log;

export function logd(message, obj) {
  if (process.env.NODE_ENV == 'debug') {
    var header = +new Date() + ' : ';

    log(chalk.magenta(header + chalk.black(chalk.bgGreen(' ' + message + ' '))));
    if (obj) {
      log(chalk.cyan(JSON.stringify(obj, null, 4)));
    }
  }
}
