/**
 * Utilities for exporting Markdown, Plain Text, HTML, and PDF
 */
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Triggers a file download in the browser
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Export content as Plain Text (.txt)
 */
export function exportAsText(content: string, filename: string = 'document.txt'): void {
  const cleanName = filename.endsWith('.txt') ? filename : `${filename.replace(/\.[^/.]+$/, '')}.txt`;
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  downloadBlob(blob, cleanName);
}

/**
 * Export original or modified content as Markdown (.md)
 */
export function exportAsMarkdown(content: string, filename: string = 'document.md'): void {
  const cleanName = filename.endsWith('.md') ? filename : `${filename.replace(/\.[^/.]+$/, '')}.md`;
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' });
  downloadBlob(blob, cleanName);
}

/**
 * Export styled standalone HTML (.html)
 */
export function exportAsHtml(
  htmlContent: string,
  title: string = 'Document',
  theme: 'light' | 'dark' = 'light',
  isRTL: boolean = false,
  persianFontFamily: string = "'Vazirmatn', system-ui, sans-serif",
  englishFontFamily: string = "'Inter', system-ui, sans-serif"
): void {
  const cleanName = `${title.replace(/[/\\?%*:|"<>]/g, '_').trim() || 'document'}.html`;

  const themeStyles = {
    light: {
      bg: '#ffffff',
      text: '#1e2022',
      border: '#dedacf',
      codeBg: '#f8f7f2',
      quoteBg: '#f6f4ed',
      primary: '#8f4b2d',
    },
    dark: {
      bg: '#191c21',
      text: '#edece6',
      border: '#292e37',
      codeBg: '#121417',
      quoteBg: '#20242a',
      primary: '#c67d58',
    },
  }[theme];

  const fullHtml = `<!DOCTYPE html>
<html lang="${isRTL ? 'fa' : 'en'}" dir="${isRTL ? 'rtl' : 'ltr'}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Fira+Code:wght@400;500;600&family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&family=Lalezar&family=Lora:ital,wght@0,400;0,500;0,600;1,400&family=Merriweather:ital,wght@0,300;0,400;0,700;1,300;1,400&family=Noto+Naskh+Arabic:wght@400;500;600;700&family=Noto+Sans+Arabic:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&family=Vazirmatn:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/rastikerdar/shabnam-font@v5.0.1/dist/font-face.css">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/rastikerdar/sahel-font@v3.4.0/dist/font-face.css">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/rastikerdar/samim-font@v4.0.5/dist/font-face.css">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/rastikerdar/parastoo-font@v1.0.0-alpha5/dist/font-face.css">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/rastikerdar/gandom-font@v0.5.1/dist/font-face.css">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/rastikerdar/tanha-font@v0.3.1/dist/font-face.css">
  <style>
    :root {
      color-scheme: ${theme === 'dark' ? 'dark' : 'light'};
    }
    body {
      font-family: ${isRTL ? `${persianFontFamily}, ${englishFontFamily}` : `${englishFontFamily}, ${persianFontFamily}`};
      background-color: ${themeStyles.bg};
      color: ${themeStyles.text};
      line-height: 1.85;
      padding: 3rem 1.5rem;
      margin: 0 auto;
      max-width: 860px;
    }
    h1, h2, h3, h4, h5, h6 {
      font-weight: 700;
      line-height: 1.3;
      margin-top: 2rem;
      margin-bottom: 0.75rem;
      color: inherit;
    }
    h1 { font-size: 2.25rem; border-bottom: 2px solid ${themeStyles.border}; padding-bottom: 0.5rem; }
    h2 { font-size: 1.75rem; border-bottom: 1px solid ${themeStyles.border}; padding-bottom: 0.4rem; }
    h3 { font-size: 1.35rem; }
    p, ul, ol, table, blockquote, pre { margin-bottom: 1.25rem; }
    a { color: ${themeStyles.primary}; text-decoration: underline; text-underline-offset: 3px; }
    code {
      font-family: 'Fira Code', monospace;
      font-size: 0.88em;
      background: ${themeStyles.codeBg};
      padding: 0.2em 0.4em;
      border-radius: 4px;
      border: 1px solid ${themeStyles.border};
    }
    pre {
      background: ${themeStyles.codeBg};
      border: 1px solid ${themeStyles.border};
      padding: 1rem;
      border-radius: 8px;
      overflow-x: auto;
    }
    pre code { background: none; border: none; padding: 0; font-size: 0.9em; }
    blockquote {
      border-${isRTL ? 'right' : 'left'}: 4px solid ${themeStyles.primary};
      background: ${themeStyles.quoteBg};
      padding: 0.75rem 1.25rem;
      border-radius: 0 6px 6px 0;
      margin: 1.5rem 0;
      font-style: italic;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 1.5rem 0;
    }
    th, td {
      border: 1px solid ${themeStyles.border};
      padding: 0.6rem 0.9rem;
      text-align: ${isRTL ? 'right' : 'left'};
    }
    th {
      background: ${themeStyles.quoteBg};
      font-weight: 600;
    }
    hr {
      border: 0;
      border-top: 2px dashed ${themeStyles.border};
      margin: 2rem 0;
    }
    img { max-width: 100%; height: auto; border-radius: 6px; }
    @media print {
      body { background: #fff !important; color: #000 !important; max-width: 100% !important; padding: 0 !important; }
      pre, blockquote, table { page-break-inside: avoid; }
    }
  </style>
</head>
<body>
  ${htmlContent}
</body>
</html>`;

  const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' });
  downloadBlob(blob, cleanName);
}

/**
 * Generate PDF file directly from an HTML container element using jsPDF and html2canvas
 */
export async function exportAsPdf(
  element: HTMLElement,
  filename: string = 'document.pdf',
  onProgress?: (status: string) => void
): Promise<void> {
  const cleanName = filename.endsWith('.pdf') ? filename : `${filename.replace(/\.[^/.]+$/, '')}.pdf`;
  
  if (onProgress) onProgress('آماده‌سازی سند برای ایجاد PDF...');

  try {
    // Clone container or render canvas
    const canvas = await html2canvas(element, {
      scale: 2, // 2x for sharp retina text rendering
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: element.scrollWidth,
    });

    if (onProgress) onProgress('تولید صفحات PDF...');

    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const imgWidth = pdfWidth;
    const imgHeight = (canvas.height * pdfWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    // First page
    pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;

    // Additional pages if needed
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;
    }

    if (onProgress) onProgress('در حال دانلود فایل PDF...');
    pdf.save(cleanName);
  } catch (error) {
    console.error('PDF export failed:', error);
    throw error;
  }
}

/**
 * Trigger native browser Print to PDF
 */
export function printDocument(): void {
  window.print();
}

/**
 * Copy plain text or rich HTML to clipboard
 */
export async function copyContent(text: string, html?: string): Promise<boolean> {
  try {
    if (html && navigator.clipboard && window.ClipboardItem) {
      const textBlob = new Blob([text], { type: 'text/plain' });
      const htmlBlob = new Blob([html], { type: 'text/html' });
      await navigator.clipboard.write([
        new ClipboardItem({
          'text/plain': textBlob,
          'text/html': htmlBlob,
        }),
      ]);
      return true;
    } else {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch (error) {
    console.warn('Clipboard write failed, using fallback:', error);
    try {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      return true;
    } catch {
      return false;
    }
  }
}
