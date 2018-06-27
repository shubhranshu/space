import { log, logf, logd, logp } from './logger';
import chalk from 'chalk';

export default class Buffer {
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
    log('Writing raw to file ! : ' + chalk.green(fileName));
    logf(this.getData(), fileName);
    this.clear();
  }
}
