import chalk from 'chalk';

const printWidth = 120;

export const stringify = message => {
  var msgObj = message;
  if (typeof message != 'string') {
    msgObj = JSON.stringify(message, null, 4);
  }
  return msgObj;
};

export const GetDateHeader = () => {
  var d = new Date();
  return chalk.magenta(d.toLocaleTimeString()) + ' | ' + chalk.green(d.getMilliseconds()) + ' : ';
};

// Log to console
export const log = message => {
  let msgObj = stringify(message);

  return console.log(GetDateHeader() + msgObj);
};

// Log debug
export const logd = (message, obj) => {
  if (process.env.NODE_ENV == 'debug') {
    log(chalk.black(chalk.bgGreen(' ' + message + ' ')));
    if (obj) {
      log(chalk.cyan(JSON.stringify(obj, null, 4)));
    }
  }
};

// Log progress
export const logp = (current, max) => {
  current = current > max ? max : current;
  let progresMsgStart = 'Downloading [';
  let progresMsgEnd = ']';
  let usableLength = printWidth - GetDateHeader().length - progresMsgStart.length - progresMsgEnd.length;
  let progress = (current / max) * usableLength;
  let progresMsg = progresMsgStart + '*'.repeat(progress) + ' '.repeat(usableLength - progress) + progresMsgEnd;
  log(chalk.yellow(progresMsg));
};
