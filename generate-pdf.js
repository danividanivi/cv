#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const { render } = require('./danivi-style');
const { render: renderLong } = require('./danivi-long-style');

async function generatePDF(resume, outputPath, renderFunction) {
  console.log(`Generating PDF at ${outputPath}...`);
  const html = renderFunction(resume);
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
    path: outputPath,
    format: 'A4',
    printBackground: true,
    margin: { top: '0mm', bottom: '0mm', left: '0mm', right: '0mm' },
    preferCSSPageSize: false,
    displayHeaderFooter: false,
  });

  await browser.close();
  fs.unlinkSync(tempFile);
  console.log(`PDF generated successfully at ${outputPath}`);
}

async function main() {
  const resumePath = path.join(process.cwd(), 'resume.json');
  const raw = fs.readFileSync(resumePath, 'utf8');
  const resume = JSON.parse(raw);

  // Generate one-page version (current behavior)
  await generatePDF(resume, 'resume.pdf', render);

  // Generate extended single-page version (using long style theme)
  await generatePDF(resume, 'resume-2page.pdf', renderLong);
}

main().catch((err) => {
  console.error('Error generating PDFs:', err);
  process.exit(1);
});
