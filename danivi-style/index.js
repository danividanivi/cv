const fs = require('fs');
const path = require('path');
const Handlebars = require('handlebars');

// Register Handlebars helpers for date formatting
Handlebars.registerHelper('not', function (value) {
  return !value;
});
Handlebars.registerHelper('monthName', function (dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  return monthNames[date.getMonth()];
});

Handlebars.registerHelper('year', function (dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.getFullYear();
});

Handlebars.registerHelper('highlightSkills', function (text, skills) {
  if (!text || !skills) return text || '';

  // Collect distinct keywords (case-sensitive) excluding deprecated ones
  const exclude = new Set(['Ada', 'RTK']);
  const set = new Set();
  skills.forEach((s) =>
    (s.keywords || []).forEach((k) => {
      if (!exclude.has(k)) set.add(k);
    })
  );

  if (set.size === 0) return text;

  // Sort by length desc to avoid shorter tokens wrapping inside longer ones
  const ordered = Array.from(set).sort((a, b) => b.length - a.length);

  // Build a single regex of alternations with word boundaries where safe
  const parts = ordered.map((k) => {
    const escaped = k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    // If purely alnum/+/# etc treat as whole word; else just exact literal
    return /^[A-Za-z0-9_.+#+-]+$/.test(k) ? `\\b${escaped}\\b` : escaped;
  });

  const regex = new RegExp(`(${parts.join('|')})`, 'g');

  return text.replace(regex, (m) => `<strong>${m}</strong>`);
});

function render(resume) {
  const css = fs.readFileSync(path.join(__dirname, 'style.css'), 'utf-8');
  const template = fs.readFileSync(path.join(__dirname, 'resume.hbs'), 'utf-8');

  const compiledTemplate = Handlebars.compile(template);

  return compiledTemplate({
    css: css,
    resume: resume,
  });
}

module.exports = { render };
