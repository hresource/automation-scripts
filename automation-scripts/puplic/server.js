// server.js
const express = require('express');
const path = require('path');
const runScript = require('./runScript');

const app = express();
const port = 3000;

// Serve static files (frontend)
app.use(express.static(path.join(__dirname, 'public')));

// Define scripts
const scripts = {
  'xfinity': 'scripts/xfinity_auto.js',
  'yahoo': 'scripts/yahoo_auto.js',
  'google': 'scripts/google_auto.js',
  'microsoft': 'scripts/microsoft_auto.js'
};

// Endpoint to run all scripts sequentially
app.get('/run-all', async (req, res) => {
  let output = '';
  for (const [name, scriptPath] of Object.entries(scripts)) {
    try {
      const result = await runScript(scriptPath);
      output += `--- ${name} ---\n${result}\n\n`;
    } catch (err) {
      output += `--- ${name} ERROR ---\n${err}\n\n`;
    }
  }
  res.send(output);
});

// Endpoint for individual scripts
app.get('/run/:scriptName', async (req, res) => {
  const scriptName = req.params.scriptName.toLowerCase();
  const scriptPath = scripts[scriptName];
  if (!scriptPath) {
    return res.status(404).send('Script not found');
  }
  try {
    const result = await runScript(scriptPath);
    res.send(result);
  } catch (err) {
    res.send(err);
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server listening at http://196.251.116.144:${4444}`);
});