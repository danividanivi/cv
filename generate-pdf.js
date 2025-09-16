const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('file://' + __dirname + '/index.html');
  await page.pdf({ path: 'resume.pdf', format: 'A4', printBackground: true });
  await browser.close();
  console.log('PDF generated successfully at resume.pdf');
})();
