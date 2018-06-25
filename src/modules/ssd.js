import { log, logd, logf, logp} from '../common/logger';
import Telnet from 'telnet-client';

export const HorizonsTelnetParams = {
  host: 'horizons.jpl.nasa.gov',
  port: 6775,
  shellPrompt: 'Horizons',
  timeout: 1500
};

var buffer = '';

const clearBuffer = () => {
  log('Clearing buffer');
  buffer = '';
};

const appendToBuffer = (data, max) => {
  if (max) {
  } else {
    buffer += data.toString();
    logp(buffer.length);
  }
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
      let checkStreamForData = streamData => {
        appendToBuffer(streamData);
        if (buffer.indexOf('Horizons>') > 0) {
          log('HORIZONS prompt reached');
          clearBuffer();
          log('Querying major bodies database');
          stream.write('MB\n');
        } else if (buffer.endsWith('<cr>: ')) {
          log('writing to file !');
          logf(buffer, 'mb-raw.txt');
          clearBuffer();
        }
      };

      stream.on('data', checkStreamForData);
    });
  }
}

export default new SSD();
