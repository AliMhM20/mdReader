import React, { useEffect, useRef } from 'react';
import { copyContent } from '../utils/exportUtils';
import { FontOption } from '../data/fonts';

interface MarkdownPreviewProps {
  htmlContent: string;
  theme: 'dark' | 'light';
  isRtl: boolean;
  zoomLevel: number;
  previewRef: React.RefObject<HTMLDivElement | null>;
  selectedPersianFont: FontOption;
  selectedEnglishFont: FontOption;
}

export const MarkdownPreview: React.FC<MarkdownPreviewProps> = ({
  htmlContent,
  theme,
  isRtl,
  zoomLevel,
  previewRef,
  selectedPersianFont,
  selectedEnglishFont,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isDark = theme === 'dark';

  // Attach clean minimal copy buttons to code blocks
  useEffect(() => {
    if (!containerRef.current) return;

    const preElements = containerRef.current.querySelectorAll('pre');
    preElements.forEach((pre) => {
      if (pre.querySelector('.code-copy-btn')) return;

      const button = document.createElement('button');
      button.className =
        'code-copy-btn no-print absolute top-2.5 left-2.5 px-2 py-0.5 text-[11px] rounded transition-all opacity-40 hover:opacity-100 z-10 border';
      button.style.backgroundColor = isDark ? '#1f2329' : '#ece8dd';
      button.style.borderColor = isDark ? '#333944' : '#d2cdbe';
      button.style.color = isDark ? '#cfcec6' : '#3c3e44';
      button.innerText = 'کپی';
      button.title = 'کپی این قطعه کد';

      button.onclick = async (e) => {
        e.stopPropagation();
        const codeText = pre.querySelector('code')?.textContent || pre.textContent || '';
        await copyContent(codeText);
        button.innerText = 'کپی شد';
        button.style.color = isDark ? '#c67d58' : '#8f4b2d';
        setTimeout(() => {
          button.innerText = 'کپی';
          button.style.color = isDark ? '#cfcec6' : '#3c3e44';
        }, 2000);
      };

      pre.style.position = 'relative';
      pre.appendChild(button);
    });
  }, [htmlContent, isDark]);

  const activeFontFamily = isRtl
    ? `${selectedPersianFont.family}, ${selectedEnglishFont.family}`
    : `${selectedEnglishFont.family}, ${selectedPersianFont.family}`;

  return (
    <div
      className={`w-full h-full overflow-y-auto px-4 py-8 md:px-12 flex justify-center transition-colors ${
        isDark ? 'bg-[#121417]' : 'bg-[#f0eee6]'
      }`}
      data-testid="preview-scroll-container"
    >
      <div
        ref={previewRef}
        style={{
          fontSize: `${zoomLevel / 100}rem`,
          fontFamily: activeFontFamily,
        }}
        className={`print-area max-w-4xl w-full rounded-md p-8 sm:p-12 md:p-16 transition-all border ${
          isDark
            ? 'bg-[#191c21] text-[#edece6] border-[#292e37] shadow-lg'
            : 'bg-[#ffffff] text-[#1e2022] border-[#dedacf] shadow-md'
        } ${isRtl ? 'text-right' : 'text-left'}`}
        dir={isRtl ? 'rtl' : 'ltr'}
      >
        <div
          ref={containerRef}
          className="markdown-body"
          style={
            {
              '--border-color': isDark ? '#2b303a' : '#e2ded4',
              '--link-color': isDark ? '#c67d58' : '#8f4b2d',
            } as React.CSSProperties
          }
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </div>
    </div>
  );
};
