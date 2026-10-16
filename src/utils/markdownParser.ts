/**
 * Markdown parsing and text processing utilities
 */
import { Marked } from 'marked';
import DOMPurify from 'dompurify';
import hljs from 'highlight.js';

export interface HeadingItem {
  id: string;
  text: string;
  level: number;
}

export interface ReadingStats {
  words: number;
  characters: number;
  charactersWithoutSpaces: number;
  lines: number;
  readingTimeMinutes: number;
  headingsCount: number;
}

/**
 * Configure Marked instance
 */
const markedInstance = new Marked({
  gfm: true,
  breaks: true,
});

/**
 * Detect if text has strong RTL (Persian / Arabic / Hebrew) characteristics
 */
export function isRTL(text: string): boolean {
  if (!text) return false;
  // Match Persian/Arabic characters range
  const rtlRegex = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;
  const rtlChars = (text.match(new RegExp(rtlRegex, 'g')) || []).length;
  const ltrChars = (text.match(/[A-Za-z]/g) || []).length;
  return rtlChars > ltrChars;
}

/**
 * Slugify heading text for anchor IDs
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\u0600-\u06FF\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

/**
 * Extract Table of Contents from markdown string
 */
export function extractHeadings(markdown: string): HeadingItem[] {
  const headings: HeadingItem[] = [];
  const lines = markdown.split(/\r?\n/);
  let inCodeBlock = false;

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      continue;
    }
    if (inCodeBlock) continue;

    const match = line.match(/^(#{1,6})\s+(.+)$/);
    if (match) {
      const level = match[1].length;
      const rawText = match[2].trim().replace(/[*_`[\]]/g, '');
      const id = slugify(rawText) || `heading-${headings.length + 1}`;
      headings.push({ id, text: rawText, level });
    }
  }

  return headings;
}

/**
 * Calculate reading statistics for text
 */
export function calculateStats(text: string, headingsCount: number = 0): ReadingStats {
  if (!text.trim()) {
    return {
      words: 0,
      characters: 0,
      charactersWithoutSpaces: 0,
      lines: 0,
      readingTimeMinutes: 0,
      headingsCount: 0,
    };
  }

  // Count words across both English and Persian (space-separated or Persian ZWNJ)
  const wordsArray = text.trim().split(/\s+/).filter(Boolean);
  const words = wordsArray.length;
  const characters = text.length;
  const charactersWithoutSpaces = text.replace(/\s/g, '').length;
  const lines = text.split(/\r?\n/).length;
  // Average reading speed: ~200 words per minute
  const readingTimeMinutes = Math.max(1, Math.ceil(words / 200));

  return {
    words,
    characters,
    charactersWithoutSpaces,
    lines,
    readingTimeMinutes,
    headingsCount,
  };
}

/**
 * Convert Markdown to clean plain text (for TXT export and copy)
 */
export function markdownToPlainText(markdown: string): string {
  if (!markdown) return '';

  let text = markdown;

  // Remove code blocks
  text = text.replace(/```[\s\S]*?```/g, (match) => {
    // keep code lines without backticks
    return match
      .replace(/^```[^\n]*\n?/m, '')
      .replace(/\n?```$/m, '');
  });

  // Remove inline code
  text = text.replace(/`([^`]+)`/g, '$1');

  // Remove HTML tags
  text = text.replace(/<[^>]+>/g, '');

  // Remove images ![alt](url)
  text = text.replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1');

  // Convert links [text](url) -> text (url) or text
  text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1');

  // Remove header hashes
  text = text.replace(/^#{1,6}\s+/gm, '');

  // Remove bold / italics
  text = text.replace(/(\*\*|__)(.*?)\1/g, '$2');
  text = text.replace(/(\*|_)(.*?)\1/g, '$2');
  text = text.replace(/~~(.*?)~~/g, '$1');

  // Convert list markers
  text = text.replace(/^(\s*)[*+-]\s+\[[ xX]\]\s+/gm, '$1• ');
  text = text.replace(/^(\s*)[*+-]\s+/gm, '$1• ');
  text = text.replace(/^(\s*)\d+\.\s+/gm, '$1• ');

  // Remove blockquote markers
  text = text.replace(/^>\s+/gm, '');

  // Remove horizontal rules
  text = text.replace(/^(-{3,}|\*{3,}|_{3,})$/gm, '----------------------------------------');

  // Collapse 3+ newlines to 2
  text = text.replace(/\n{3,}/g, '\n\n').trim();

  return text;
}

/**
 * Render Markdown to sanitized HTML with syntax highlighting and anchor headings
 */
export function renderMarkdown(markdown: string): string {
  if (!markdown) return '';

  try {
    const rawHtml = markedInstance.parse(markdown) as string;

    // Apply syntax highlighting to code blocks in rawHtml if needed
    const container = typeof document !== 'undefined' ? document.createElement('div') : null;
    if (container) {
      container.innerHTML = rawHtml;

      // Add IDs to headings for TOC navigation
      container.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach((heading) => {
        const text = heading.textContent || '';
        const id = slugify(text);
        if (id && !heading.id) {
          heading.id = id;
        }
      });

      // Highlight code blocks
      container.querySelectorAll('pre code').forEach((block) => {
        const codeElement = block as HTMLElement;
        const className = codeElement.className || '';
        const langMatch = className.match(/language-(\w+)/);
        const language = langMatch ? langMatch[1] : '';

        if (language && hljs.getLanguage(language)) {
          try {
            codeElement.innerHTML = hljs.highlight(codeElement.textContent || '', { language }).value;
          } catch {
            // fallback
          }
        } else {
          try {
            codeElement.innerHTML = hljs.highlightAuto(codeElement.textContent || '').value;
          } catch {
            // fallback
          }
        }
        codeElement.classList.add('hljs');
      });

      // Sanitize
      return DOMPurify.sanitize(container.innerHTML, {
        ADD_ATTR: ['target', 'id', 'class'],
      });
    }

    return DOMPurify.sanitize(rawHtml);
  } catch (error) {
    console.error('Error rendering markdown:', error);
    return `<div class="p-4 bg-red-950/40 text-red-300 rounded border border-red-800">خطا در پردازش مارک‌داون</div>`;
  }
}
