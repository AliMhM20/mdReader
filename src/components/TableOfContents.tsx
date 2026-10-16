import React from 'react';
import { HeadingItem } from '../utils/markdownParser';
import { ListTree, X, Hash } from 'lucide-react';

interface TableOfContentsProps {
  headings: HeadingItem[];
  isOpen: boolean;
  onClose: () => void;
  onSelectHeading: (id: string) => void;
  activeId?: string;
  theme: 'dark' | 'light';
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({
  headings,
  isOpen,
  onClose,
  onSelectHeading,
  activeId,
  theme,
}) => {
  if (!isOpen) return null;

  const isDark = theme === 'dark';

  return (
    <aside
      className={`no-print w-72 shrink-0 border-inline-end flex flex-col z-20 h-full overflow-hidden transition-colors ${
        isDark
          ? 'bg-[#17191d] border-[#25282f] text-[#c7c5bc]'
          : 'bg-[#f4f2ea] border-[#dedacf] text-[#34373d]'
      }`}
      aria-label="فهرست عناوین سند"
    >
      {/* Header */}
      <div
        className={`h-10 px-4 border-b flex items-center justify-between text-xs font-semibold ${
          isDark ? 'border-[#25282f] bg-[#15171a]' : 'border-[#dedacf] bg-[#eae7de]'
        }`}
      >
        <div className="flex items-center gap-2">
          <ListTree className={`w-3.5 h-3.5 ${isDark ? 'text-[#c67d58]' : 'text-[#8f4b2d]'}`} />
          <span>فهرست عناوین ({headings.length})</span>
        </div>
        <button
          onClick={onClose}
          className={`p-1 rounded opacity-70 hover:opacity-100 ${
            isDark ? 'hover:bg-[#252a30]' : 'hover:bg-[#dfdbcf]'
          }`}
          title="بستن فهرست"
          aria-label="بستن فهرست"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-0.5 text-xs">
        {headings.length === 0 ? (
          <div className="text-center py-10 text-[11px] opacity-60">
            هیچ تیتری در سند یافت نشد. با استفاده از # تیتر اضافه کنید.
          </div>
        ) : (
          headings.map((heading, idx) => {
            const indentClass =
              heading.level === 1
                ? 'font-bold text-[13px]'
                : heading.level === 2
                ? 'font-medium pl-3'
                : 'opacity-70 text-[11px] pl-6';

            const isCurrent = activeId === heading.id;

            return (
              <button
                key={`${heading.id}-${idx}`}
                onClick={() => onSelectHeading(heading.id)}
                className={`w-full text-right px-2.5 py-1.5 rounded transition-all flex items-start gap-1.5 group ${indentClass} ${
                  isCurrent
                    ? isDark
                      ? 'bg-[#252a31] text-white font-medium border-r-2 border-[#c67d58]'
                      : 'bg-[#e5e1d5] text-[#1a1a1a] font-medium border-r-2 border-[#8f4b2d]'
                    : isDark
                    ? 'hover:bg-[#202328] hover:text-white'
                    : 'hover:bg-[#ebe8de] hover:text-[#111111]'
                }`}
              >
                <Hash className="w-3 h-3 opacity-40 mt-0.5 shrink-0" />
                <span className="truncate leading-relaxed">{heading.text}</span>
              </button>
            );
          })
        )}
      </div>
    </aside>
  );
};
