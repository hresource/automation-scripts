// runScript.js
const { exec } = require('child_process');

function runScript(scriptPath) {
  return new Promise((resolve, reject) => {
    exec(`node ${scriptPath}`, (error, stdout, stderr) => {
      if (error) {
        reject(`Error running ${scriptPath}:\n${error.message}`);
      } else {
        resolve(`Output of ${scriptPath}:\n${stdout}`);
      }
    });
  });
}

module.exports = runScript;