export interface FontOption {
  id: string;
  name: string;
  family: string;
  category: 'sans' | 'serif' | 'mono' | 'display' | 'traditional';
  description?: string;
  previewText?: string;
}

const STORAGE_KEY = 'md_viewer_custom_fonts';

/**
 * Format user-entered font name for Google Fonts API
 * Example: "roboto slab" -> "Roboto+Slab"
 */
export function formatFontFamilyForUrl(name: string): string {
  if (!name) return '';
  return name
    .trim()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('+');
}

/**
 * Clean display name for font
 */
export function formatFontDisplayName(name: string): string {
  if (!name) return '';
  return name
    .trim()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Build Google Fonts CSS URL
 */
export function buildGoogleFontUrl(fontName: string): string {
  const formatted = formatFontFamilyForUrl(fontName);
  return `https://fonts.googleapis.com/css2?family=${formatted}:ital,wght@0,300;0,400;0,600;0,700;1,400&display=swap`;
}

/**
 * Validate font name input before querying API
 */
export function validateFontName(name: string): { valid: boolean; error?: string } {
  const trimmed = name.trim();
  if (!trimmed) {
    return { valid: false, error: 'لطفاً نام فونت را به انگلیسی وارد کنید.' };
  }
  if (trimmed.length < 2) {
    return { valid: false, error: 'نام فونت بیش از حد کوتاه است.' };
  }
  // Google font names are in English/Latin letters, numbers, spaces, and hyphens
  if (!/^[a-zA-Z0-9\s-]+$/.test(trimmed)) {
    return {
      valid: false,
      error: 'نام فونت در گوگل فونتز باید با حروف انگلیسی نوشته شود (مثال: Montserrat یا Amiri).',
    };
  }
  return { valid: true };
}

/**
 * Known Persian/Arabic script fonts on Google Fonts
 */
export const KNOWN_ARABIC_GOOGLE_FONTS = new Set([
  'amiri',
  'scheherazade new',
  'scheherazade',
  'noto kufi arabic',
  'noto naskh arabic',
  'noto sans arabic',
  'lateef',
  'rakkas',
  'changa',
  'cairo',
  'almarai',
  'aref ruqaa',
  'tajawal',
  'el messiri',
  'marhey',
  'harmattan',
  'katibeh',
  'mirza',
  'reem kufi',
  'vazirmatn',
  'lalezar',
]);

/**
 * Detect language category of Google font
 */
export function detectFontLanguage(fontName: string): 'fa' | 'en' {
  const lower = fontName.trim().toLowerCase();
  if (KNOWN_ARABIC_GOOGLE_FONTS.has(lower) || lower.includes('arabic')) {
    return 'fa';
  }
  return 'en';
}

/**
 * Load font CSS stylesheet dynamically into DOM
 */
export function injectFontStylesheet(url: string, id: string): void {
  if (typeof document === 'undefined') return;
  const existing = document.getElementById(id);
  if (existing) return;

  const link = document.createElement('link');
  link.id = id;
  link.rel = 'stylesheet';
  link.href = url;
  document.head.appendChild(link);
}

/**
 * Fetch and validate Google Font with simple, non-technical Persian error messages
 */
export async function fetchAndLoadGoogleFont(
  fontName: string,
  userSelectedCategory?: 'fa' | 'en'
): Promise<{ success: boolean; font?: FontOption; error?: string }> {
  // 1. Check local internet connectivity
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    return {
      success: false,
      error: 'ارتباط کامپیوتر شما با اینترنت برقرار نیست. لطفاً وصل بودن اینترنت یا مودم خود را چک کنید.',
    };
  }

  // 2. Validate font name
  const validation = validateFontName(fontName);
  if (!validation.valid) {
    return { success: false, error: validation.error };
  }

  const displayName = formatFontDisplayName(fontName);
  const url = buildGoogleFontUrl(displayName);
  const linkId = `gfont-${displayName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;

  try {
    // 3. Make fetch request to Google Fonts CSS API
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000); // 12s timeout

    const response = await fetch(url, {
      method: 'GET',
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    // 4. Handle response status
    if (response.status === 400 || response.status === 404) {
      return {
        success: false,
        error: `فونتی با نام «${displayName}» در گوگل فونتز پیدا نشد. لطفاً املای انگلیسی نام فونت را چک کنید (مثال: Roboto یا Amiri).`,
      };
    }

    if (!response.ok) {
      return {
        success: false,
        error: 'سرور گوگل فونتز در حال حاضر با کندی مواجه است. لطفاً چند لحظه دیگر دوباره تلاش کنید.',
      };
    }

    // 5. Successfully received CSS -> inject stylesheet into document
    injectFontStylesheet(url, linkId);

    const detectedLang = userSelectedCategory || detectFontLanguage(displayName);

    const fontOption: FontOption = {
      id: `google-${displayName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
      name: `${displayName} (گوگل فونت)`,
      family: `'${displayName}', system-ui, sans-serif`,
      category: 'sans',
      description: 'فونت اضافه شده از Google Fonts API',
      previewText:
        detectedLang === 'fa'
          ? `${displayName}: پیش‌نمایش متنی فارسی`
          : `${displayName}: The quick brown fox jumps`,
    };

    // 6. Save in localStorage
    saveCustomFont(fontOption, detectedLang);

    return {
      success: true,
      font: fontOption,
    };
  } catch (err: any) {
    if (err?.name === 'AbortError') {
      return {
        success: false,
        error: 'پاسخی از سرور گوگل دریافت نشد (زمان اتصال به پایان رسید). لطفاً سرعت اینترنت خود را بررسی کنید.',
      };
    }

    // Network / CORS / Filtering error
    return {
      success: false,
      error: 'امکان اتصال به مخزن فونت‌های گوگل وجود ندارد. این مشکل معمولاً به دلیل محدودیت‌های اینترنتی یا نیاز به تغییر شبکه/فیلترشکن است. می‌توانید از فونت‌های آفلاین برنامه استفاده کنید.',
    };
  }
}

/**
 * Retrieve saved custom fonts from localStorage
 */
export function getStoredCustomFonts(): { persian: FontOption[]; english: FontOption[] } {
  if (typeof window === 'undefined' || !window.localStorage) {
    return { persian: [], english: [] };
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { persian: [], english: [] };
    const parsed = JSON.parse(raw);
    return {
      persian: Array.isArray(parsed?.persian) ? parsed.persian : [],
      english: Array.isArray(parsed?.english) ? parsed.english : [],
    };
  } catch {
    return { persian: [], english: [] };
  }
}

/**
 * Save a custom font into localStorage
 */
export function saveCustomFont(font: FontOption, language: 'fa' | 'en'): void {
  if (typeof window === 'undefined' || !window.localStorage) return;

  try {
    const current = getStoredCustomFonts();
    const list = language === 'fa' ? current.persian : current.english;

    // Avoid duplicate
    const filtered = list.filter((f) => f.id !== font.id && f.name !== font.name);
    filtered.unshift(font);

    if (language === 'fa') {
      current.persian = filtered;
    } else {
      current.english = filtered;
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
  } catch (e) {
    console.warn('Failed to save custom font to localStorage:', e);
  }
}
