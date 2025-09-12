const fs = require('fs');
const path = require('path');
const Handlebars = require('handlebars');

// Register Handlebars helpers for date formatting
Handlebars.registerHelper('monthName', function(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return monthNames[date.getMonth()];
});

Handlebars.registerHelper('year', function(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.getFullYear();
});

function render(resume) {
  const css = fs.readFileSync(path.join(__dirname, 'style.css'), 'utf-8');
  const template = fs.readFileSync(path.join(__dirname, 'resume.hbs'), 'utf-8');

  const compiledTemplate = Handlebars.compile(template);

  return compiledTemplate({
    css: css,
    resume: resume
  });
}

module.exports = { render };
