// §7 — Language switcher list
// UI-only prototype: selecting a language updates the displayed code
// but does not trigger real i18n / translation logic.
// TODO (production): wire full RTL support for Arabic (ar) — layout flip,
// font stack, and directional overrides are required.

export interface Language {
  name: string
  native: string
  code: string
  dir?: 'rtl' | 'ltr'
}

export const LANGUAGE_STORAGE_KEY = 'sankalpq-language'

export const LANGUAGES: Language[] = [
  { name: 'English',            native: 'English',             code: 'EN' },
  { name: 'Hindi',              native: 'हिन्दी',               code: 'HI' },
  { name: 'Bengali',            native: 'বাংলা',                code: 'BN' },
  { name: 'Tamil',              native: 'தமிழ்',                code: 'TA' },
  { name: 'Marathi',            native: 'मराठी',                code: 'MR' },
  { name: 'Mandarin Chinese',   native: '中文',                  code: 'ZH' },
  { name: 'Spanish',            native: 'Español',             code: 'ES' },
  { name: 'French',             native: 'Français',            code: 'FR' },
  // Arabic is RTL — row text-direction handled in LanguageSwitcher component
  { name: 'Arabic',             native: 'العربية',              code: 'AR', dir: 'rtl' },
  { name: 'Portuguese',         native: 'Português',           code: 'PT' },
]
