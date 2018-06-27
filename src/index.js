import inquirer from 'inquirer';

import { log, logd } from './common/logger';
import Help from './common/help';
import ssd from './modules/ssd';
import { TargetQuestions } from './common/res/mainRes';

function handleGeneric(objName, answers) {
  logd('Handling generics');
  logd(objName, answers);
  var answerValue = answers[objName];
  switch (answerValue) {
    case 'help':
      logd('Choice was help !');
      return startUp(2);
    case 'restart':
      logd('choice was restart !');
      return startUp(1);
    case 'quit':
      logd('Choice is to Quit !');
      return false;
  }
  return true;
}

function handleTargets(answers) {
  if (handleGeneric(TargetQuestions.name, answers)) {
    logd('Handling targets');
    switch (answers.target) {
      case 'SSD':
        ssd.startup();
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
      Help.printArt();
      Help.showHelp();
      break;
    case 2:
      Help.showHelp();
      break;
    case 3:
    // this is the regular start !
  }
  inquirer.prompt(TargetQuestions).then(answers => {
    handleTargets(answers);
  });
}

startUp(1);
