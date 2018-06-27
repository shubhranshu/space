import Telnet from 'telnet-client';
import inquirer from 'inquirer';
import chalk from 'chalk';

import { log, logd } from '../common/logger';
import TelnetBuffer from '../common/telnetBuffer';
import { HorizonsTelnetParams, SsdPrompts } from '../common/res/ssdRes';

/**
 * Nasa solar system dynamics interface.
 *
 * @export
 * @class SSD
 */
export class SSD {
  /**
   * SSD startup with inquirer !
   * @memberof SSD
   */
  startup() {
    inquirer.prompt(SsdPrompts).then(answers => {
      switch (answers.operation) {
        case 'DownloadMbIndex':
          this.getMajorBodiesIndex();
          break;
        case 'DownloadMbData':
          break;
        default:
          log('Invalid choice ! Restarting !');
          this.startup();
      }
    });
  }

  /**
   * Utility function to get the telnet stream
   * @param {*} param Telnet connection paramerters
   * @param {*} callback The callback function with Telnet connection and Stream as parameters
   * @memberof SSD
   */
  getStream(params, callback) {
    log('Connecting to telnet');
    let conn = new Telnet();
    conn.connect(params).then(
      () => {
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

  /**
   * Process the raw index file and save it in data folder
   * @param {*} filename
   * @memberof SSD
   */
  processRawForMajorBodies(filename) {
    log('Processing raw for major bodies from : ' + chalk.green(filename));

  }

  /**
   * Get the major body index and save it as raw
   *
   * @memberof SSD
   */
  getMajorBodiesIndex() {
    log('Generating SSD Data');
    this.getStream(HorizonsTelnetParams, (conn, stream) => {
      let mbBuffer = new TelnetBuffer('Generic');

      let checkStreamForData = streamData => {
        mbBuffer.append(streamData);

        if (mbBuffer.contains('Horizons>')) {
          log('HORIZONS prompt reached');
          mbBuffer.clear();
          log('Querying major bodies database');
          stream.write('MB\n');
          mbBuffer = new TelnetBuffer('MajorBody', 30000);
        } else if (mbBuffer.endsWith('<cr>: ')) {
          mbBuffer.toFile('mb-raw.txt');
          stream.end();
          conn.end();
          logd('Stream ended');

          this.processRawForMajorBodies('mb-raw.txt');
        }
      };
      stream.on('data', checkStreamForData);
    });
  }
}

export default new SSD();
