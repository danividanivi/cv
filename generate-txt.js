#!/usr/bin/env node
const fs = require('fs');

function formatDateYM(s) {
  if (!s) return '';
  // Expect YYYY-MM form already; fallback parse
  const m = /^\d{4}-\d{2}$/.test(s)
    ? s.split('-')
    : new Date(s).toISOString().slice(0, 7).split('-');
  const [year, month] = m;
  return `${year}-${month}`;
}

function generateTXT(resume, outputPath, includeArchived = false) {
  const lines = [];

  const b = resume.basics || {};
  lines.push(`${b.name || ''}`.trim());
  if (b.label) lines.push(b.label);
  const contact = [];
  if (b.email) contact.push(b.email);
  if (b.phone) contact.push(b.phone);
  if (b.location) {
    const locParts = [b.location.city, b.location.region, b.location.countryCode]
      .filter(Boolean)
      .join(', ');
    if (locParts) contact.push(locParts);
  }
  (b.profiles || []).forEach((p) => {
    if (p.url) contact.push(p.url);
  });
  if (contact.length) lines.push(contact.join(' | '));
  if (b.summary) {
    lines.push('\nSUMMARY');
    lines.push(b.summary);
  }

  // Experience
  let workEntries = resume.work || [];
  if (!includeArchived) {
    workEntries = workEntries.filter((w) => !w._archived);
  }
  if (workEntries.length) {
    lines.push('\nEXPERIENCE');
    workEntries.forEach((w) => {
      const start = formatDateYM(w.startDate);
      const end = w.endDate ? formatDateYM(w.endDate) : 'Present';
      lines.push(`\n${w.position || ''} – ${w.name || ''}`.trim());
      lines.push(`${start} - ${end} | ${w.location || ''}`.trim());
      if (w.summary) lines.push(w.summary);
      if (Array.isArray(w.highlights)) {
        w.highlights.forEach((h) => lines.push(` - ${h}`));
      }
    });
  }

  // Education
  if (resume.education && resume.education.length) {
    lines.push('\nEDUCATION');
    resume.education.forEach((e) => {
      const start = formatDateYM(e.startDate);
      const end = e.endDate ? formatDateYM(e.endDate) : 'Present';
      lines.push(`\n${e.studyType} – ${e.area}`);
      lines.push(`${e.institution}`);
      lines.push(`${start} - ${end}`);
      if (includeArchived && e.courses) {
        e.courses.forEach((c) => lines.push(` - ${c}`));
      }
    });
  }

  // Skills (flatten keywords)
  if (resume.skills && resume.skills.length) {
    lines.push('\nSKILLS');
    resume.skills.forEach((s) => {
      const kw = (s.keywords || []).join(', ');
      lines.push(`${s.name}: ${kw}`);
    });
  }

  // Languages
  if (resume.languages && resume.languages.length) {
    lines.push('\nLANGUAGES');
    resume.languages.forEach((l) => lines.push(`${l.language}: ${l.fluency}`));
  }

  // Volunteer
  if (includeArchived && resume.volunteer && resume.volunteer.length) {
    lines.push('\nVOLUNTEER EXPERIENCE');
    resume.volunteer.forEach((v) => {
      const start = formatDateYM(v.startDate);
      const end = v.endDate ? formatDateYM(v.endDate) : 'Present';
      lines.push(`\n${v.position} – ${v.organization}`);
      lines.push(`${start} - ${end}`);
      if (v.summary) lines.push(v.summary);
      if (Array.isArray(v.highlights)) {
        v.highlights.forEach((h) => lines.push(` - ${h}`));
      }
    });
  }

  // References (full text for two-page version)
  if (includeArchived && resume.references && resume.references.length) {
    lines.push('\nREFERENCES');
    resume.references.forEach((r) => {
      lines.push(`\n${r.name}`);
      if (r.reference) lines.push(r.reference);
      if (r.url) lines.push(`(${r.url})`);
    });
  }

  const output = lines.join('\n').replace(/\u00A0/g, ' ');
  fs.writeFileSync(outputPath, output, 'utf8');
  console.log(`Plain text resume written to ${outputPath}`);
}

const resume = JSON.parse(fs.readFileSync('resume.json', 'utf8'));
generateTXT(resume, 'resume.txt');
