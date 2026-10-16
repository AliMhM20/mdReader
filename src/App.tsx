/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { TitleBar } from './components/TitleBar';
import { Toolbar, ViewMode, ThemeMode, DirectionMode } from './components/Toolbar';
import { MarkdownPreview } from './components/MarkdownPreview';
import { MarkdownEditor } from './components/MarkdownEditor';
import { TableOfContents } from './components/TableOfContents';
import { DocumentStatsBar } from './components/DocumentStatsBar';
import { DropZoneOverlay } from './components/DropZoneOverlay';
import { ExportModal } from './components/ExportModal';
import { SAMPLE_FILES, SampleFile } from './data/sampleFiles';
import { PERSIAN_FONTS, ENGLISH_FONTS, FontOption } from './data/fonts';
import {
  renderMarkdown,
  extractHeadings,
  calculateStats,
  isRTL,
  markdownToPlainText,
} from './utils/markdownParser';
import { exportAsText, printDocument } from './utils/exportUtils';

export default function App() {
  // Document state
  const [currentFile, setCurrentFile] = useState<{
    name: string;
    content: string;
    isModified: boolean;
  }>({
    name: SAMPLE_FILES[0].name,
    content: SAMPLE_FILES[0].content,
    isModified: false,
  });

  // UI States
  const [viewMode, setViewMode] = useState<ViewMode>('preview');
  const [theme, setTheme] = useState<ThemeMode>('dark');
  const [directionMode, setDirectionMode] = useState<DirectionMode>('auto');
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [isTocOpen, setIsTocOpen] = useState<boolean>(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isMaximized, setIsMaximized] = useState<boolean>(false);
  const [activeHeadingId, setActiveHeadingId] = useState<string>('');

  // Selected Persian and English Fonts
  const [selectedPersianFont, setSelectedPersianFont] = useState<FontOption>(PERSIAN_FONTS[0]);
  const [selectedEnglishFont, setSelectedEnglishFont] = useState<FontOption>(ENGLISH_FONTS[0]);

  const dragCounterRef = useRef<number>(0);
  const previewRef = useRef<HTMLDivElement | null>(null);

  // Parse markdown and compute statistics
  const renderedHtml = useMemo(() => {
    return renderMarkdown(currentFile.content);
  }, [currentFile.content]);

  const headings = useMemo(() => {
    return extractHeadings(currentFile.content);
  }, [currentFile.content]);

  const stats = useMemo(() => {
    return calculateStats(currentFile.content, headings.length);
  }, [currentFile.content, headings.length]);

  // Determine effective direction (RTL for Persian, LTR for English)
  const isRtlEffective = useMemo(() => {
    if (directionMode === 'rtl') return true;
    if (directionMode === 'ltr') return false;
    return isRTL(currentFile.content);
  }, [directionMode, currentFile.content]);

  // Handle file reading
  const loadFile = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (content !== undefined) {
        setCurrentFile({
          name: file.name,
          content,
          isModified: false,
        });
      }
    };
    reader.readAsText(file, 'UTF-8');
  }, []);

  // Drag and drop handlers on window
  useEffect(() => {
    const handleDragEnter = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      dragCounterRef.current += 1;
      if (e.dataTransfer?.items && e.dataTransfer.items.length > 0) {
        setIsDragging(true);
      }
    };

    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      dragCounterRef.current -= 1;
      if (dragCounterRef.current <= 0) {
        dragCounterRef.current = 0;
        setIsDragging(false);
      }
    };

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      dragCounterRef.current = 0;
      setIsDragging(false);

      if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
        const file = e.dataTransfer.files[0];
        loadFile(file);
      }
    };

    window.addEventListener('dragenter', handleDragEnter);
    window.addEventListener('dragleave', handleDragLeave);
    window.addEventListener('dragover', handleDragOver);
    window.addEventListener('drop', handleDrop);

    return () => {
      window.removeEventListener('dragenter', handleDragEnter);
      window.removeEventListener('dragleave', handleDragLeave);
      window.removeEventListener('dragover', handleDragOver);
      window.removeEventListener('drop', handleDrop);
    };
  }, [loadFile]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        printDocument();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        setIsExportModalOpen(true);
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'o') {
        e.preventDefault();
        const input = document.querySelector('input[type="file"]') as HTMLInputElement;
        input?.click();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Scroll to heading when clicked in TOC
  const handleSelectHeading = (id: string) => {
    setActiveHeadingId(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Sample file selection
  const handleSelectSample = (sample: SampleFile) => {
    setCurrentFile({
      name: sample.name,
      content: sample.content,
      isModified: false,
    });
  };

  // Reset document
  const handleReset = () => {
    setCurrentFile({
      name: 'سند_جدید.md',
      content: `# عنوان سند\n\nمتن خود را اینجا تایپ کنید یا فایلی را با درگ اند دراپ داخل پنجره بیندازید...`,
      isModified: false,
    });
  };

  // Quick export handlers
  const handleQuickPrintPdf = () => {
    printDocument();
  };

  const handleQuickSaveText = () => {
    const plainText = markdownToPlainText(currentFile.content);
    const baseName = currentFile.name.replace(/\.[^/.]+$/, '') || 'document';
    exportAsText(plainText, `${baseName}.txt`);
  };

  // Zoom handlers
  const handleZoomChange = (delta: number) => {
    setZoomLevel((prev) => Math.min(180, Math.max(70, prev + delta)));
  };

  const handleResetZoom = () => {
    setZoomLevel(100);
  };

  const isDark = theme === 'dark';

  return (
    <div
      className={`min-h-screen h-screen flex flex-col overflow-hidden transition-colors ${
        isDark ? 'bg-[#141619] text-[#edece6]' : 'bg-[#f4f2ea] text-[#1e2022]'
      }`}
      dir={isRtlEffective ? 'rtl' : 'ltr'}
    >
      {/* Title Bar */}
      <TitleBar
        fileName={currentFile.name}
        isModified={currentFile.isModified}
        onReset={handleReset}
        onToggleMaximize={() => setIsMaximized(!isMaximized)}
        isMaximized={isMaximized}
        theme={theme}
      />

      {/* Main Action Toolbar with Font Selector */}
      <Toolbar
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        theme={theme}
        onThemeChange={setTheme}
        direction={directionMode}
        onDirectionChange={setDirectionMode}
        onOpenFile={loadFile}
        onSelectSample={handleSelectSample}
        onOpenExportModal={() => setIsExportModalOpen(true)}
        onQuickPrintPdf={handleQuickPrintPdf}
        onQuickSaveText={handleQuickSaveText}
        isTocOpen={isTocOpen}
        onToggleToc={() => setIsTocOpen(!isTocOpen)}
        zoomLevel={zoomLevel}
        onZoomChange={handleZoomChange}
        onResetZoom={handleResetZoom}
        headingsCount={headings.length}
        selectedPersianFont={selectedPersianFont}
        selectedEnglishFont={selectedEnglishFont}
        onSelectPersianFont={setSelectedPersianFont}
        onSelectEnglishFont={setSelectedEnglishFont}
      />

      {/* Workspace Area: Editor, Preview, and TOC */}
      <main className="flex-1 flex overflow-hidden relative" data-testid="workspace">
        {/* Editor View (Split or Raw) */}
        {(viewMode === 'split' || viewMode === 'raw') && (
          <div
            className={`h-full overflow-hidden ${
              viewMode === 'split' ? 'w-full md:w-1/2' : 'w-full'
            }`}
          >
            <MarkdownEditor
              value={currentFile.content}
              onChange={(newContent) =>
                setCurrentFile((prev) => ({
                  ...prev,
                  content: newContent,
                  isModified: true,
                }))
              }
              isRtl={isRtlEffective}
              theme={theme}
              selectedPersianFont={selectedPersianFont}
              selectedEnglishFont={selectedEnglishFont}
            />
          </div>
        )}

        {/* Formatted Markdown Preview View */}
        {(viewMode === 'preview' || viewMode === 'split') && (
          <div
            className={`h-full overflow-hidden ${
              viewMode === 'split' ? 'hidden md:block md:w-1/2' : 'w-full'
            }`}
          >
            <MarkdownPreview
              htmlContent={renderedHtml}
              theme={theme}
              isRtl={isRtlEffective}
              zoomLevel={zoomLevel}
              previewRef={previewRef}
              selectedPersianFont={selectedPersianFont}
              selectedEnglishFont={selectedEnglishFont}
            />
          </div>
        )}

        {/* Outline / Table of Contents Drawer */}
        <TableOfContents
          headings={headings}
          isOpen={isTocOpen}
          onClose={() => setIsTocOpen(false)}
          onSelectHeading={handleSelectHeading}
          activeId={activeHeadingId}
          theme={theme}
        />
      </main>

      {/* Status Bar */}
      <DocumentStatsBar
        stats={stats}
        fileName={currentFile.name}
        isRtlText={isRtlEffective}
        theme={theme}
        selectedPersianFont={selectedPersianFont}
        selectedEnglishFont={selectedEnglishFont}
      />

      {/* Drag & Drop Overlay */}
      <DropZoneOverlay isDragging={isDragging} theme={theme} />

      {/* Export & Save Modal */}
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        markdown={currentFile.content}
        renderedHtml={renderedHtml}
        fileName={currentFile.name}
        previewElement={previewRef.current}
        theme={theme}
        isRtl={isRtlEffective}
        selectedPersianFont={selectedPersianFont}
        selectedEnglishFont={selectedEnglishFont}
      />
    </div>
  );
}
