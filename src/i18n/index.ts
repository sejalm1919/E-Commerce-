import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './en.json';
import hi from './hi.json';

const LANGUAGE_KEY = 'appLanguage';

// Get saved language or default to 'en'
const getSavedLanguage = (): string => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(LANGUAGE_KEY) || 'en';
  }
  return 'en';
};

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      hi: { translation: hi },
    },
    lng: getSavedLanguage(),
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

// Update HTML lang attribute when language changes
i18n.on('languageChanged', (lng) => {
  if (typeof document !== 'undefined') {
    document.documentElement.lang = lng;
  }
  localStorage.setItem(LANGUAGE_KEY, lng);
});

// Set initial HTML lang
if (typeof document !== 'undefined') {
  document.documentElement.lang = getSavedLanguage();
}

export default i18n;

// Types for localized content from backend
export type LocalizedString = {
  en: string;
  hi?: string;
};

// Utility to get localized text from backend data
export function getLocalizedText(field: LocalizedString | string): string {
  if (typeof field === 'string') {
    return field;
  }
  const lang = i18n.language as 'en' | 'hi';
  return field[lang] || field.en;
}