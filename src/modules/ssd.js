import Telnet from 'telnet-client';

import { log, logd, logf, logp } from '../common/logger';
import Buffer from '../common/buffer';

export const HorizonsTelnetParams = {
  host: 'horizons.jpl.nasa.gov',
  port: 6775,
  shellPrompt: 'Horizons',
  timeout: 1500
};

export class SSD {
  getStream(params, callback) {
    log('Connecting to telnet');
    let conn = new Telnet();
    conn.connect(params).then(
      prompt => {
        log('Connected to HORIZONS telnet, Executing Major body search');
        conn.shell((err, stream) => {
          log('Shell Acquired !');
          callback(conn, stream);
        });
      },
      err => {
        log('There was an error connection to the telnet client');
        throw err;
      }
    );
  }
  getMajorBodiesList() {
    log('Generating SSD Data');
    this.getStream(HorizonsTelnetParams, (conn, stream) => {
      let mbBuffer = new Buffer('Generic');

      let checkStreamForData = streamData => {
        mbBuffer.append(streamData);
        if (mbBuffer.contains('Horizons>')) {
          log('HORIZONS prompt reached');
          mbBuffer.clear();
          log('Querying major bodies database');
          stream.write('MB\n');
          mbBuffer = new Buffer('MajorBody', 30000);
        } else if (mbBuffer.endsWith('<cr>: ')) {
          mbBuffer.toFile('mb-raw.txt');
          stream.end();
          conn.end();
          logd('Stream ended');
        }
      };

      stream.on('data', checkStreamForData);
    });
  }
}

export default new SSD();
