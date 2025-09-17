const { execSync } = require('child_process');

console.log('Generating PDF using resume-cli (matching GitHub Actions)...');
try {
  execSync('npx resume-cli export resume.pdf --theme danivi-style --format pdf', { stdio: 'inherit' });
  console.log('PDF generated successfully at resume.pdf');
} catch (error) {
  console.error('Error generating PDF:', error.message);
  process.exit(1);
}
