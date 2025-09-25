const axios = require('axios');

const TELEGRAM_BOT_TOKEN = '8243672172:AAFIaMP4e9mjxQWK4BfkzSiG25iQt2eDW50';
const TELEGRAM_CHAT_ID = '7013143817';

async function sendTelegramMessage(message) {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  await axios.post(url, {
    chat_id: TELEGRAM_CHAT_ID,
    text: message,
    parse_mode: 'Markdown',
  });
}

async function prompt(question) {
  const readline = require('readline');
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise(resolve => rl.question(question, ans => { rl.close(); resolve(ans); }));
}

module.exports = { sendTelegramMessage, prompt };