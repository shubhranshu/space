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
  start() {
    log('Generating SSD Data');
    log('Connecting to telnet');

    // Get connection stream
    let GetStream = (params, callback) => {
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
    };

    GetStream(HorizonsTelnetParams, (conn, stream) => {
      let mbBuffer = new Buffer('Generic');
      let checkStreamForData = streamData => {
        mbBuffer.append(streamData)
        if (mbBuffer.contains('Horizons>')) {
          log('HORIZONS prompt reached');
          mbBuffer.clear()
          log('Querying major bodies database');
          stream.write('MB\n');
          mbBuffer = new Buffer("MajorBody", 31000)
        } else if (mbBuffer.endsWith('<cr>: ')) {
          mbBuffer.toFile('mb-raw.txt');
        }
      };

      stream.on('data', checkStreamForData);
    });
  }
}

export default new SSD();
