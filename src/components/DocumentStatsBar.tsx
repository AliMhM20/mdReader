import React from 'react';
import { ReadingStats } from '../utils/markdownParser';
import { AlignRight, AlignLeft, Clock, FileText, Check, Type } from 'lucide-react';
import { FontOption } from '../data/fonts';

interface DocumentStatsBarProps {
  stats: ReadingStats;
  fileName: string;
  isRtlText: boolean;
  theme: 'dark' | 'light';
  selectedPersianFont: FontOption;
  selectedEnglishFont: FontOption;
}

export const DocumentStatsBar: React.FC<DocumentStatsBarProps> = ({
  stats,
  isRtlText,
  theme,
  selectedPersianFont,
  selectedEnglishFont,
}) => {
  const isDark = theme === 'dark';

  return (
    <footer
      className={`no-print h-7 border-t text-[11px] px-3 flex items-center justify-between select-none shrink-0 z-20 overflow-x-auto transition-colors ${
        isDark
          ? 'bg-[#15171a] border-[#25282f] text-[#9b9991]'
          : 'bg-[#eeece4] border-[#d8d5cb] text-[#55534d]'
      }`}
      data-testid="status-bar"
    >
      {/* Left: Document stats */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5 opacity-90">
          <Check className={`w-3 h-3 ${isDark ? 'text-[#c67d58]' : 'text-[#8f4b2d]'}`} />
          <span>آماده</span>
        </div>
        <div className="hidden sm:flex items-center gap-1">
          <span>کلمات:</span>
          <span className="font-semibold text-current">{stats.words.toLocaleString()}</span>
        </div>
        <div className="hidden md:flex items-center gap-1">
          <span>کاراکترها:</span>
          <span className="font-semibold text-current">{stats.characters.toLocaleString()}</span>
        </div>
        <div className="hidden sm:flex items-center gap-1">
          <span>سطرها:</span>
          <span className="font-semibold text-current">{stats.lines.toLocaleString()}</span>
        </div>
      </div>

      {/* Right: Meta, Active Font & Direction */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5" title="قلم‌های فعال سند">
          <Type className="w-3 h-3 opacity-60" />
          <span className="truncate max-w-[150px]">
            {selectedPersianFont.name.split(' ')[0]} + {selectedEnglishFont.name}
          </span>
        </div>

        <div className="flex items-center gap-1" title="زمان تخمینی مطالعه">
          <Clock className="w-3 h-3 opacity-60" />
          <span>~{stats.readingTimeMinutes} دقیقه</span>
        </div>

        <div
          className="flex items-center gap-1 opacity-90"
          title={`جهت متن: ${isRtlText ? 'راست‌چین (فارسی)' : 'چپ‌چین (انگلیسی)'}`}
        >
          {isRtlText ? (
            <>
              <AlignRight className="w-3 h-3 opacity-70" />
              <span>RTL</span>
            </>
          ) : (
            <>
              <AlignLeft className="w-3 h-3 opacity-70" />
              <span>LTR</span>
            </>
          )}
        </div>

        <div className="hidden sm:block opacity-60">
          UTF-8
        </div>
      </div>
    </footer>
  );
};
