import React, { useState, useRef, useEffect } from 'react';
import {
  Type,
  Check,
  ChevronDown,
  Globe,
  Search,
  Loader2,
  AlertCircle,
  WifiOff,
  Sparkles,
  Plus,
  Trash2,
} from 'lucide-react';
import { PERSIAN_FONTS, ENGLISH_FONTS, FontOption } from '../data/fonts';
import {
  fetchAndLoadGoogleFont,
  getStoredCustomFonts,
  injectFontStylesheet,
  buildGoogleFontUrl,
} from '../utils/googleFonts';

interface FontSelectorProps {
  selectedPersianFont: FontOption;
  selectedEnglishFont: FontOption;
  onSelectPersianFont: (font: FontOption) => void;
  onSelectEnglishFont: (font: FontOption) => void;
  theme: 'dark' | 'light';
}

export const FontSelector: React.FC<FontSelectorProps> = ({
  selectedPersianFont,
  selectedEnglishFont,
  onSelectPersianFont,
  onSelectEnglishFont,
  theme,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'persian' | 'english' | 'google'>('persian');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Custom fonts loaded from localStorage
  const [customPersianFonts, setCustomPersianFonts] = useState<FontOption[]>([]);
  const [customEnglishFonts, setCustomEnglishFonts] = useState<FontOption[]>([]);

  // Google Font search state
  const [inputFontName, setInputFontName] = useState('');
  const [fontLanguage, setFontLanguage] = useState<'fa' | 'en'>('en');
  const [isLoadingGoogle, setIsLoadingGoogle] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Load custom fonts from localStorage on mount and inject stylesheets
  useEffect(() => {
    const stored = getStoredCustomFonts();
    setCustomPersianFonts(stored.persian);
    setCustomEnglishFonts(stored.english);

    // Re-inject their stylesheets into DOM
    [...stored.persian, ...stored.english].forEach((f) => {
      const cleanName = f.family.replace(/['",]/g, '').split(' ')[0];
      const url = buildGoogleFontUrl(cleanName);
      injectFontStylesheet(url, `gfont-${f.id}`);
    });
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isDark = theme === 'dark';

  const handleFetchGoogleFont = async (nameToFetch?: string) => {
    const targetName = nameToFetch || inputFontName;
    if (!targetName.trim()) {
      setErrorMessage('لطفاً نام فونت را به انگلیسی بنویسید (مثال: Montserrat یا Amiri).');
      return;
    }

    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoadingGoogle(true);

    const result = await fetchAndLoadGoogleFont(targetName, fontLanguage);
    setIsLoadingGoogle(false);

    if (!result.success) {
      setErrorMessage(result.error || 'خطایی در دریافت فونت رخ داد.');
    } else if (result.font) {
      setSuccessMessage(`فونت «${result.font.name}» با موفقیت دریافت و فعال شد!`);
      setInputFontName('');

      // Update state and active selection
      if (fontLanguage === 'fa') {
        setCustomPersianFonts((prev) => [result.font!, ...prev.filter((f) => f.id !== result.font!.id)]);
        onSelectPersianFont(result.font);
      } else {
        setCustomEnglishFonts((prev) => [result.font!, ...prev.filter((f) => f.id !== result.font!.id)]);
        onSelectEnglishFont(result.font);
      }
    }
  };

  const handleQuickAdd = (fontName: string, lang: 'fa' | 'en') => {
    setFontLanguage(lang);
    setInputFontName(fontName);
    handleFetchGoogleFont(fontName);
  };

  const allPersianFonts = [...customPersianFonts, ...PERSIAN_FONTS];
  const allEnglishFonts = [...customEnglishFonts, ...ENGLISH_FONTS];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs transition-colors border ${
          isDark
            ? 'bg-[#1e2227] hover:bg-[#252a30] text-[#cfcec6] border-[#313740]'
            : 'bg-[#ebe9e1] hover:bg-[#e4e1d7] text-[#2c2f35] border-[#d7d3c7]'
        }`}
        title="تنظیمات قلم و تایپوگرافی یا افزودن از گوگل فونتز"
        aria-label="انتخاب فونت فارسی و انگلیسی"
      >
        <Type className={`w-3.5 h-3.5 ${isDark ? 'text-[#c67d58]' : 'text-[#8f4b2d]'}`} />
        <span className="font-medium hidden sm:inline">فونت:</span>
        <span className="font-semibold truncate max-w-[130px]">
          {selectedPersianFont.name.split(' ')[0]} / {selectedEnglishFont.name.split(' ')[0]}
        </span>
        <ChevronDown className="w-3 h-3 opacity-60" />
      </button>

      {isOpen && (
        <div
          className={`absolute top-full mt-1.5 left-0 sm:left-auto sm:right-0 w-[350px] sm:w-[420px] rounded-lg shadow-2xl border z-50 overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-100 ${
            isDark
              ? 'bg-[#181a1e] border-[#2e333b] text-[#edece6]'
              : 'bg-[#faf9f5] border-[#dbd8ce] text-[#1e2022]'
          }`}
          dir="rtl"
        >
          {/* Header */}
          <div
            className={`p-3 border-b flex items-center justify-between text-xs font-semibold ${
              isDark ? 'border-[#282d35] bg-[#141619]' : 'border-[#e4e1d7] bg-[#f0eee6]'
            }`}
          >
            <div className="flex items-center gap-1.5">
              <Type className={`w-4 h-4 ${isDark ? 'text-[#c67d58]' : 'text-[#8f4b2d]'}`} />
              <span>مدیریت و انتخاب فونت‌های سند</span>
            </div>
            <button
              onClick={() => setActiveTab('google')}
              className={`flex items-center gap-1 text-[11px] px-2 py-0.5 rounded transition-colors ${
                activeTab === 'google'
                  ? isDark
                    ? 'bg-[#c67d58] text-black font-bold'
                    : 'bg-[#8f4b2d] text-white font-bold'
                  : 'opacity-70 hover:opacity-100'
              }`}
            >
              <Plus className="w-3 h-3" />
              <span>افزودن از گوگل</span>
            </button>
          </div>

          {/* Navigation Tabs */}
          <div
            className={`grid grid-cols-3 p-1.5 gap-1 border-b text-xs font-medium ${
              isDark ? 'bg-[#16181b] border-[#282d35]' : 'bg-[#e9e7de] border-[#dbd8ce]'
            }`}
          >
            <button
              onClick={() => setActiveTab('persian')}
              className={`py-1.5 px-2 rounded text-center transition-colors flex items-center justify-center gap-1 ${
                activeTab === 'persian'
                  ? isDark
                    ? 'bg-[#252a32] text-white font-semibold shadow-sm'
                    : 'bg-white text-[#1a1a1a] font-semibold shadow-sm'
                  : 'opacity-70 hover:opacity-100'
              }`}
            >
              <span>فارسی</span>
              <span className="text-[10px] px-1 py-0.2 rounded-full bg-black/10">
                {allPersianFonts.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('english')}
              className={`py-1.5 px-2 rounded text-center transition-colors flex items-center justify-center gap-1 ${
                activeTab === 'english'
                  ? isDark
                    ? 'bg-[#252a32] text-white font-semibold shadow-sm'
                    : 'bg-white text-[#1a1a1a] font-semibold shadow-sm'
                  : 'opacity-70 hover:opacity-100'
              }`}
            >
              <span>English</span>
              <span className="text-[10px] px-1 py-0.2 rounded-full bg-black/10">
                {allEnglishFonts.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('google')}
              className={`py-1.5 px-2 rounded text-center transition-colors flex items-center justify-center gap-1 ${
                activeTab === 'google'
                  ? isDark
                    ? 'bg-[#252a32] text-white font-semibold shadow-sm'
                    : 'bg-white text-[#1a1a1a] font-semibold shadow-sm'
                  : 'opacity-70 hover:opacity-100 text-[#c67d58]'
              }`}
            >
              <Globe className="w-3 h-3" />
              <span>گوگل فونتز</span>
            </button>
          </div>

          {/* Tab Content */}
          <div className="max-h-[350px] overflow-y-auto p-2 space-y-1">
            {/* TAB 1: PERSIAN FONTS */}
            {activeTab === 'persian' &&
              allPersianFonts.map((font) => {
                const isSelected = selectedPersianFont.id === font.id;
                return (
                  <button
                    key={font.id}
                    onClick={() => onSelectPersianFont(font)}
                    className={`w-full text-right p-2.5 rounded-md transition-all flex flex-col gap-1 border ${
                      isSelected
                        ? isDark
                          ? 'bg-[#232932] border-[#c67d58]/60 text-white'
                          : 'bg-[#f0ebe0] border-[#8f4b2d]/60 text-[#1a1a1a]'
                        : isDark
                        ? 'hover:bg-[#20242a] border-transparent text-[#d1d0c9]'
                        : 'hover:bg-[#f2efe6] border-transparent text-[#383b40]'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold">{font.name}</span>
                        {font.category && (
                          <span
                            className={`text-[9px] px-1.5 py-0.5 rounded capitalize ${
                              isDark ? 'bg-[#16181b] text-[#9b9991]' : 'bg-[#e2dfd5] text-[#55524b]'
                            }`}
                          >
                            {font.category}
                          </span>
                        )}
                      </div>
                      {isSelected && (
                        <Check
                          className={`w-4 h-4 ${isDark ? 'text-[#c67d58]' : 'text-[#8f4b2d]'}`}
                        />
                      )}
                    </div>
                    {font.previewText && (
                      <div
                        className="text-sm mt-0.5 opacity-90 truncate leading-relaxed"
                        style={{ fontFamily: font.family }}
                      >
                        {font.previewText}
                      </div>
                    )}
                    {font.description && (
                      <p className="text-[10px] opacity-60 truncate">{font.description}</p>
                    )}
                  </button>
                );
              })}

            {/* TAB 2: ENGLISH FONTS */}
            {activeTab === 'english' &&
              allEnglishFonts.map((font) => {
                const isSelected = selectedEnglishFont.id === font.id;
                return (
                  <button
                    key={font.id}
                    onClick={() => onSelectEnglishFont(font)}
                    className={`w-full text-left p-2.5 rounded-md transition-all flex flex-col gap-1 border ${
                      isSelected
                        ? isDark
                          ? 'bg-[#232932] border-[#c67d58]/60 text-white'
                          : 'bg-[#f0ebe0] border-[#8f4b2d]/60 text-[#1a1a1a]'
                        : isDark
                        ? 'hover:bg-[#20242a] border-transparent text-[#d1d0c9]'
                        : 'hover:bg-[#f2efe6] border-transparent text-[#383b40]'
                    }`}
                    dir="ltr"
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold">{font.name}</span>
                        {font.category && (
                          <span
                            className={`text-[9px] px-1.5 py-0.5 rounded capitalize ${
                              isDark ? 'bg-[#16181b] text-[#9b9991]' : 'bg-[#e2dfd5] text-[#55524b]'
                            }`}
                          >
                            {font.category}
                          </span>
                        )}
                      </div>
                      {isSelected && (
                        <Check
                          className={`w-4 h-4 ${isDark ? 'text-[#c67d58]' : 'text-[#8f4b2d]'}`}
                        />
                      )}
                    </div>
                    {font.previewText && (
                      <div
                        className="text-sm mt-0.5 opacity-90 truncate"
                        style={{ fontFamily: font.family }}
                      >
                        {font.previewText}
                      </div>
                    )}
                    {font.description && (
                      <p className="text-[10px] opacity-60 truncate">{font.description}</p>
                    )}
                  </button>
                );
              })}

            {/* TAB 3: GOOGLE FONTS API ADDER */}
            {activeTab === 'google' && (
              <div className="p-2 space-y-4 text-xs">
                {/* Information Card */}
                <div
                  className={`p-3 rounded-lg border leading-relaxed ${
                    isDark
                      ? 'bg-[#15171a] border-[#292e37] text-[#c5c3ba]'
                      : 'bg-[#f2eee3] border-[#ded7c8] text-[#44423c]'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-bold mb-1">
                    <Globe className={`w-3.5 h-3.5 ${isDark ? 'text-[#c67d58]' : 'text-[#8f4b2d]'}`} />
                    <span>دریافت هوشمند از مخزن Google Fonts</span>
                  </div>
                  <p className="text-[11px] opacity-80">
                    نام هر فونت دلخواهی از گوگل (انگلیسی یا فارسی) را بنویسید تا برنامه بلافاصله آن را با استعلام از سرورهای گوگل دانلود و فعال کند.
                  </p>
                </div>

                {/* Input Form */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-medium opacity-80">نوع زبان فونت:</span>
                    <div className="flex items-center gap-2 text-xs">
                      <label className="flex items-center gap-1 cursor-pointer">
                        <input
                          type="radio"
                          name="fontLang"
                          checked={fontLanguage === 'en'}
                          onChange={() => setFontLanguage('en')}
                          className="accent-[#c67d58]"
                        />
                        <span>انگلیسی / لاتین</span>
                      </label>
                      <label className="flex items-center gap-1 cursor-pointer">
                        <input
                          type="radio"
                          name="fontLang"
                          checked={fontLanguage === 'fa'}
                          onChange={() => setFontLanguage('fa')}
                          className="accent-[#c67d58]"
                        />
                        <span>فارسی / عربی</span>
                      </label>
                    </div>
                  </div>

                  <div className="flex gap-1.5">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={inputFontName}
                        onChange={(e) => setInputFontName(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleFetchGoogleFont()}
                        placeholder={
                          fontLanguage === 'fa'
                            ? 'مثال: Amiri یا Cairo یا Lateef'
                            : 'مثال: Montserrat یا Roboto یا Poppins'
                        }
                        className={`w-full px-3 py-2 rounded text-xs border transition-colors outline-none ${
                          isDark
                            ? 'bg-[#141618] border-[#2e333d] text-white focus:border-[#c67d58]'
                            : 'bg-white border-[#d2cebf] text-black focus:border-[#8f4b2d]'
                        }`}
                        style={{ fontFamily: "'Vazirmatn', system-ui, sans-serif" }}
                        dir="ltr"
                        disabled={isLoadingGoogle}
                      />
                    </div>

                    <button
                      onClick={() => handleFetchGoogleFont()}
                      disabled={isLoadingGoogle || !inputFontName.trim()}
                      className={`px-3 py-2 rounded font-medium text-xs flex items-center gap-1.5 transition-all disabled:opacity-50 ${
                        isDark
                          ? 'bg-[#c67d58] hover:bg-[#b56e4a] text-black font-bold'
                          : 'bg-[#8f4b2d] hover:bg-[#7b3e23] text-white font-bold'
                      }`}
                    >
                      {isLoadingGoogle ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>در حال دریافت...</span>
                        </>
                      ) : (
                        <>
                          <Search className="w-3.5 h-3.5" />
                          <span>دریافت فونت</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Friendly Simple Error Message */}
                {errorMessage && (
                  <div
                    className={`p-3 rounded-lg border text-[11px] leading-relaxed flex items-start gap-2 animate-in fade-in ${
                      isDark
                        ? 'bg-[#2a1717] border-[#5e2727] text-[#fca5a5]'
                        : 'bg-[#fee2e2] border-[#fca5a5] text-[#991b1b]'
                    }`}
                  >
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block mb-0.5">خطا در دریافت فونت:</span>
                      <span>{errorMessage}</span>
                    </div>
                  </div>
                )}

                {/* Success Message */}
                {successMessage && (
                  <div
                    className={`p-3 rounded-lg border text-[11px] leading-relaxed flex items-center gap-2 animate-in fade-in ${
                      isDark
                        ? 'bg-[#15271a] border-[#22502c] text-[#86efac]'
                        : 'bg-[#dcfce7] border-[#86efac] text-[#166534]'
                    }`}
                  >
                    <Check className="w-4 h-4 shrink-0" />
                    <span>{successMessage}</span>
                  </div>
                )}

                {/* Quick Popular Suggestions */}
                <div className="space-y-2 pt-2 border-t border-dashed border-current/20">
                  <div className="text-[11px] font-semibold opacity-70 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    <span>فونت‌های پرطرفدار گوگل برای دریافت فوری با یک کلیک:</span>
                  </div>

                  <div>
                    <span className="text-[10px] opacity-60 block mb-1">فونت‌های فارسی و عربی گوگل:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {['Amiri', 'Cairo', 'Lateef', 'Scheherazade New', 'Almarai', 'Tajawal'].map((name) => (
                        <button
                          key={name}
                          onClick={() => handleQuickAdd(name, 'fa')}
                          disabled={isLoadingGoogle}
                          className={`px-2 py-1 rounded text-[11px] border transition-colors ${
                            isDark
                              ? 'bg-[#1e2227] hover:bg-[#282e36] border-[#313740]'
                              : 'bg-[#ebe8de] hover:bg-[#dfdbcf] border-[#d2cdbe]'
                          }`}
                        >
                          + {name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] opacity-60 block mb-1">فونت‌های انگلیسی و لاتین گوگل:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {['Montserrat', 'Roboto', 'Poppins', 'Open Sans', 'Lato', 'Oswald', 'Raleway'].map((name) => (
                        <button
                          key={name}
                          onClick={() => handleQuickAdd(name, 'en')}
                          disabled={isLoadingGoogle}
                          className={`px-2 py-1 rounded text-[11px] border transition-colors ${
                            isDark
                              ? 'bg-[#1e2227] hover:bg-[#282e36] border-[#313740]'
                              : 'bg-[#ebe8de] hover:bg-[#dfdbcf] border-[#d2cdbe]'
                          }`}
                        >
                          + {name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer note */}
          <div
            className={`p-2 border-t text-[10px] text-center opacity-70 ${
              isDark ? 'border-[#282d35] bg-[#141619]' : 'border-[#e4e1d7] bg-[#f0eee6]'
            }`}
          >
            فونت‌های جدید به طور خودکار در حافظه دستگاه ذخیره و در خروجی PDF و HTML اعمال می‌شوند.
          </div>
        </div>
      )}
    </div>
  );
};
