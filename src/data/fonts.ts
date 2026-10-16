export interface FontOption {
  id: string;
  name: string;
  family: string;
  category: 'sans' | 'serif' | 'mono' | 'display' | 'traditional';
  description?: string;
  previewText?: string;
}

export const PERSIAN_FONTS: FontOption[] = [
  {
    id: 'vazirmatn',
    name: 'وزیرمتن (Vazirmatn)',
    family: "'Vazirmatn', system-ui, sans-serif",
    category: 'sans',
    description: 'استاندارد، خوانا و مدرن‌ترین تایپ‌فیس فارسی',
    previewText: 'وزیرمتن: هنر نگارش شفاف',
  },
  {
    id: 'sahel',
    name: 'ساحل (Sahel)',
    family: "'Sahel', 'Vazirmatn', sans-serif",
    category: 'sans',
    description: 'فونت آرام، روان و عالی برای متون طولانی و مقالات',
    previewText: 'ساحل: آرامش و خوانایی در متن',
  },
  {
    id: 'shabnam',
    name: 'شبنم (Shabnam)',
    family: "'Shabnam', 'Vazirmatn', sans-serif",
    category: 'sans',
    description: 'شیک، متوازن و مینیمال با لبه‌های دقیق',
    previewText: 'شبنم: ظرافت مینیمال و دقیق',
  },
  {
    id: 'samim',
    name: 'صمیم (Samim)',
    family: "'Samim', 'Vazirmatn', sans-serif",
    category: 'sans',
    description: 'خطوط صمیمی، نرم و دلنشین',
    previewText: 'صمیم: لحن گرم و انسانی',
  },
  {
    id: 'parastoo',
    name: 'پرستو (Parastoo)',
    family: "'Parastoo', 'Vazirmatn', serif",
    category: 'serif',
    description: 'تایپ‌فیس کلاسیک و دندانه‌دار برای کتاب و نشر',
    previewText: 'پرستو: اصالت ادبیات کلاسیک',
  },
  {
    id: 'gandom',
    name: 'گندم (Gandom)',
    family: "'Gandom', 'Vazirmatn', serif",
    category: 'traditional',
    description: 'طراحی سنتی، اصیل و کلاسیک ایرانی',
    previewText: 'گندم: عطر خط سنتی فارسی',
  },
  {
    id: 'tanha',
    name: 'تنها (Tanha)',
    family: "'Tanha', 'Vazirmatn', sans-serif",
    category: 'sans',
    description: 'ساده، فشرده و هندسی',
    previewText: 'تنها: خلوص و سادگی فرم',
  },
  {
    id: 'noto-naskh',
    name: 'نسخ عربی/فارسی (Noto Naskh)',
    family: "'Noto Naskh Arabic', 'Vazirmatn', serif",
    category: 'traditional',
    description: 'قلم رسمی نسخ برای اسناد رسمی و تاریخی',
    previewText: 'نسخ: شیوه استوار و رسمی',
  },
  {
    id: 'lalezar',
    name: 'لاله‌زار (Lalezar)',
    family: "'Lalezar', cursive, display",
    category: 'display',
    description: 'نمایشی، پرانرژی و الهام‌گرفته از اعلان‌های تهران قدیم',
    previewText: 'لاله‌زار: خاطره‌انگیز و نمایشی',
  },
  {
    id: 'system',
    name: 'فونت پیش‌فرض سیستمی (System Sans)',
    family: "system-ui, -apple-system, 'Segoe UI', Tahoma, Arial, sans-serif",
    category: 'sans',
    description: 'فونت استاندارد سیستم‌عامل ویندوز',
    previewText: 'پیش‌فرض: تایپ‌فیس بومی سیستم',
  },
];

export const ENGLISH_FONTS: FontOption[] = [
  {
    id: 'inter',
    name: 'Inter',
    family: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    category: 'sans',
    description: 'The archetype of contemporary Swiss-inspired typography',
    previewText: 'The quick brown fox jumps over the lazy dog',
  },
  {
    id: 'merriweather',
    name: 'Merriweather',
    family: "'Merriweather', Georgia, serif",
    category: 'serif',
    description: 'A classic editorial serif engineered for pleasant reading',
    previewText: 'Literary clarity and editorial grace',
  },
  {
    id: 'lora',
    name: 'Lora',
    family: "'Lora', Georgia, serif",
    category: 'serif',
    description: 'A well-balanced contemporary serif with roots in calligraphy',
    previewText: 'Artistic typography for long-form essays',
  },
  {
    id: 'playfair',
    name: 'Playfair Display',
    family: "'Playfair Display', Georgia, serif",
    category: 'serif',
    description: 'High-contrast transitional European design with dramatic curves',
    previewText: 'Elegance, heritage, and distinction',
  },
  {
    id: 'cinzel',
    name: 'Cinzel',
    family: "'Cinzel', serif",
    category: 'display',
    description: 'Inspired by 1st century Roman inscriptions and classical proportions',
    previewText: 'CLASSICAL MONUMENTAL PROPORTIONS',
  },
  {
    id: 'jetbrains-mono',
    name: 'JetBrains Mono',
    family: "'JetBrains Mono', 'Fira Code', monospace",
    category: 'mono',
    description: 'A refined monospace typeface with clean character distinctions',
    previewText: 'const markdown = parse(source); // 123',
  },
  {
    id: 'fira-code',
    name: 'Fira Code',
    family: "'Fira Code', monospace",
    category: 'mono',
    description: 'Clean developer font with programming ligatures',
    previewText: 'fn calculate() -> Result<Data, Error>',
  },
  {
    id: 'georgia',
    name: 'Georgia',
    family: "Georgia, 'Times New Roman', serif",
    category: 'serif',
    description: 'Timeless transitional serif beloved in publishing',
    previewText: 'Refined book typography on digital paper',
  },
  {
    id: 'system-sans',
    name: 'System Sans (Segoe UI / SF)',
    family: "system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
    category: 'sans',
    description: 'Native operating system interface typography',
    previewText: 'Clear, crisp native system rendering',
  },
];
