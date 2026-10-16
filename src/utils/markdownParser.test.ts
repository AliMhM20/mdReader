import test from 'node:test';
import assert from 'node:assert/strict';
import {
  isRTL,
  slugify,
  extractHeadings,
  calculateStats,
  markdownToPlainText,
} from './markdownParser.ts';

test('isRTL detects Persian and Arabic text', () => {
  assert.equal(isRTL('سلام دنیا! این یک متن آزمایشی است.'), true);
  assert.equal(isRTL('Hello world! This is English.'), false);
  assert.equal(isRTL(''), false);
});

test('slugify generates clean URL anchors including Persian characters', () => {
  assert.equal(slugify('Hello World'), 'hello-world');
  assert.equal(slugify('بخش اول: معرفی'), 'بخش-اول-معرفی');
  assert.equal(slugify('  Testing $#@ symbols!  '), 'testing-symbols');
});

test('extractHeadings parses heading levels and texts without code block false positives', () => {
  const md = `
# Main Title
Intro paragraph.

## Sub Section
Some info here.

\`\`\`markdown
# Not a real heading
\`\`\`

### Deep Section
Details.
`;

  const headings = extractHeadings(md);
  assert.equal(headings.length, 3);
  assert.equal(headings[0].level, 1);
  assert.equal(headings[0].text, 'Main Title');
  assert.equal(headings[1].level, 2);
  assert.equal(headings[1].text, 'Sub Section');
  assert.equal(headings[2].level, 3);
  assert.equal(headings[2].text, 'Deep Section');
});

test('calculateStats counts words, characters, and reading time correctly', () => {
  const empty = calculateStats('');
  assert.equal(empty.words, 0);
  assert.equal(empty.lines, 0);

  const sample = calculateStats('یک دو سه چهار پنج\nشش هفت هشت نه ده');
  assert.equal(sample.words, 10);
  assert.equal(sample.lines, 2);
  assert.equal(sample.readingTimeMinutes, 1);
});

test('markdownToPlainText cleanly strips Markdown syntax', () => {
  const md = `# Title
This is **bold** and *italic* and \`inline code\`.
[Google](https://google.com)
> A great quote

* Item 1
* Item 2

\`\`\`js
console.log('hello');
\`\`\`
`;

  const plain = markdownToPlainText(md);
  assert.ok(!plain.includes('# Title'));
  assert.ok(plain.includes('Title'));
  assert.ok(!plain.includes('**bold**'));
  assert.ok(plain.includes('bold'));
  assert.ok(!plain.includes('[Google]('));
  assert.ok(plain.includes('Google'));
  assert.ok(plain.includes('console.log(\'hello\');'));
});
