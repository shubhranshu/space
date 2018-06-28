import Telnet from 'telnet-client';
import inquirer from 'inquirer';
import chalk from 'chalk';

import { log, logd } from '../common/logger';
import { ParseMainBodyRaw, Locations } from '../common/fsHelper';
import TelnetBuffer from '../common/telnetBuffer';
import { HorizonsTelnetParams, SsdPrompts } from '../common/res/ssdRes';

export const MAJOR_BODY_QUERY = 'MB\n';
export const MAJOR_BODY_QUERY_DELIMITER = '<cr>: ';

export const HELP_QUERY = '?\n';
export const HELP_QUERY_DELIMITER = 'Horizons> ';

export const HELP_QUERY_EXTEDED = '?!\n';
export const HELP_QUERY_EXTEDED_DELIMITER = '<cr>: ';

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
          this.getHorizonsData(MAJOR_BODY_QUERY, Locations.MB_RAW_NAME, 31508, MAJOR_BODY_QUERY_DELIMITER);
          break;
        case 'DownloadMbData':
          break;
        case 'ProcessMbIndex':
          this.processRawForMajorBodies(Locations.MB_RAW_NAME);
          break;
        case 'HzHelp':
          this.getHorizonsData(HELP_QUERY, Locations.HELP_RAW_NAME, 7139, HELP_QUERY_DELIMITER);
          break;
        case 'HzHelpExtended':
          this.getHorizonsData(
            HELP_QUERY_EXTEDED,
            Locations.HELP_EXTENDED_RAW_NAME,
            171426,
            HELP_QUERY_EXTEDED_DELIMITER
          );
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
    ParseMainBodyRaw(filename);
  }

  /**
   * Query horizons and save te data raw file
   *
   * @param {*} command The command to execute on HORIZON telnet
   * @param {*} resultFile filename to save the data
   * @memberof SSD
   */
  getHorizonsData(command, resultFile, expectedMax, delimiter) {
    log('Generating SSD Data');
    this.getStream(HorizonsTelnetParams, (conn, stream) => {
      let mbBuffer = new TelnetBuffer('Generic');
      let once = false;
      let checkStreamForData = streamData => {
        mbBuffer.append(streamData);

        if (mbBuffer.contains('Horizons>') && !once) {
          once = true;
          log('HORIZONS prompt reached');
          mbBuffer.clear();
          log('Querying ... ');
          stream.write(command);
          mbBuffer = new TelnetBuffer('Operation', expectedMax);
        } else if (mbBuffer.endsWith(delimiter)) {
          mbBuffer.toFile(resultFile);
          stream.end();
          conn.end();
          logd('Stream ended');
          this.startup();
        }
      };
      stream.on('data', checkStreamForData);
    });
  }
}

export default new SSD();
