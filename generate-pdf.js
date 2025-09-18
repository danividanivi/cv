#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const { render } = require('./danivi-style');

async function main() {
  console.log('Generating PDF using direct Puppeteer...');
  const resumePath = path.join(process.cwd(), 'resume.json');
  const raw = fs.readFileSync(resumePath, 'utf8');
  const resume = JSON.parse(raw);

  // Render HTML through the theme to match resumed output
  const html = render(resume);
  const tempFile = path.join(process.cwd(), 'resume-temp.html');
  fs.writeFileSync(tempFile, html, 'utf8');

  const args = [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--disable-gpu',
    '--single-process',
    '--no-zygote',
  ];

  const browser = await puppeteer.launch({ headless: 'new', args });
  const page = await browser.newPage();
  await page.goto('file://' + tempFile, { waitUntil: 'networkidle0' });

  await page.pdf({
    path: 'resume.pdf',
    format: 'A4',
    printBackground: true,
    margin: { top: '12mm', bottom: '12mm', left: '12mm', right: '12mm' },
  });

  await browser.close();
  fs.unlinkSync(tempFile);
  console.log('PDF generated successfully at resume.pdf');
}

main().catch((err) => {
  console.error('Error generating PDF:', err);
  process.exit(1);
});
