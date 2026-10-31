'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const catalogs = require('../locales.js');

const renderer = fs.readFileSync(path.join(__dirname, '../renderer.js'), 'utf8');
const locales = ['az', 'en', 'es', 'fr', 'ja', 'ko', 'pt-BR', 'tr', 'zh-Hans'];

const settingsText = [
  'Settings',
  'General',
  'Sources',
  'History',
  'Keyboard shortcuts',
  'Updates',
  'About',
  'Language',
  'System language',
  'Colors',
  'Soft colors',
  'Neutral glass',
  'Card size',
  'Small',
  'Medium',
  'Large',
  'Open after screenshot',
  'Focus the captured image immediately so Enter and Space work.',
  'Sounds',
  'Launch at login',
  'Images',
  'Texts',
  'Links',
  'Capture copied images',
  'Capture copied text',
  'Text copies never open the shelves automatically.',
  'Capture copied links',
  'A standalone URL becomes a link; paragraphs remain text.',
  'Fetch link titles and thumbnails',
  'Optional network access to the linked public website or YouTube.',
  'Recognize text in new images',
  'On-device OCR indexes new images for search.',
  'Watch image folders',
  'Add folder',
  'External originals stay in place.',
  'Private clipboard markers are ignored. YouTube/site metadata may contact the public linked website; OCR runs locally.'
];

const translatedLabels = [
  'Settings', 'General', 'Sources', 'History', 'Keyboard shortcuts', 'Updates',
  'About', 'Language', 'System language', 'Colors', 'Soft colors',
  'Neutral glass', 'Card size', 'Open after screenshot', 'Launch at login',
  'Images', 'Texts', 'Links', 'Capture copied images', 'Capture copied text',
  'Capture copied links', 'Fetch link titles and thumbnails',
  'Recognize text in new images', 'Watch image folders', 'Add folder'
];

const validSameSpelling = {
  es: new Set(['General']),
  fr: new Set(['Sources', 'Images']),
  'pt-BR': new Set(['Links'])
};

test('General and Sources copy exists in all nine locale catalogs', () => {
  assert.deepEqual(Object.keys(catalogs).sort(), locales);
  for (const locale of locales) {
    for (const key of settingsText) {
      assert.equal(typeof catalogs[locale][key], 'string', `${locale} is missing: ${key}`);
      assert.notEqual(catalogs[locale][key].trim(), '', `${locale} is blank: ${key}`);
    }
  }
});

test('settings labels use a translated value in every non-English locale', () => {
  for (const locale of locales.filter(value => value !== 'en')) {
    for (const key of translatedLabels) {
      if (validSameSpelling[locale]?.has(key)) continue;
      assert.notEqual(catalogs[locale][key], key, `${locale} leaves this label in English: ${key}`);
    }
  }
});

test('settings help text and privacy note pass through the locale lookup', () => {
  assert.match(renderer, /description\?`<small>\$\{esc\(t\(description\)\)\}<\/small>`/);
  assert.match(renderer, /esc\(t\('Private clipboard markers are ignored\.[^']*'\)\)/);
});
