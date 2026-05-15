const fs = require('fs');
const path = require('path');

// Mock Handlebars
const Handlebars = {
  helpers: {},
  registerHelper: function(name, fn) {
    this.helpers[name] = fn;
  }
};

const helpersModule = require('./shared/handlebars-helpers');
helpersModule.registerHelpers(Handlebars);

const highlightSkills = Handlebars.helpers.highlightSkills;

function assertEquals(actual, expected, message) {
  if (actual !== expected) {
    console.error('FAIL:', message);
    console.error('  Expected:', JSON.stringify(expected));
    console.error('  Actual:  ', JSON.stringify(actual));
    process.exit(1);
  }
  console.log('PASS:', message);
}

const skills = [
  { keywords: ['JavaScript', 'Node.js', 'React'] },
  { keywords: ['Air Traffic Control', 'Yocto Project'] }
];

console.log('Running tests for highlightSkills...');

// Happy path
assertEquals(
  highlightSkills('I love JavaScript and React.', skills),
  'I love <strong>JavaScript</strong> and <strong>React</strong>.',
  'should highlight direct keyword matches'
);

// Synonyms
assertEquals(
  highlightSkills('Experience with ATC and Yocto.', skills),
  'Experience with <strong>ATC</strong> and <strong>Yocto</strong>.',
  'should highlight synonyms'
);

// Excluded skills
const skillsWithExcluded = [
  { keywords: ['JavaScript', 'Ada', 'RTK'] }
];
assertEquals(
  highlightSkills('I used JavaScript, Ada and RTK.', skillsWithExcluded),
  'I used <strong>JavaScript</strong>, Ada and RTK.',
  'should highlight JavaScript but not excluded skills Ada and RTK'
);

// Edge cases: null/undefined/empty
assertEquals(highlightSkills('', skills), '', 'should handle empty text');
assertEquals(highlightSkills(null, skills), '', 'should handle null text');
assertEquals(highlightSkills('Text', null), 'Text', 'should handle null skills');
assertEquals(highlightSkills('Text', []), 'Text', 'should handle empty skills');

// Overlapping skills
const overlappingSkills = [
  { keywords: ['Google Test', 'Google'] }
];
assertEquals(
  highlightSkills('I use Google Test.', overlappingSkills),
  'I use <strong>Google Test</strong>.',
  'should prefer longer matches (Google Test over Google)'
);

// Word boundaries
assertEquals(
  highlightSkills('Reacting to React', skills),
  'Reacting to <strong>React</strong>',
  'should respect word boundaries for alnum keywords'
);

const specialSkills = [{ keywords: ['C++', 'C#'] }];
assertEquals(
  highlightSkills('I code in C++ and C#', specialSkills),
  'I code in <strong>C++</strong> and <strong>C#</strong>',
  'should highlight keywords with special characters'
);

console.log('All tests passed!');
