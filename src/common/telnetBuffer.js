import { log, logd, logp } from './logger';
import { writeFileToTemp } from './fsHelper';
import chalk from 'chalk';

export default class TelnetBuffer {
  constructor(name, max) {
    this.name = name;
    this.expectedMax = max;
    this._buffer = '';
  }
  clear() {
    logd('Clearing buffer');
    this._buffer = '';
  }
  append(data) {
    this._buffer += data.toString();
    let len = this._buffer.length;
    if (this.expectedMax) {
      logp(len, this.expectedMax);
    }
    logd(len);
  }
  contains(str) {
    return this._buffer.indexOf(str) > 0;
  }
  endsWith(str) {
    return this._buffer.endsWith(str);
  }
  getData() {
    return this._buffer;
  }
  toFile(fileName) {
    logp(this.expectedMax, this.expectedMax);
    log('Writing raw to file ! : ' + chalk.green(fileName));
    writeFileToTemp(this.getData(), fileName);
    this.clear();
  }
}
