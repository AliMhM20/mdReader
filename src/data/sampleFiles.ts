export interface SampleFile {
  id: string;
  name: string;
  description: string;
  language: 'fa' | 'en';
  content: string;
}

export const SAMPLE_FILES: SampleFile[] = [
  {
    id: 'persian-guide',
    name: 'راهنمای جامع فارسی.md',
    description: 'راهنمای کامل امکانات و ساختارهای مختلف مارک‌داون به زبان فارسی',
    language: 'fa',
    content: `# راهنمای جامع قالب‌بندی مارک‌داون 📝

به برنامه **نمایش‌دهنده و مبدل مارک‌داون برای ویندوز** خوش آمدید! این سند نمونه‌ای از قابلیت‌های غنی و پشتیبانی کامل از زبان فارسی است.

---

## ۱. تیترها و سلسله‌مراتب متنی

متن‌های مارک‌داون ساختار منظمی با تیترهای سطح ۱ تا ۶ دارند:
### زیرتیتر سطح ۳
#### تیتر سطح ۴ برای جزئیات

> **نکته مهم:** شما می‌توانید هر فایلی با پسوند \`.md\` یا \`.txt\` را با کشیدن و رها کردن (Drag & Drop) در صفحه بیندازید تا بلافاصله با استایل زیبا رندر شود.

---

## ۲. لیست‌ها و وظایف (Task Lists)

امکان ایجاد انواع فهرست‌های شماره‌دار و نشانه‌دار:

- [x] قابلیت کشیدن و رها کردن فایل‌ها (Drag & Drop)
- [x] نمایش تمیز و استاندارد کدهای برنامه‌نویسی
- [x] خروجی مستقیم با فرمت **PDF** (دانلود مستقیم و چاپ ویندوز)
- [x] ذخیره با فرمت متن ساده (**TXT**) بدون علائم مارک‌داون
- [ ] ذخیره در حافظه ابری (به‌زودی)

### مراحل ساده استفاده:
1. فایل \`.md\` خود را در پنجره رها کنید یا روی دکمه «باز کردن فایل» کلیک کنید.
2. پیش‌نمایش را بررسی و در صورت نیاز ویرایش کنید.
3. با یک کلیک خروجی **PDF** یا **Text** بگیرید!

---

## ۳. جدول مقایسه فرمت‌های خروجی

| فرمت خروجی | کاربرد اصلی | مزیت |
| :--- | :--- | :--- |
| **PDF** | گزارش‌ها، ارائه‌ها و اسناد رسمی | حفظ دقیق فونت، استایل و صفحه‌بندی |
| **Text (.txt)** | استفاده در سیستم‌های متنی | حذف خودکار تگ‌های مارک‌داون و متن خالص |
| **Markdown (.md)** | ویرایش مجدد در گیت‌هاب و ویرایشگرها | استاندارد جهانی متنی |
| **HTML** | اشتراک‌گذاری تحت وب | قابل باز شدن در هر مرورگری بدون نیاز به ابزار خاص |

---

## ۴. قطعه کدهای برنامه‌نویسی با Syntax Highlighting

کدهای زبان‌های مختلف مانند JavaScript, Python, Bash, HTML با رنگ‌آمیزی استاندارد نمایش داده می‌شوند:

\`\`\`javascript
// تابع استخراج آمار متن مارک‌داون
function analyzeMarkdown(content) {
  const words = content.trim().split(/\\s+/).length;
  const readingTime = Math.ceil(words / 200);
  
  return {
    wordCount: words,
    estimatedMinutes: readingTime,
    status: 'آماده خروجی گرفتن'
  };
}

console.log(analyzeMarkdown("متن تستی فارسی"));
\`\`\`

\`\`\`python
# نمونه اسکریپت پایتون
def export_document(filename, format_type):
    print(f"در حال صدور فایل {filename} با فرمت {format_type}...")
    return True
\`\`\`

---

## ۵. نقل‌قول‌ها و یادداشت‌های ویژه

> «سادگی بالاترین درجه پیچیدگی است.»
> — لئوناردو داوینچی

کلمات کلیدی درون متنی به صورت \`inline code\`، متن **پررنگ (Bold)**، *ایتالیک (Italic)*، و ~~خط‌خورده (Strikethrough)~~ به زیبایی قابل مشاهده هستند.

---

## ۶. خروجی گرفتن
برای ذخیره این فایل:
1. روی دکمه **«ذخیره / خروجی»** در نوار ابزار بالا کلیک کنید.
2. گزینه **«ذخیره به عنوان PDF»** یا **«ذخیره به عنوان فایل متنی (TXT)»** را انتخاب کنید.
`
  },
  {
    id: 'project-readme',
    name: 'README_Project.md',
    description: 'A standard software documentation with badges, installation, and architecture',
    language: 'en',
    content: `# Modern Windows Markdown Suite 🚀

A lightning-fast, sleek desktop Markdown viewer, live editor, and document exporter tailored for Windows users.

[![License: Apache 2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![Status: Stable](https://img.shields.io/badge/Status-Production%20Ready-green.svg)]()
[![Platform: Windows / Web](https://img.shields.io/badge/Platform-Windows%20%7C%20Web-blue)]()

---

## ✨ Key Features

- **Drag & Drop**: Seamlessly drop any \`.md\`, \`.markdown\`, or \`.txt\` file anywhere on the application window.
- **Flawless Formatting**: Full GitHub Flavored Markdown (GFM) support, including tables, task lists, code blocks with syntax highlighting, and blockquotes.
- **Export to PDF**: Generate high-fidelity vector PDF files directly or utilize the native Windows Print to PDF engine.
- **Export to Plain Text**: Strip markdown tokens and download clean, structured plain text ready for copy-pasting.
- **Table of Contents**: Auto-generated interactive outline navigation.
- **Bilingual & RTL**: Automatic detection of Persian, Arabic, and English content with proper alignment and typography.

---

## 🛠️ Quick Installation & Usage

You can launch this application directly or install it as a PWA / desktop app.

\`\`\`bash
# Clone the repository
git clone https://github.com/example/windows-markdown-exporter.git

# Install dependencies
npm install

# Start local server
npm run dev
\`\`\`

---

## 📊 Feature Matrix

| Feature | Supported | Export Formats |
| :--- | :---: | :--- |
| Live Preview | ✅ | Instant HTML |
| PDF Export | ✅ | Vector & Print |
| TXT Export | ✅ | Clean stripped text |
| Code Highlighting | ✅ | 50+ languages |
| RTL / Persian | ✅ | Vazirmatn font |

---

## 💡 Keyboard Shortcuts

- \`Ctrl + O\` : Open Markdown file
- \`Ctrl + P\` : Quick Print / Save as PDF
- \`Ctrl + S\` : Save / Export dialog
- \`Ctrl + Shift + C\` : Copy clean plain text

---

> Built with care for smooth documentation, note-taking, and rapid reporting.
`
  },
  {
    id: 'cheatsheet',
    name: 'Markdown_Cheatsheet.md',
    description: 'سریع‌ترین راهنمای سینتکس مارک‌داون همراه با جدول‌ها و علائم',
    language: 'fa',
    content: `# برگه تقلب سریع مارک‌داون (Markdown Cheatsheet)

خلاصه‌ای از تمام نشانه‌گذاری‌های مهم مارک‌داون:

## تیترها
\`\`\`markdown
# تیتر ۱
## تیتر ۲
### تیتر ۳
#### تیتر ۴
\`\`\`

## استایل متنی
- **پررنگ (Bold)**: \`**متن**\`
- *مورب (Italic)*: \`*متن*\`
- ~~خط‌خورده (Strikethrough)~~: \`~~متن~~\`
- کدهای درون خطی: \`\`\`کد\`\`\`

## پیوندها و تصاویر
- پیوند: \`[عنوان](https://example.com)\`
- تصویر: \`![توضیح عکس](image.png)\`

## جداول
\`\`\`markdown
| نام ستون ۱ | نام ستون ۲ |
| :--- | :---: |
| داده ۱ | داده ۲ |
\`\`\`

با کلیک روی دکمه خروجی PDF در نوار بالا، می‌توانید نسخه چاپی شکیل این برگه تقلب را دریافت کنید!
`
  }
];
