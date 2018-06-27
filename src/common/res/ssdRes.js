import { GenericOptions } from './mainRes';

export const HorizonsTelnetParams = {
  host: 'horizons.jpl.nasa.gov',
  port: 6775,
  shellPrompt: 'Horizons',
  timeout: 1500
};

export const SsdPrompts = {
  type: 'list',
  name: 'operation',
  message: 'Select an SSD Opeartion',
  choices: [
    {
      name: 'Download | Index from major bodies Database',
      value: 'DownloadMbIndex'
    },
    {
      name: 'Download | Specific Major body data',
      value: 'DownloadMbData'
    },
    ...GenericOptions
  ]
};
