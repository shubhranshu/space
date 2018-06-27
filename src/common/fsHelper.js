import fs from 'fs';
import { stringify } from './logger';


export const Locations = {
  TEMP_DATA_DIR: './data/temp/'
};

// Write to temp file
export const writeFileToTemp = (message, fileName) => {
  let msgObj = stringify(message);
  fs.writeFileSync( Locations.TEMP_DATA_DIR + fileName, msgObj);
};
