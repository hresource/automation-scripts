// run_all.js
const { sendTelegramMessage } = require('./utils');

async function runAll() {
  // Run each script sequentially
  const { exec } = require('child_process');

  const scripts = [
    'node xfinity_auto.js',
    'node yahoo_auto.js',
    'node google_auto.js',
    'node microsoft_auto.js',
  ];

  for (const cmd of scripts) {
    await new Promise(res => {
      exec(cmd, (err, stdout, stderr) => {
        if (err) {
          sendTelegramMessage(`Error executing ${cmd}: ${err.message}`);
        } else {
          // Optionally, send stdout
        }
        res();
      });
    });
  }

  await sendTelegramMessage('All scripts completed.');
}

runAll();