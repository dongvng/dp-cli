#!/usr/bin/env node

const yargs = require('yargs');
const { Command } = require('commander');
const spawn = require('cross-spawn');
const chalk = require('chalk');
const path = require('path');
const cliPackageJson = require('../package.json');
const spawnProcess = require('../utils/execute-command');
const templateGenerator = require('../src/generate-template');

const program = new Command();

program
  .version(cliPackageJson.version)
  .description('cli to generate a new project')
  // .usage(`${chalk.green('<project-directory>')} [options]`)
  .option(
    '--type <project-type>',
    'select a project type (currently support react and nest)'
  )
  .option('--name <project-name>', 'generate a template folder')
  .parse(process.argv);

const options = program.opts();

if (options.name && options.type) {
  templateGenerator(options);
} else {
  console.warn(
    chalk.yellow(
      'you need to specify both type and name to generate a new project!'
    )
  );
}

// const reactScript = 'react-scripts';
// spawnProcess('npm', [
//   'install',
//   '--save',
//   '--save-exact',
//   'cra-template-typescript',
// ])
//   .then(() => spawnProcess('npm', ['install', '--save', reactScript]))
//   .then(() => {
//     executeNodeScript(
//       {
//         cwd: process.cwd(),
//       },
//       [
//         path.resolve(process.cwd()),
//         'project-sample-typescript',
//         false,
//         path.resolve(process.cwd()),
//         'cra-template-typescript',
//       ],
//       `
//   var init = require('${reactScript}/scripts/init.js');
//   init.apply(null, JSON.parse(process.argv[1]));
// `
//     );
//   });

// function executeNodeScript({ cwd }, data, source) {
//   return new Promise((resolve, reject) => {
//     const child = spawn(
//       process.execPath,
//       ['-e', source, '--', JSON.stringify(data)],
//       { cwd, stdio: 'inherit' }
//     );

//     child.on('close', (code) => {
//       if (code !== 0) {
//         reject({
//           command: `node ${args.join(' ')}`,
//         });
//         return;
//       }
//       resolve();
//     });
//   });
// }
