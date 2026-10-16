import React, { useState } from 'react';
import {
  X,
  FileDown,
  Printer,
  FileText,
  Code2,
  Globe,
  Copy,
  Check,
  Download,
  AlertCircle,
  Loader2,
  BookOpen,
} from 'lucide-react';
import {
  exportAsText,
  exportAsMarkdown,
  exportAsHtml,
  exportAsPdf,
  printDocument,
  copyContent,
} from '../utils/exportUtils';
import { markdownToPlainText } from '../utils/markdownParser';
import { FontOption } from '../data/fonts';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  markdown: string;
  renderedHtml: string;
  fileName: string;
  previewElement: HTMLElement | null;
  theme: 'dark' | 'light';
  isRtl: boolean;
  selectedPersianFont: FontOption;
  selectedEnglishFont: FontOption;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  markdown,
  renderedHtml,
  fileName,
  previewElement,
  theme,
  isRtl,
  selectedPersianFont,
  selectedEnglishFont,
}) => {
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [pdfProgress, setPdfProgress] = useState('');
  const [copyStatus, setCopyStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const isDark = theme === 'dark';
  const baseName = fileName.replace(/\.[^/.]+$/, '') || 'document';

  const handleSaveText = () => {
    const plainText = markdownToPlainText(markdown);
    exportAsText(plainText, `${baseName}.txt`);
    onClose();
  };

  const handleSaveMarkdown = () => {
    exportAsMarkdown(markdown, `${baseName}.md`);
    onClose();
  };

  const handleSaveHtml = () => {
    exportAsHtml(
      renderedHtml,
      baseName,
      theme,
      isRtl,
      selectedPersianFont.family,
      selectedEnglishFont.family
    );
    onClose();
  };

  const handleDirectPdf = async () => {
    if (!previewElement) {
      alert('المان سند در دسترس نیست');
      return;
    }

    try {
      setIsExportingPdf(true);
      await exportAsPdf(previewElement, `${baseName}.pdf`, (status) => {
        setPdfProgress(status);
      });
      setIsExportingPdf(false);
      onClose();
    } catch (err) {
      console.error(err);
      setIsExportingPdf(false);
      setPdfProgress('خطا در تولید PDF. لطفاً از گزینه پرینت استفاده کنید.');
    }
  };

  const handlePrintToPdf = () => {
    printDocument();
    onClose();
  };

  const handleCopyText = async () => {
    const plainText = markdownToPlainText(markdown);
    const success = await copyContent(plainText);
    if (success) {
      setCopyStatus('متن ساده با موفقیت در کلیپ‌بورد کپی شد!');
      setTimeout(() => setCopyStatus(null), 3000);
    }
  };

  const handleCopyRichHtml = async () => {
    const plainText = markdownToPlainText(markdown);
    const success = await copyContent(plainText, renderedHtml);
    if (success) {
      setCopyStatus('متن فرمت‌شده (Rich Text) کپی شد. آماده الصاق در Word یا پیام‌رسان‌ها.');
      setTimeout(() => setCopyStatus(null), 3000);
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-100 ${
        isDark ? 'bg-black/75' : 'bg-black/35'
      }`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="export-modal-title"
    >
      <div
        className={`rounded-lg shadow-2xl max-w-lg w-full overflow-hidden border flex flex-col ${
          isDark
            ? 'bg-[#181a1d] border-[#2e333b] text-[#edece6]'
            : 'bg-[#faf9f5] border-[#dbd8ce] text-[#1e2022]'
        }`}
      >
        {/* Modal Header */}
        <div
          className={`px-5 py-4 border-b flex items-center justify-between ${
            isDark ? 'bg-[#15171a] border-[#272b32]' : 'bg-[#f2efe6] border-[#e2ded4]'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div
              className={`w-7 h-7 rounded flex items-center justify-center border ${
                isDark
                  ? 'bg-[#22262d] border-[#313740] text-[#c67d58]'
                  : 'bg-[#eeece4] border-[#d4cfc1] text-[#8f4b2d]'
              }`}
            >
              <FileDown className="w-4 h-4" />
            </div>
            <div>
              <h2 id="export-modal-title" className="font-bold text-sm">
                ذخیره و خروجی سند
              </h2>
              <p className="text-[11px] opacity-70">
                قلم‌های اعمال شده: {selectedPersianFont.name.split(' ')[0]} / {selectedEnglishFont.name}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`p-1.5 rounded opacity-70 hover:opacity-100 transition-colors ${
              isDark ? 'hover:bg-[#252a30]' : 'hover:bg-[#e4e0d4]'
            }`}
            aria-label="بستن"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
          {copyStatus && (
            <div
              className={`p-2.5 border rounded flex items-center gap-2 ${
                isDark
                  ? 'bg-[#1f2923] border-[#2e523b] text-[#8ce2a6]'
                  : 'bg-[#eaf4ed] border-[#b4dcc0] text-[#226338]'
              }`}
            >
              <Check className="w-3.5 h-3.5 shrink-0" />
              <span>{copyStatus}</span>
            </div>
          )}

          {/* Section: PDF Exports */}
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-wider opacity-60 mb-2">
              خروجی PDF (سند نهایی)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Option 1: Native Print to PDF */}
              <button
                onClick={handlePrintToPdf}
                className={`flex flex-col text-right p-3 rounded border transition-all text-current ${
                  isDark
                    ? 'bg-[#1e2228] hover:bg-[#252a31] border-[#343b46]'
                    : 'bg-[#f2efe6] hover:bg-[#eae6db] border-[#d5d0c2]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs">
                    چاپ / Print to PDF ویندوز
                  </span>
                  <Printer className={`w-3.5 h-3.5 ${isDark ? 'text-[#c67d58]' : 'text-[#8f4b2d]'}`} />
                </div>
                <p className="text-[10px] opacity-70 leading-relaxed">
                  پیشنهادی: استفاده از موتور وکتور ویندوز با انتخاب Microsoft Print to PDF
                </p>
              </button>

              {/* Option 2: Direct PDF File */}
              <button
                onClick={handleDirectPdf}
                disabled={isExportingPdf}
                className={`flex flex-col text-right p-3 rounded border transition-all disabled:opacity-50 text-current ${
                  isDark
                    ? 'bg-[#1e2228] hover:bg-[#252a31] border-[#343b46]'
                    : 'bg-[#f2efe6] hover:bg-[#eae6db] border-[#d5d0c2]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs">
                    دانلود مستقیم فایل PDF
                  </span>
                  {isExportingPdf ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Download className="w-3.5 h-3.5 opacity-60" />
                  )}
                </div>
                <p className="text-[10px] opacity-70 leading-relaxed">
                  {isExportingPdf ? pdfProgress || 'در حال آماده‌سازی...' : 'تولید فایل مستقیم بدون نمایش پنجره پرینت'}
                </p>
              </button>
            </div>
          </div>

          {/* Section: Text Exports */}
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-wider opacity-60 mb-2">
              خروجی فایل متنی (Text)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {/* Plain Text (.txt) */}
              <button
                onClick={handleSaveText}
                className={`flex flex-col text-right p-3 rounded border transition-all text-current ${
                  isDark
                    ? 'bg-[#1e2228] hover:bg-[#252a31] border-[#343b46]'
                    : 'bg-[#f2efe6] hover:bg-[#eae6db] border-[#d5d0c2]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs">
                    فایل متنی خالص (.txt)
                  </span>
                  <FileText className="w-3.5 h-3.5 opacity-70" />
                </div>
                <p className="text-[10px] opacity-70 leading-relaxed">
                  متن تمیز و مرتب شده بدون هیچ نشانه مارک‌داون
                </p>
              </button>

              {/* Markdown (.md) */}
              <button
                onClick={handleSaveMarkdown}
                className={`flex flex-col text-right p-3 rounded border transition-all text-current ${
                  isDark
                    ? 'bg-[#1e2228] hover:bg-[#252a31] border-[#343b46]'
                    : 'bg-[#f2efe6] hover:bg-[#eae6db] border-[#d5d0c2]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-xs">
                    فایل منبع مارک‌داون (.md)
                  </span>
                  <Code2 className="w-3.5 h-3.5 opacity-70" />
                </div>
                <p className="text-[10px] opacity-70 leading-relaxed">
                  ذخیره فایل اورجینال برای گیت‌هاب و ویرایشگرها
                </p>
              </button>
            </div>
          </div>

          {/* Section: Web & Clipboard */}
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-wider opacity-60 mb-2">
              وب و کلیپ‌بورد
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                onClick={handleSaveHtml}
                className={`p-2.5 rounded border flex items-center justify-between text-[11px] transition-colors ${
                  isDark
                    ? 'bg-[#1a1c20] hover:bg-[#22262d] border-[#2c323b]'
                    : 'bg-[#f4f1e8] hover:bg-[#ece8dc] border-[#dedacf]'
                }`}
              >
                <span>خروجی وب (.html)</span>
                <Globe className="w-3.5 h-3.5 opacity-60" />
              </button>

              <button
                onClick={handleCopyText}
                className={`p-2.5 rounded border flex items-center justify-between text-[11px] transition-colors ${
                  isDark
                    ? 'bg-[#1a1c20] hover:bg-[#22262d] border-[#2c323b]'
                    : 'bg-[#f4f1e8] hover:bg-[#ece8dc] border-[#dedacf]'
                }`}
              >
                <span>کپی متن ساده</span>
                <Copy className="w-3.5 h-3.5 opacity-60" />
              </button>

              <button
                onClick={handleCopyRichHtml}
                className={`p-2.5 rounded border flex items-center justify-between text-[11px] transition-colors ${
                  isDark
                    ? 'bg-[#1a1c20] hover:bg-[#22262d] border-[#2c323b]'
                    : 'bg-[#f4f1e8] hover:bg-[#ece8dc] border-[#dedacf]'
                }`}
              >
                <span>کپی Rich Text</span>
                <BookOpen className="w-3.5 h-3.5 opacity-60" />
              </button>
            </div>
          </div>

          <div
            className={`p-3 rounded border text-[11px] flex items-start gap-2 ${
              isDark
                ? 'bg-[#15171a] border-[#262930] text-[#a5a49c]'
                : 'bg-[#eeece4] border-[#d8d5cb] text-[#55534d]'
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5 opacity-70 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              راهنما: در پنجره پرینت ویندوز، می‌توانید بخش Destination را روی <strong>Microsoft Print to PDF</strong> قرار داده تا خروجی برداری شفاف تولید شود.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div
          className={`px-5 py-3 border-t flex justify-end ${
            isDark ? 'bg-[#15171a] border-[#272b32]' : 'bg-[#f2efe6] border-[#e2ded4]'
          }`}
        >
          <button
            onClick={onClose}
            className={`px-4 py-1.5 rounded text-xs font-medium border transition-colors ${
              isDark
                ? 'bg-[#22262d] hover:bg-[#2a3038] text-[#edece6] border-[#313740]'
                : 'bg-[#e4e1d6] hover:bg-[#dad5c7] text-[#1e2022] border-[#cdc8b9]'
            }`}
          >
            بستن
          </button>
        </div>
      </div>
    </div>
  );
};
