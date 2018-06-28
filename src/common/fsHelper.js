import fs from 'fs';
import path from 'path';
import { stringify, logd } from './logger';

export const FileConstants = {
  MB_START_DELIMITER: '  ID#',
  RESULT_DELIMITER: '*******************************************************************************',
  COL_WIDTH_INDICATOR: '-'
};

export const Locations = {
  HELP_RAW_NAME: 'hz-help.txt',
  HELP_EXTENDED_RAW_NAME:'hz-extended-help.txt',
  MB_RAW_NAME: 'mb-raw.txt',
  MB_DAT_NAME: 'mb-raw.dat',
  MB_JSON_NAME: 'index-main-body.json',
  TEMP_DATA_DIR: './data/temp/'
};

// Write to temp file
export const writeFileToTemp = (message, fileName) => {
  let msgObj = stringify(message);
  let filePath = path.join(Locations.TEMP_DATA_DIR, fileName);
  logd('Writing file : ' + filePath);
  fs.writeFileSync(filePath, msgObj);
};

export const ParseMainBodyRaw = fileName => {
  let filePath = path.join(Locations.TEMP_DATA_DIR, fileName);
  let fileData = fs.readFileSync(filePath);
  logd('File length : ' + fileData.length);

  let startIdx = fileData.indexOf(FileConstants.MB_START_DELIMITER);
  let endIdx = fileData.lastIndexOf(FileConstants.RESULT_DELIMITER);

  logd('Indexes | Start : ' + startIdx + ' | End : ' + endIdx);
  fileData = fileData.slice(startIdx, endIdx).toString();

  logd(fileData);
  let fileArray = fileData.split('\n');
  logd('Array Length : ' + fileArray.length);

  let colMask = fileArray[1];
  let headers = GetValuesUsingMask(fileArray[0], colMask, true);
  for (let index = 0; index < headers.length; index++) {
    headers[index] = headers[index].replace('#', ''); // Remove # from headers
  }

  logd('Headers', headers);

  let subArr = fileArray.slice(2, fileArray.length - 2);
  let ssdIndex = [];
  subArr.forEach(element => {
    let values = GetValuesUsingMask(element, colMask);
    if (values.length == headers.length) {
      let valObj = {};
      for (let index = 0; index < headers.length; index++) {
        let val = values[index];
        if (val) {
          valObj[headers[index]] = val.trim();
          let numVal = Number.parseInt(val);
          if (!isNaN(numVal)) {
            valObj[headers[index]] = numVal;
          }
        }
      }
      ssdIndex.push(valObj);
    }
  });
  logd(ssdIndex, ssdIndex);
  writeFileToTemp(ssdIndex, Locations.MB_JSON_NAME);
};

export const GetValuesUsingMask = (data, mask, trim) => {
  let returnArr = [];
  let idx = 0;
  while (idx < mask.length) {
    if (mask[idx] == FileConstants.COL_WIDTH_INDICATOR) {
      let valStart = data[idx];
      while (mask[idx + 1] == FileConstants.COL_WIDTH_INDICATOR && idx < mask.length) {
        valStart += data[idx + 1];
        idx++;
      }
      if (trim) {
        returnArr.push(valStart.trim());
      } else {
        returnArr.push(valStart);
      }
    }
    idx++;
  }
  return returnArr;
};
