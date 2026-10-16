import React from 'react';
import { FileUp, Feather } from 'lucide-react';

interface DropZoneOverlayProps {
  isDragging: boolean;
  theme: 'dark' | 'light';
}

export const DropZoneOverlay: React.FC<DropZoneOverlayProps> = ({ isDragging, theme }) => {
  if (!isDragging) return null;

  const isDark = theme === 'dark';

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-8 pointer-events-none animate-in fade-in duration-100 ${
        isDark ? 'bg-black/75' : 'bg-black/40'
      }`}
      data-testid="drop-zone-overlay"
    >
      <div
        className={`w-full max-w-xl h-80 border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-center p-8 shadow-2xl ${
          isDark
            ? 'bg-[#181a1e] border-[#c67d58]/60 text-[#edece6]'
            : 'bg-[#faf9f5] border-[#8f4b2d]/60 text-[#1e2022]'
        }`}
      >
        <div
          className={`w-16 h-16 rounded-full flex items-center justify-center mb-5 border ${
            isDark
              ? 'bg-[#23272e] border-[#363c46] text-[#c67d58]'
              : 'bg-[#eeece4] border-[#d4cfc1] text-[#8f4b2d]'
          }`}
        >
          <FileUp className="w-8 h-8" />
        </div>

        <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
          <span>فایل مارک‌داون را اینجا رها کنید</span>
          <Feather className="w-4 h-4 opacity-60" />
        </h2>

        <p className="text-xs opacity-75 max-w-md leading-relaxed mb-4">
          پشتیبانی از فرمت‌های متنی <code>.md</code>, <code>.markdown</code>, <code>.txt</code>
        </p>

        <div
          className={`text-[11px] px-3.5 py-1.5 rounded border ${
            isDark
              ? 'bg-[#15171a] border-[#292e37] text-[#9b9991]'
              : 'bg-[#eae7dd] border-[#d2cebf] text-[#555249]'
          }`}
        >
          فایل با رعایت قلم‌های انتخابی و فرمت استاندارد نمایش داده می‌شود
        </div>
      </div>
    </div>
  );
};
