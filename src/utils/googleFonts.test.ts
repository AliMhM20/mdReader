import test from 'node:test';
import assert from 'node:assert/strict';
import {
  formatFontFamilyForUrl,
  formatFontDisplayName,
  buildGoogleFontUrl,
  validateFontName,
  detectFontLanguage,
} from './googleFonts.ts';

test('formatFontFamilyForUrl formats spaces as pluses with title case', () => {
  assert.equal(formatFontFamilyForUrl('roboto'), 'Roboto');
  assert.equal(formatFontFamilyForUrl('roboto slab'), 'Roboto+Slab');
  assert.equal(formatFontFamilyForUrl('  open   sans  '), 'Open+Sans');
});

test('formatFontDisplayName cleans up font names for UI display', () => {
  assert.equal(formatFontDisplayName('amiri'), 'Amiri');
  assert.equal(formatFontDisplayName('scheherazade new'), 'Scheherazade New');
});

test('buildGoogleFontUrl generates proper Google Fonts CSS2 URL', () => {
  const url = buildGoogleFontUrl('Montserrat');
  assert.ok(url.startsWith('https://fonts.googleapis.com/css2?family=Montserrat'));
  assert.ok(url.includes('display=swap'));
});

test('validateFontName checks input for emptiness and invalid characters', () => {
  const empty = validateFontName('');
  assert.equal(empty.valid, false);

  const short = validateFontName('a');
  assert.equal(short.valid, false);

  const persianLetters = validateFontName('فونت فارسی');
  assert.equal(persianLetters.valid, false);
  assert.ok(persianLetters.error?.includes('انگلیسی'));

  const valid = validateFontName('Open Sans');
  assert.equal(valid.valid, true);
});

test('detectFontLanguage accurately detects Arabic/Persian fonts from Google Fonts', () => {
  assert.equal(detectFontLanguage('Amiri'), 'fa');
  assert.equal(detectFontLanguage('Scheherazade New'), 'fa');
  assert.equal(detectFontLanguage('Cairo'), 'fa');
  assert.equal(detectFontLanguage('Montserrat'), 'en');
  assert.equal(detectFontLanguage('Roboto'), 'en');
});
