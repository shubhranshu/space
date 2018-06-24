import inquirer from 'inquirer';
import { resolve } from 'path';
import { rejects } from 'assert';
import chalk from 'chalk';

import { log, logd } from './common/logger';
import Help from './common/help';

import SSD from './modules/ssd';

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
      return startUp(1);
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
    switch (answers.target) {
      case 'SSD':
        SSD.start();
        break;
      default:
        log('You didnt select a target ! Restarting...');
        startUp(2);
    }
  }
}

function startUp(option) {
  switch (option) {
    case 1:
      console.clear();
      Help.printArt();
    case 2:
      Help.showHelp();
    case 3:
    // this is the regular start !
  }
  inquirer.prompt(targetQuestions).then(answers => {
    handleTargets(answers);
  });
}

startUp(1);
