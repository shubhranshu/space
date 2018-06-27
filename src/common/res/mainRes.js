import inquirer from 'inquirer';

export const GenericOptions = [
  new inquirer.Separator(),
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

export const TargetQuestions = {
  type: 'list',
  name: 'target',
  message: 'Source target for data query',
  help: '',
  choices: [
    {
      name: 'Solar system dynamics',
      value: 'SSD'
    },
    ...GenericOptions
  ]
};
