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

Handlebars.registerHelper('highlightSkills', function(text, skills) {
  if (!text) return '';
  if (!skills || skills.length === 0) return text;

  // Collect all keywords from skills
  const keywords = [];
  skills.forEach(skill => {
    if (skill.keywords) {
      keywords.push(...skill.keywords);
    }
  });

  // Remove duplicates and sort by length descending
  const uniqueKeywords = [...new Set(keywords)].sort((a, b) => b.length - a.length);

  // Replace matching words with bold
  let highlighted = text;
  uniqueKeywords.forEach(keyword => {
    // Handle different types of keywords
    if (keyword.includes('/')) {
      // For keywords with slashes like "Github/Gitlab CI/CD", try to match parts
      const parts = keyword.split('/').map(part => part.trim());
      parts.forEach(part => {
        if (part && part.length > 2) { // Only match meaningful parts
          const escapedPart = part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
          const partRegex = new RegExp(`\\b${escapedPart}\\b`, 'gi');
          highlighted = highlighted.replace(partRegex, `<strong>$&</strong>`);
        }
      });
    } else {
      // For regular keywords
      const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      // Use word boundaries for alphanumeric keywords, but allow partial matches for special chars
      const regex = keyword.match(/^[a-zA-Z0-9\s]+$/) 
        ? new RegExp(`\\b${escapedKeyword}\\b`, 'gi')
        : new RegExp(escapedKeyword.replace(/\s+/g, '\\s+'), 'gi');
      highlighted = highlighted.replace(regex, `<strong>$&</strong>`);
    }
  });

  return highlighted;
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
