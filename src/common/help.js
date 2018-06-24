import fs from 'fs';

import chalk from 'chalk';
import { log, logd, eloge } from './logger';
import { throwError } from 'rxjs';

export function getHelpData() {
  var fileData = fs.readFileSync('./src/common/help/help.md');
  return fileData;
}

export function showHelp() {
  let helpData = getHelpData();
  log(chalk.red(helpData));
}

export function printArt(){
    log('');
    log('**************************************************************');
    log('**************** Some badass ASCII art here ******************');
    log('**************************************************************');
    log('');
}

export default {
  getHelpData,
  showHelp,
  printArt
};
