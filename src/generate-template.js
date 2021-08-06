const path = require('path');
const writeJson = require('../utils/write-json');
const fs = require('fs-extra');
const spawnProcess = require('../utils/execute-command');
const chalk = require('chalk');

async function createTemplate(options) {
  const { name, type } = options;
  const root = path.resolve(name);

  fs.ensureDirSync(root);

  const templateDir = path.resolve(__dirname, '..', './templates');

  fs.copySync(path.join(templateDir, type), root);

  const packageJsonRoot = require(path.join(root, 'package.json'));

  packageJsonRoot.name = name;
  // install dependencies of template project
  await spawnProcess(
    'npm',
    ['--prefix', root, 'install', '--save'].concat(
      Object.entries(packageJsonRoot.dependencies).map(
        ([name, version]) => `${name}@${version}`
      )
    )
  );

  // install devDependencies
  if (packageJsonRoot.devDependencies) {
    await spawnProcess(
      'npm',
      ['--prefix', root, 'install', '-D'].concat(
        Object.entries(packageJsonRoot.devDependencies).map(
          ([name, version]) => `${name}@${version}`
        )
      )
    );
  }

  console.log(chalk.green('Happy Coding <3'));

  // try to run script from template after instal
  //await spawnProcess('npm', ['--prefix', root, 'run', 'start']); // expect to log from main.js file
}

module.exports = createTemplate;
