import { log, logd } from '../common/logger';
import Telnet from 'telnet-client';

export const HorizonsTelnetParams = {
  host: 'horizons.jpl.nasa.gov',
  port: 6775,
  shellPrompt: 'Horizons',
  timeout: 1500,
  debug: true,
  initialLFCR: true
};

export const HorizonsUrl = 'https://ssd.jpl.nasa.gov/horizons.cgi';

export const TargetBodyList = {
  name: 'mb_list',
  id: '2',
  list: [
    {
      name: 'Sun and Planets',
      value: 'planet'
    },
    {
      name: 'Jovian Satellites',
      value: 'js'
    },
    {
      name: 'Saturnian Satellites',
      value: 'ss'
    },
    {
      name: 'Uranian Satellites',
      value: 'us'
    },
    {
      name: 'Neptunian Satellites',
      value: 'ns'
    },
    {
      name: 'Other Satellites',
      value: 'os'
    },
    {
      name: 'Spacecraft',
      value: 'sc'
    },
    {
      name: 'Dynamic Points',
      value: 'dp'
    }
  ]
};

export class SSD {
  start() {
    log('Generating SSD Data');
    log('onnecting to telnet');
    let conn = new Telnet();
    let params = {
      host: 'horizons.jpl.nasa.gov',
      port: 6775,
      shellPrompt: 'Horizons> ',
      timeout: 1500,
      debug: true,
      initialLFCR: true
    };

    let streamBuffer = '';
    let bufferSink = data => {
      streamBuffer += data.toString();
    };

    conn.connect(HorizonsTelnetParams).then(
      prompt => {
        log('Connected to HORIZONS telnet, Executing Major body search');
        conn.shell((err, stream) => {
          log('Shell Acquired !');
          stream.on('data', bufferSink);

          let WaitingForDelimiter = () => {
            setTimeout(() => {
              if (streamBuffer.indexOf('Select ...') > 0) {
                log(streamBuffer);
                log('closing the stream now !');
                conn.end();
              }
              WaitingForDelimiter();
            }, 300);
          };

          setTimeout(() => {
            log('Querying major bodies database');
            stream.write('MB\n');
            streamBuffer = '';
            WaitingForDelimiter();
          }, 2000);
        });
      },
      err => {
        log('There was an error connection to the telnet client');
      }
    );
  }
}

export default new SSD();
