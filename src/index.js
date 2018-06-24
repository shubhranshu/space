import inquirer from 'inquirer';
import { resolve } from 'path';
import { rejects } from 'assert';
import chalk from 'chalk';

var log = console.log;
function logd(message, obj) {
  if (process.env.NODE_ENV == 'debug') {
    var header = +new Date() + ' : ';

    log(chalk.magenta(header + chalk.black(chalk.bgGreen(' ' + message + ' '))));
    if (obj) {
      log(chalk.cyan(JSON.stringify(obj, null, 4)));
    }
  }
}
// Prints some awesome ASCII art here
function printArt() {
  log('');
  log('**************************************************************');
  log('**************** Some badass ASCII art here ******************');
  log('**************************************************************');
  log('');
}

function printHelp() {
  log('');
  log(chalk.redBright('````````````````################################````````````````'));
  log(chalk.redBright('````````````````################################````````````````'));
  log(chalk.redBright('````````````````################################````````````````'));
  log(chalk.redBright('````````````````###### Some help text here #####````````````````'));
  log(chalk.redBright('````````````````################################````````````````'));
  log(chalk.redBright('````````````````################################````````````````'));
  log(chalk.redBright('````````````````################################````````````````'));
  log('');
}

var types = {
  input: 'input',
  confirm: 'confirm',
  list: 'list',
  rawlist: 'rawlist',
  expand: 'expand',
  checkbox: 'checkbox',
  password: 'password',
  editor: 'editor'
};

var genericOptions = [
  {
    name: 'Help',
    value: 'help'
  },
  {
    name: 'Restart',
    value: 'restart'
  },
  {
    name: 'Quit',
    value: 'quit'
  }
];

var targetQuestions = {
  type: 'list',
  name: 'target',
  message: 'Source target for data query',
  help: '',
  choices: [
    {
      name: 'Solar system dynamics',
      value: 'SSD'
    },
    new inquirer.Separator(),
    ...genericOptions
  ]
};

function handleGeneric(objName, answers) {
  logd('Handling generics');
  logd(objName, answers);
  var answerValue = answers[objName];
  switch (answerValue) {
    case 'help':
      logd('Choice was help !');
      return startUp(2);
      break;
    case 'restart':
      logd('choice was restart !');
      return startUp(3);
      break;
    case 'quit':
      logd('Choice is to Quit !');
      return false;
  }
  return true;
}

function handleTargets(answers) {
  if (handleGeneric(targetQuestions.name, answers)) {
    logd('Handling targets');
  }
}

function startUp(option) {
  switch (option) {
    case 1:
      printArt();
    case 2:
      printHelp();
    case 3:
    // this is the regular start !
  }
  inquirer.prompt(targetQuestions).then(answers => {
    handleTargets(answers);
  });
}

startUp(1);
