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

  process.chdir(root); // change current working dir to generated template

  const packageJsonRoot = require(path.join(root, 'package.json'));

  packageJsonRoot.name = name;

  // override pkg file with above change to name of repo
  writeJson(path.join(root, 'package.json'), packageJsonRoot);

  // install dependencies of template project
  const hasDependencies =
    packageJsonRoot.dependencies &&
    Object.entries(packageJsonRoot.dependencies).length > 0;

  if (hasDependencies) {
    console.log(chalk.cyanBright('Installing...'));

    await spawnProcess(
      'npm',
      ['install', '--save'].concat(
        Object.entries(packageJsonRoot.dependencies).map(
          ([name, version]) => `${name}@${version}`
        )
      )
    );
  }

  // install devDependencies
  const hasDevDependencies =
    packageJsonRoot.devDependencies &&
    Object.entries(packageJsonRoot.devDependencies).length > 0;
  if (hasDevDependencies) {
    await spawnProcess(
      'npm',
      ['install', '-D'].concat(
        Object.entries(packageJsonRoot.devDependencies).map(
          ([name, version]) => `${name}@${version}`
        )
      )
    );
  }

  console.log(chalk.green(`cd ./${name} and start developing your project!`));

  console.log();

  console.log(chalk.green('Happy Coding! From NAB with <3'));

  // try to run script from template after instal
  //await spawnProcess('npm', ['--prefix', root, 'run', 'start']); // expect to log from main.js file
}

module.exports = createTemplate;
