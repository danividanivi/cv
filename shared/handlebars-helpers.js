/**
 * Shared Handlebars helpers for resume themes
 */

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

// Skills to exclude from highlighting (deprecated technologies)
const EXCLUDE_SKILLS = new Set(['Ada', 'RTK']);

// Synonyms for skill matching
const SKILL_SYNONYMS = {
  'Air Traffic Control': ['ATC'],
  'Yocto Project': ['Yocto'],
  'Google Test': ['gtest'],
};

/**
 * Register all shared helpers on a Handlebars instance
 * @param {Handlebars} Handlebars - The Handlebars instance to register helpers on
 */
function registerHelpers(Handlebars) {
  Handlebars.registerHelper('not', function (value) {
    return !value;
  });

  Handlebars.registerHelper('monthName', function (dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return monthNames[date.getMonth()];
  });

  Handlebars.registerHelper('year', function (dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.getFullYear();
  });

  Handlebars.registerHelper('labelWithBreaks', function (label) {
    if (!label) return '';
    // Replace | separators with <br> for multi-line display
    return label.replace(/\s*\|\s*/g, '<br>');
  });

  Handlebars.registerHelper('highlightSkills', function (text, skills) {
    if (!text || !skills) return text || '';

    // Collect distinct keywords (case-sensitive) excluding deprecated ones
    const set = new Set();
    skills.forEach((s) =>
      (s.keywords || []).forEach((k) => {
        if (!EXCLUDE_SKILLS.has(k)) set.add(k);
      })
    );

    // Add synonyms
    const newSet = new Set(set);
    set.forEach((k) => {
      if (SKILL_SYNONYMS[k]) {
        SKILL_SYNONYMS[k].forEach((syn) => newSet.add(syn));
      }
    });

    if (newSet.size === 0) return text;

    // Sort by length desc to avoid shorter tokens wrapping inside longer ones
    const ordered = Array.from(newSet).sort((a, b) => b.length - a.length);

    // Build a single regex of alternations with word boundaries where safe
    const parts = ordered.map((k) => {
      const escaped = k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      // If purely alnum and _ , treat as whole word; else just exact literal
      return /^[A-Za-z0-9_]+$/.test(k) ? `\\b${escaped}\\b` : escaped;
    });

    const regex = new RegExp(`(${parts.join('|')})`, 'g');

    return text.replace(regex, (m) => `<strong>${m}</strong>`);
  });
}

module.exports = { registerHelpers };
