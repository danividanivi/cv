const fs = require('fs');
const path = require('path');
const Handlebars = require('handlebars');

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
