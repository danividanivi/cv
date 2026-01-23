#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const { render } = require('./danivi-style');

async function main() {
  console.log('Generating PDF...');
  const resumePath = path.join(process.cwd(), 'resume.json');
  const raw = fs.readFileSync(resumePath, 'utf8');
  const resume = JSON.parse(raw);

  const html = render(resume);
  const tempFile = path.join(process.cwd(), 'resume-temp.html');
  fs.writeFileSync(tempFile, html, 'utf8');

  const args = [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--disable-gpu',
  ];

  // Add Linux-specific args only on non-Windows platforms
  if (process.platform !== 'win32') {
    args.push('--single-process', '--no-zygote');
  }

  const browser = await puppeteer.launch({ headless: 'new', args });
  const page = await browser.newPage();
  await page.goto('file://' + tempFile, { waitUntil: 'networkidle0' });

  await page.pdf({
    path: 'resume.pdf',
    format: 'A4',
    printBackground: true,
    margin: { top: '0mm', bottom: '0mm', left: '0mm', right: '0mm' },
    preferCSSPageSize: false,
    displayHeaderFooter: false,
  });

  await browser.close();
  fs.unlinkSync(tempFile);
  console.log('PDF generated successfully at resume.pdf');
}

main().catch((err) => {
  console.error('Error generating PDF:', err);
  process.exit(1);
});
