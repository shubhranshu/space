import { log, logf, logd } from './logger';

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
    logd(this._buffer.length);
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
    log('writing to file !');
    logf(this.getData(), fileName);
    this.clear();
  }
}
