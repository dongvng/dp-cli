const path = require('path');
const writeJson = require('../utils/write-json');
const fs = require('fs-extra');
const spawnProcess = require('../utils/execute-command');

async function createTemplate(options) {
  const { name, type } = options;
  const root = path.resolve(name);

  fs.ensureDirSync(root);

  const templateDir = path.resolve(__dirname, '..', './templates');

  fs.copySync(path.join(templateDir, type), root);

  const packageJsonRoot = require(path.join(root, 'package.json'));

  // install dependencies of template project
  await spawnProcess(
    'npm',
    ['--prefix', root, 'install', '--save'].concat(
      Object.entries(packageJsonRoot.dependencies).map(
        ([name, version]) => `${name}@${version}`
      )
    )
  );

  // try to run script from template after instal
  //await spawnProcess('npm', ['--prefix', root, 'run', 'start']); // expect to log from main.js file
}

module.exports = createTemplate;
