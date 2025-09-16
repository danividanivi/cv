#!/usr/bin/env node
const fs = require('fs');

function formatDateYM(s) {
  if (!s) return '';
  // Expect YYYY-MM form already; fallback parse
  const m = /^\d{4}-\d{2}$/.test(s) ? s.split('-') : (new Date(s).toISOString().slice(0,7).split('-'));
  const [year, month] = m;
  return `${year}-${month}`;
}

const resume = JSON.parse(fs.readFileSync('resume.json','utf8'));
const lines = [];

const b = resume.basics || {};
lines.push(`${b.name || ''}`.trim());
if (b.label) lines.push(b.label);
const contact = [];
if (b.email) contact.push(b.email);
if (b.phone) contact.push(b.phone);
if (b.location) {
  const locParts = [b.location.city, b.location.region, b.location.countryCode].filter(Boolean).join(', ');
  if (locParts) contact.push(locParts);
}
(b.profiles||[]).forEach(p=>{ if (p.url) contact.push(p.url); });
if (contact.length) lines.push(contact.join(' | '));
if (b.summary) { lines.push('\nSUMMARY'); lines.push(b.summary); }

// Experience
if (resume.work && resume.work.length) {
  lines.push('\nEXPERIENCE');
  resume.work.filter(w => !w._archived).forEach(w => {
    const start = formatDateYM(w.startDate);
    const end = w.endDate ? formatDateYM(w.endDate) : 'Present';
    lines.push(`\n${w.position || ''} – ${w.name || ''}`.trim());
    lines.push(`${start} - ${end} | ${w.location || ''}`.trim());
    if (w.summary) lines.push(w.summary);
    if (Array.isArray(w.highlights)) {
      w.highlights.forEach(h => lines.push(` - ${h}`));
    }
  });
}

// Education
if (resume.education && resume.education.length) {
  lines.push('\nEDUCATION');
  resume.education.forEach(e => {
    const start = formatDateYM(e.startDate);
    const end = e.endDate ? formatDateYM(e.endDate) : 'Present';
    lines.push(`\n${e.studyType} – ${e.area}`);
    lines.push(`${e.institution}`);
    lines.push(`${start} - ${end}`);
  });
}

// Skills (flatten keywords)
if (resume.skills && resume.skills.length) {
  lines.push('\nSKILLS');
  resume.skills.forEach(s => {
    const kw = (s.keywords||[]).join(', ');
    lines.push(`${s.name}: ${kw}`);
  });
}

// Languages
if (resume.languages && resume.languages.length) {
  lines.push('\nLANGUAGES');
  resume.languages.forEach(l => lines.push(`${l.language}: ${l.fluency}`));
}

// References (names only, no long text by default)
if (resume.references && resume.references.length) {
  lines.push('\nREFERENCES');
  resume.references.forEach(r => lines.push(`${r.name} (${r.url || ''})`));
}

const output = lines.join('\n').replace(/\u00A0/g,' ');
fs.writeFileSync('resume.txt', output, 'utf8');
console.log('Plain text resume written to resume.txt');
