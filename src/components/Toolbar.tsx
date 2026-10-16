import React, { useRef, useState, useEffect } from 'react';
import {
  FolderOpen,
  FileDown,
  Printer,
  FileText,
  Eye,
  Columns,
  Code2,
  BookOpen,
  ListTree,
  Sun,
  Moon,
  ZoomIn,
  ZoomOut,
  AlignRight,
  AlignLeft,
  ChevronDown,
} from 'lucide-react';
import { SAMPLE_FILES, SampleFile } from '../data/sampleFiles';
import { FontSelector } from './FontSelector';
import { FontOption } from '../data/fonts';

export type ViewMode = 'preview' | 'split' | 'raw';
export type ThemeMode = 'dark' | 'light';
export type DirectionMode = 'auto' | 'rtl' | 'ltr';

interface ToolbarProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  theme: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
  direction: DirectionMode;
  onDirectionChange: (dir: DirectionMode) => void;
  onOpenFile: (file: File) => void;
  onSelectSample: (sample: SampleFile) => void;
  onOpenExportModal: () => void;
  onQuickPrintPdf: () => void;
  onQuickSaveText: () => void;
  isTocOpen: boolean;
  onToggleToc: () => void;
  zoomLevel: number;
  onZoomChange: (delta: number) => void;
  onResetZoom: () => void;
  headingsCount: number;
  selectedPersianFont: FontOption;
  selectedEnglishFont: FontOption;
  onSelectPersianFont: (font: FontOption) => void;
  onSelectEnglishFont: (font: FontOption) => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  viewMode,
  onViewModeChange,
  theme,
  onThemeChange,
  direction,
  onDirectionChange,
  onOpenFile,
  onSelectSample,
  onOpenExportModal,
  onQuickPrintPdf,
  onQuickSaveText,
  isTocOpen,
  onToggleToc,
  zoomLevel,
  onZoomChange,
  onResetZoom,
  headingsCount,
  selectedPersianFont,
  selectedEnglishFont,
  onSelectPersianFont,
  onSelectEnglishFont,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showSamplesMenu, setShowSamplesMenu] = useState(false);
  const samplesMenuRef = useRef<HTMLDivElement>(null);

  const isDark = theme === 'dark';

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (samplesMenuRef.current && !samplesMenuRef.current.contains(e.target as Node)) {
        setShowSamplesMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onOpenFile(file);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div
      className={`no-print border-b px-3 py-2 flex flex-wrap items-center justify-between gap-2 z-20 text-xs transition-colors ${
        isDark
          ? 'bg-[#181a1d] border-[#25282f] text-[#c7c5bc]'
          : 'bg-[#f4f2ea] border-[#dedacf] text-[#34373d]'
      }`}
      data-testid="main-toolbar"
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".md,.markdown,.txt,.text"
        className="hidden"
        onChange={handleFileChange}
        data-testid="file-input"
      />

      {/* Group 1: File Actions & Typography */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <button
          onClick={() => fileInputRef.current?.click()}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded font-medium border transition-all active:scale-[0.98] ${
            isDark
              ? 'bg-[#252930] hover:bg-[#2d323b] text-[#edece6] border-[#383e49]'
              : 'bg-[#e4e1d6] hover:bg-[#dcd8cb] text-[#1e2022] border-[#cdc8b9]'
          }`}
          title="باز کردن فایل از کامپیوتر (Ctrl+O)"
          aria-label="باز کردن فایل مارک‌داون"
        >
          <FolderOpen className="w-3.5 h-3.5 opacity-80" />
          <span>باز کردن فایل</span>
        </button>

        {/* Samples Dropdown */}
        <div className="relative" ref={samplesMenuRef}>
          <button
            onClick={() => setShowSamplesMenu(!showSamplesMenu)}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded border transition-colors ${
              isDark
                ? 'bg-[#1e2227] hover:bg-[#252a30] text-[#c7c5bc] border-[#2c323b]'
                : 'bg-[#ebe9e1] hover:bg-[#e4e1d7] text-[#34373d] border-[#d7d3c7]'
            }`}
            title="فایل‌های نمونه پیش‌فرض"
            aria-label="انتخاب فایل نمونه"
          >
            <BookOpen className="w-3.5 h-3.5 opacity-70" />
            <span>نمونه‌ها</span>
            <ChevronDown className="w-3 h-3 opacity-50" />
          </button>

          {showSamplesMenu && (
            <div
              className={`absolute top-full mt-1.5 right-0 w-64 rounded-md shadow-xl border py-1 z-50 text-right ${
                isDark
                  ? 'bg-[#1b1e22] border-[#2f353f] text-[#edece6]'
                  : 'bg-[#faf9f5] border-[#dbd8ce] text-[#1e2022]'
              }`}
            >
              <div
                className={`px-3 py-1.5 text-[10px] font-semibold tracking-wider uppercase border-b ${
                  isDark ? 'border-[#292e37] text-[#8e8d85]' : 'border-[#e5e2d8] text-[#716f67]'
                }`}
              >
                نمونه‌های متنی آماده
              </div>
              {SAMPLE_FILES.map((sample) => (
                <button
                  key={sample.id}
                  onClick={() => {
                    onSelectSample(sample);
                    setShowSamplesMenu(false);
                  }}
                  className={`w-full text-right px-3 py-2 flex flex-col transition-colors ${
                    isDark ? 'hover:bg-[#252a30]' : 'hover:bg-[#ede9df]'
                  }`}
                >
                  <span className="font-semibold text-xs">{sample.name}</span>
                  <span className="text-[10px] opacity-70 truncate">{sample.description}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Table of Contents Toggle */}
        <button
          onClick={onToggleToc}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded border transition-colors ${
            isTocOpen
              ? isDark
                ? 'bg-[#292f39] text-white border-[#424b5a]'
                : 'bg-[#dfdcce] text-[#1a1a1a] border-[#c0bba9]'
              : isDark
              ? 'bg-[#1e2227] hover:bg-[#252a30] text-[#c7c5bc] border-[#2c323b]'
              : 'bg-[#ebe9e1] hover:bg-[#e4e1d7] text-[#34373d] border-[#d7d3c7]'
          }`}
          title="فهرست عناوین و هدینگ‌ها"
          aria-label="فهرست عناوین"
        >
          <ListTree className="w-3.5 h-3.5 opacity-80" />
          <span className="hidden sm:inline">فهرست</span>
          <span
            className={`px-1.5 py-0.2 rounded text-[10px] ${
              isDark ? 'bg-[#141618] text-[#a5a49c]' : 'bg-[#dedbd0] text-[#55534c]'
            }`}
          >
            {headingsCount}
          </span>
        </button>

        {/* Dedicated Typography / Font Selector */}
        <FontSelector
          selectedPersianFont={selectedPersianFont}
          selectedEnglishFont={selectedEnglishFont}
          onSelectPersianFont={onSelectPersianFont}
          onSelectEnglishFont={onSelectEnglishFont}
          theme={theme}
        />
      </div>

      {/* Group 2: View Mode (Preview, Split, Raw) */}
      <div
        className={`flex items-center p-0.5 rounded border ${
          isDark ? 'bg-[#131517] border-[#272b32]' : 'bg-[#e4e2d8] border-[#d0ccc0]'
        }`}
      >
        <button
          onClick={() => onViewModeChange('preview')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs transition-all ${
            viewMode === 'preview'
              ? isDark
                ? 'bg-[#242930] text-white font-medium shadow-sm'
                : 'bg-white text-[#1a1a1a] font-medium shadow-sm'
              : 'opacity-70 hover:opacity-100'
          }`}
          title="فقط پیش‌نمایش فرمت شده"
          aria-label="حالت فقط پیش‌نمایش"
        >
          <Eye className="w-3.5 h-3.5" />
          <span className="hidden md:inline">پیش‌نمایش</span>
        </button>
        <button
          onClick={() => onViewModeChange('split')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs transition-all ${
            viewMode === 'split'
              ? isDark
                ? 'bg-[#242930] text-white font-medium shadow-sm'
                : 'bg-white text-[#1a1a1a] font-medium shadow-sm'
              : 'opacity-70 hover:opacity-100'
          }`}
          title="نمای همزمان ادیتور و پیش‌نمایش"
          aria-label="حالت نمای دوتایی ادیتور و پیش‌نمایش"
        >
          <Columns className="w-3.5 h-3.5" />
          <span className="hidden md:inline">نمای دوتایی</span>
        </button>
        <button
          onClick={() => onViewModeChange('raw')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs transition-all ${
            viewMode === 'raw'
              ? isDark
                ? 'bg-[#242930] text-white font-medium shadow-sm'
                : 'bg-white text-[#1a1a1a] font-medium shadow-sm'
              : 'opacity-70 hover:opacity-100'
          }`}
          title="مشاهده و ویرایش کد خام مارک‌داون"
          aria-label="حالت ویرایشگر خام"
        >
          <Code2 className="w-3.5 h-3.5" />
          <span className="hidden md:inline">کد خام</span>
        </button>
      </div>

      {/* Group 3: Primary Exports (PDF & Text) */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {/* Quick PDF Button */}
        <button
          onClick={onQuickPrintPdf}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded border transition-colors ${
            isDark
              ? 'bg-[#21262d] hover:bg-[#2b313a] text-[#edece6] border-[#363d47]'
              : 'bg-[#e5e1d4] hover:bg-[#dbd6c6] text-[#202226] border-[#cec9b8]'
          }`}
          title="چاپ یا ذخیره مستقیم به عنوان PDF ویندوز (Ctrl+P)"
          aria-label="چاپ یا ذخیره PDF"
        >
          <Printer className={`w-3.5 h-3.5 ${isDark ? 'text-[#c67d58]' : 'text-[#8f4b2d]'}`} />
          <span className="font-semibold">PDF</span>
        </button>

        {/* Quick TXT Button */}
        <button
          onClick={onQuickSaveText}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded border transition-colors ${
            isDark
              ? 'bg-[#21262d] hover:bg-[#2b313a] text-[#edece6] border-[#363d47]'
              : 'bg-[#e5e1d4] hover:bg-[#dbd6c6] text-[#202226] border-[#cec9b8]'
          }`}
          title="ذخیره مستقیم به صورت متن ساده (.txt)"
          aria-label="ذخیره به عنوان متن"
        >
          <FileText className="w-3.5 h-3.5 opacity-80" />
          <span className="font-semibold">متن (TXT)</span>
        </button>

        {/* Full Export Modal Trigger */}
        <button
          onClick={onOpenExportModal}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded border transition-colors font-medium ${
            isDark
              ? 'bg-[#1b1e22] hover:bg-[#242930] text-[#c7c5bc] border-[#2e343e]'
              : 'bg-[#edeae0] hover:bg-[#e4e0d4] text-[#34373d] border-[#d8d3c5]'
          }`}
          title="پنجره کامل ذخیره و خروجی"
          aria-label="خروجی و ذخیره"
        >
          <FileDown className="w-3.5 h-3.5 opacity-80" />
          <span>خروجی...</span>
        </button>
      </div>

      {/* Group 4: Classic Controls (Zoom, Direction, Dark/Light Theme) */}
      <div className="flex items-center gap-2">
        {/* Zoom */}
        <div
          className={`flex items-center rounded border p-0.5 ${
            isDark ? 'bg-[#131517] border-[#272b32]' : 'bg-[#e4e2d8] border-[#d0ccc0]'
          }`}
        >
          <button
            onClick={() => onZoomChange(-10)}
            className="p-1 opacity-70 hover:opacity-100 transition-opacity"
            title="کوچک‌نمایی فونت"
            aria-label="کوچک‌نمایی فونت"
          >
            <ZoomOut className="w-3 h-3" />
          </button>
          <button
            onClick={onResetZoom}
            className="px-1.5 text-[10px] font-mono opacity-80 hover:opacity-100"
            title="بازنشانی اندازه فونت به ۱۰۰٪"
          >
            {zoomLevel}%
          </button>
          <button
            onClick={() => onZoomChange(10)}
            className="p-1 opacity-70 hover:opacity-100 transition-opacity"
            title="بزرگ‌نمایی فونت"
            aria-label="بزرگ‌نمایی فونت"
          >
            <ZoomIn className="w-3 h-3" />
          </button>
        </div>

        {/* Direction Switcher */}
        <div
          className={`hidden sm:flex items-center rounded border p-0.5 ${
            isDark ? 'bg-[#131517] border-[#272b32]' : 'bg-[#e4e2d8] border-[#d0ccc0]'
          }`}
        >
          <button
            onClick={() => onDirectionChange('rtl')}
            className={`p-1 rounded ${
              direction === 'rtl'
                ? isDark
                  ? 'bg-[#252930] text-white'
                  : 'bg-white text-[#1a1a1a]'
                : 'opacity-60 hover:opacity-100'
            }`}
            title="راست‌چین (فارسی)"
            aria-label="راست‌چین"
          >
            <AlignRight className="w-3 h-3" />
          </button>
          <button
            onClick={() => onDirectionChange('auto')}
            className={`px-1.5 py-0.5 rounded text-[10px] ${
              direction === 'auto'
                ? isDark
                  ? 'bg-[#252930] text-white font-medium'
                  : 'bg-white text-[#1a1a1a] font-medium'
                : 'opacity-60 hover:opacity-100'
            }`}
            title="تشخیص خودکار جهت"
          >
            خودکار
          </button>
          <button
            onClick={() => onDirectionChange('ltr')}
            className={`p-1 rounded ${
              direction === 'ltr'
                ? isDark
                  ? 'bg-[#252930] text-white'
                  : 'bg-white text-[#1a1a1a]'
                : 'opacity-60 hover:opacity-100'
            }`}
            title="چپ‌چین (انگلیسی)"
            aria-label="چپ‌چین"
          >
            <AlignLeft className="w-3 h-3" />
          </button>
        </div>

        {/* Clean Minimal Dark / Light Toggle */}
        <button
          onClick={() => onThemeChange(isDark ? 'light' : 'dark')}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded border transition-colors ${
            isDark
              ? 'bg-[#1e2227] hover:bg-[#262c33] text-[#edece6] border-[#313740]'
              : 'bg-[#e7e4d8] hover:bg-[#ddd9cb] text-[#1e2022] border-[#d1ccbe]'
          }`}
          title={isDark ? "تغییر به تم روشن" : "تغییر به تم تاریک"}
          aria-label={isDark ? "تغییر به تم روشن" : "تغییر به تم تاریک"}
        >
          {isDark ? (
            <>
              <Sun className="w-3.5 h-3.5 text-[#e5a872]" />
              <span className="text-[11px] font-medium hidden md:inline">روشن</span>
            </>
          ) : (
            <>
              <Moon className="w-3.5 h-3.5 text-[#3b4b68]" />
              <span className="text-[11px] font-medium hidden md:inline">تاریک</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
