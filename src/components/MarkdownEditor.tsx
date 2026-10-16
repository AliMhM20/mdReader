import React from 'react';
import {
  Heading1,
  Heading2,
  Bold,
  Italic,
  List,
  ListOrdered,
  CheckSquare,
  Quote,
  Code,
  Table,
  Link2,
} from 'lucide-react';
import { FontOption } from '../data/fonts';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  isRtl: boolean;
  theme: 'dark' | 'light';
  selectedPersianFont: FontOption;
  selectedEnglishFont: FontOption;
}

export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  value,
  onChange,
  isRtl,
  theme,
  selectedPersianFont,
  selectedEnglishFont,
}) => {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const isDark = theme === 'dark';

  const insertSyntax = (before: string, after: string = '', defaultText: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = textarea.value.substring(start, end) || defaultText;

    const replacement = `${before}${selected}${after}`;
    const newValue =
      textarea.value.substring(0, start) + replacement + textarea.value.substring(end);

    onChange(newValue);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + before.length,
        start + before.length + selected.length
      );
    }, 0);
  };

  const activeFont = isRtl
    ? `${selectedPersianFont.family}, monospace`
    : `${selectedEnglishFont.family}, monospace`;

  return (
    <div
      className={`flex flex-col h-full border-r transition-colors ${
        isDark
          ? 'bg-[#15171a] border-[#25282f] text-[#edece6]'
          : 'bg-[#faf9f5] border-[#dedacf] text-[#1e2022]'
      }`}
    >
      {/* Editor mini-toolbar */}
      <div
        className={`h-9 px-3 border-b flex items-center gap-1 overflow-x-auto shrink-0 select-none ${
          isDark ? 'bg-[#181a1d] border-[#25282f]' : 'bg-[#f4f2ea] border-[#dedacf]'
        }`}
      >
        <button
          onClick={() => insertSyntax('# ', '', 'تیتر اصلی')}
          className={`p-1 rounded opacity-70 hover:opacity-100 ${
            isDark ? 'hover:bg-[#252a30]' : 'hover:bg-[#e6e2d6]'
          }`}
          title="افزودن تیتر ۱"
        >
          <Heading1 className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => insertSyntax('## ', '', 'زیرتیتر')}
          className={`p-1 rounded opacity-70 hover:opacity-100 ${
            isDark ? 'hover:bg-[#252a30]' : 'hover:bg-[#e6e2d6]'
          }`}
          title="افزودن تیتر ۲"
        >
          <Heading2 className="w-3.5 h-3.5" />
        </button>
        <div
          className={`w-[1px] h-4 mx-1 ${isDark ? 'bg-[#292e37]' : 'bg-[#d8d4c8]'}`}
        />
        <button
          onClick={() => insertSyntax('**', '**', 'متن پررنگ')}
          className={`p-1 rounded opacity-70 hover:opacity-100 ${
            isDark ? 'hover:bg-[#252a30]' : 'hover:bg-[#e6e2d6]'
          }`}
          title="متن پررنگ (Bold)"
        >
          <Bold className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => insertSyntax('*', '*', 'متن مورب')}
          className={`p-1 rounded opacity-70 hover:opacity-100 ${
            isDark ? 'hover:bg-[#252a30]' : 'hover:bg-[#e6e2d6]'
          }`}
          title="متن مورب (Italic)"
        >
          <Italic className="w-3.5 h-3.5" />
        </button>
        <div
          className={`w-[1px] h-4 mx-1 ${isDark ? 'bg-[#292e37]' : 'bg-[#d8d4c8]'}`}
        />
        <button
          onClick={() => insertSyntax('- ', '', 'مورد')}
          className={`p-1 rounded opacity-70 hover:opacity-100 ${
            isDark ? 'hover:bg-[#252a30]' : 'hover:bg-[#e6e2d6]'
          }`}
          title="فهرست نشانه‌دار"
        >
          <List className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => insertSyntax('1. ', '', 'مورد اول')}
          className={`p-1 rounded opacity-70 hover:opacity-100 ${
            isDark ? 'hover:bg-[#252a30]' : 'hover:bg-[#e6e2d6]'
          }`}
          title="فهرست شماره‌دار"
        >
          <ListOrdered className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => insertSyntax('- [ ] ', '', 'وظیفه جدید')}
          className={`p-1 rounded opacity-70 hover:opacity-100 ${
            isDark ? 'hover:bg-[#252a30]' : 'hover:bg-[#e6e2d6]'
          }`}
          title="چک‌لیست وظایف"
        >
          <CheckSquare className="w-3.5 h-3.5" />
        </button>
        <div
          className={`w-[1px] h-4 mx-1 ${isDark ? 'bg-[#292e37]' : 'bg-[#d8d4c8]'}`}
        />
        <button
          onClick={() => insertSyntax('> ', '', 'متن نقل قول')}
          className={`p-1 rounded opacity-70 hover:opacity-100 ${
            isDark ? 'hover:bg-[#252a30]' : 'hover:bg-[#e6e2d6]'
          }`}
          title="نقل‌قول"
        >
          <Quote className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => insertSyntax('```javascript\n', '\n```', '// کد خود را بنویسید')}
          className={`p-1 rounded opacity-70 hover:opacity-100 ${
            isDark ? 'hover:bg-[#252a30]' : 'hover:bg-[#e6e2d6]'
          }`}
          title="بلاک کد"
        >
          <Code className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() =>
            insertSyntax(
              '| ستون ۱ | ستون ۲ |\n| --- | --- |\n| سطر ۱ | مقدار ۱ |\n',
              ''
            )
          }
          className={`p-1 rounded opacity-70 hover:opacity-100 ${
            isDark ? 'hover:bg-[#252a30]' : 'hover:bg-[#e6e2d6]'
          }`}
          title="جدول"
        >
          <Table className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => insertSyntax('[عنوان لینک](', ')', 'https://example.com')}
          className={`p-1 rounded opacity-70 hover:opacity-100 ${
            isDark ? 'hover:bg-[#252a30]' : 'hover:bg-[#e6e2d6]'
          }`}
          title="پیوند"
        >
          <Link2 className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Main Textarea */}
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="متن مارک‌داون را اینجا تایپ کنید یا فایلی را به درون پنجره بیندازید..."
        className={`flex-1 w-full p-6 text-xs sm:text-sm leading-relaxed resize-none focus:outline-none transition-colors ${
          isDark
            ? 'bg-[#15171a] text-[#edece6] placeholder-[#555a64]'
            : 'bg-[#faf9f5] text-[#1e2022] placeholder-[#a29e92]'
        }`}
        style={{ fontFamily: activeFont }}
        dir={isRtl ? 'rtl' : 'ltr'}
        data-testid="markdown-textarea"
        spellCheck={false}
      />
    </div>
  );
};
