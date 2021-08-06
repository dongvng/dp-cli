const spawn = require('cross-spawn');

function executeCommand(command, args, options = {}) {
  const child = spawn(command, args, { stdio: 'inherit', ...options });

  return new Promise((resolve, reject) => {
    child.on('close', (code) => {
      if (code !== 0) {
        reject(
          new Error(
            `${command} ${args.join(
              ' '
            )} failed with exit code ${code}. Please check your console.`
          )
        );
        return;
      }
      resolve();
    });
  });
}

module.exports = executeCommand;
