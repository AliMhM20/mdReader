import React from 'react';
import { FileText, Minus, Square, X, RefreshCw, Feather } from 'lucide-react';

interface TitleBarProps {
  fileName: string;
  isModified: boolean;
  onReset: () => void;
  onToggleMaximize?: () => void;
  isMaximized?: boolean;
  theme: 'dark' | 'light';
}

export const TitleBar: React.FC<TitleBarProps> = ({
  fileName,
  isModified,
  onReset,
  onToggleMaximize,
  isMaximized,
  theme,
}) => {
  const isDark = theme === 'dark';

  return (
    <header
      className={`no-print h-9 border-b flex items-center justify-between px-3 select-none z-30 shrink-0 text-xs transition-colors ${
        isDark
          ? 'bg-[#16181b] border-[#25282f] text-[#c7c5bc]'
          : 'bg-[#eeece4] border-[#d8d5cb] text-[#3c3e44]'
      }`}
      data-testid="windows-titlebar"
    >
      {/* Left: App Logo & Current File */}
      <div className="flex items-center gap-2 overflow-hidden">
        <div
          className={`w-4 h-4 rounded flex items-center justify-center font-serif text-[11px] font-bold ${
            isDark ? 'bg-[#c67d58] text-[#141619]' : 'bg-[#8f4b2d] text-white'
          }`}
          title="Markdown Classic"
        >
          ¶
        </div>
        <span
          className={`font-semibold tracking-wide hidden sm:inline ${
            isDark ? 'text-[#edece6]' : 'text-[#1e2022]'
          }`}
        >
          Markdown Studio
        </span>
        <span className="opacity-40 hidden sm:inline">|</span>
        <div className="flex items-center gap-1.5 truncate max-w-xs sm:max-w-md">
          <FileText className={`w-3.5 h-3.5 shrink-0 ${isDark ? 'text-[#c67d58]' : 'text-[#8f4b2d]'}`} />
          <span className="font-medium truncate" title={fileName}>
            {fileName}
          </span>
          {isModified && (
            <span
              className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                isDark ? 'bg-[#c67d58]' : 'bg-[#8f4b2d]'
              }`}
              title="تغییرات ذخیره نشده"
            />
          )}
        </div>
      </div>

      {/* Center: Classic Minimal Badge */}
      <div className="hidden md:flex items-center gap-1.5 text-[10px] tracking-wider uppercase opacity-60 font-mono">
        <Feather className="w-3 h-3" />
        <span>Classical & Minimalist Edition</span>
      </div>

      {/* Right: Windows Window Controls */}
      <div className="flex items-center -mr-2">
        <button
          onClick={onReset}
          className={`h-9 w-8 flex items-center justify-center transition-colors ${
            isDark ? 'text-[#8e8d85] hover:text-[#edece6] hover:bg-[#202328]' : 'text-[#6e6c64] hover:text-[#1e2022] hover:bg-[#e2dfd5]'
          }`}
          title="سند جدید"
          aria-label="سند جدید"
        >
          <RefreshCw className="w-3 h-3" />
        </button>
        <button
          className={`h-9 w-8 flex items-center justify-center transition-colors ${
            isDark ? 'text-[#8e8d85] hover:text-[#edece6] hover:bg-[#202328]' : 'text-[#6e6c64] hover:text-[#1e2022] hover:bg-[#e2dfd5]'
          }`}
          title="کمینه کردن"
          aria-label="کمینه کردن"
        >
          <Minus className="w-3 h-3" />
        </button>
        <button
          onClick={onToggleMaximize}
          className={`h-9 w-8 flex items-center justify-center transition-colors ${
            isDark ? 'text-[#8e8d85] hover:text-[#edece6] hover:bg-[#202328]' : 'text-[#6e6c64] hover:text-[#1e2022] hover:bg-[#e2dfd5]'
          }`}
          title={isMaximized ? "خروج از تمام‌صفحه" : "بزرگ‌نمایی"}
          aria-label={isMaximized ? "خروج از تمام‌صفحه" : "بزرگ‌نمایی"}
        >
          <Square className="w-2.5 h-2.5" />
        </button>
        <button
          onClick={onReset}
          className="h-9 w-9 flex items-center justify-center text-[#8e8d85] hover:text-white hover:bg-[#b93838] transition-colors"
          title="بستن"
          aria-label="بستن"
        >
          <X className="w-3 h-3" />
        </button>
      </div>
    </header>
  );
};
