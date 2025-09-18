const { execSync } = require('child_process');

console.log('Generating PDF using resumed (matching GitHub Actions)...');
try {
  execSync('PUPPETEER_DISABLE_SANDBOX=1 PUPPETEER_ARGS="--no-sandbox --disable-setuid-sandbox --disable-dev-shm-usage --disable-seccomp-filter-sandbox" ./node_modules/.bin/resumed export resume.json --theme jsonresume-theme-danivi-style --output resume.pdf', { stdio: 'inherit' });
  console.log('PDF generated successfully at resume.pdf');
} catch (error) {
  console.error('Error generating PDF:', error.message);
  process.exit(1);
}
