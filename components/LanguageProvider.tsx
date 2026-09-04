'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { LANGUAGES, LANGUAGE_STORAGE_KEY, Language } from '@/lib/languages'
import { AuthTranslations, getAuthTranslations } from '@/lib/auth-translations'
import { getTranslations, ResolvedTranslationSet } from '@/lib/translations'

const DEFAULT_LANGUAGE = LANGUAGES[0]

interface LanguageContextValue {
  language: Language
  setLanguage: (code: string) => void
  translations: ResolvedTranslationSet
  auth: AuthTranslations
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined)

interface LanguageProviderProps {
  children: React.ReactNode
  initialLanguage?: string
}

export default function LanguageProvider({ children, initialLanguage }: LanguageProviderProps) {
  const initialCode = LANGUAGES.some(item => item.code === initialLanguage)
    ? initialLanguage!
    : DEFAULT_LANGUAGE.code
  const [languageCode, setLanguageCode] = useState(initialCode)

  const setLanguage = useCallback((code: string) => {
    if (!LANGUAGES.some(item => item.code === code)) return

    setLanguageCode(code)
    try {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, code)
    } catch {
      // localStorage may be unavailable; the cookie still persists the choice.
    }
    document.cookie = `${LANGUAGE_STORAGE_KEY}=${encodeURIComponent(code)}; Path=/; Max-Age=31536000; SameSite=Lax`
  }, [])

  useEffect(() => {
    try {
      const storedCode = window.localStorage.getItem(LANGUAGE_STORAGE_KEY)
      if (!initialLanguage && storedCode && LANGUAGES.some(language => language.code === storedCode)) {
        setLanguageCode(storedCode)
        document.cookie = `${LANGUAGE_STORAGE_KEY}=${encodeURIComponent(storedCode)}; Path=/; Max-Age=31536000; SameSite=Lax`
      }
    } catch {
      // Storage may be unavailable; the server-provided language remains valid.
    }
  }, [initialCode, initialLanguage])

  const language = LANGUAGES.find(item => item.code === languageCode) ?? DEFAULT_LANGUAGE
  const translations = useMemo(() => getTranslations(language.code), [language.code])
  const auth = useMemo(() => getAuthTranslations(language.code), [language.code])

  useEffect(() => {
    document.documentElement.lang = language.code.toLowerCase()
    document.documentElement.dir = language.dir ?? 'ltr'
  }, [language])

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      translations,
      auth,
    }),
    [auth, language, setLanguage, translations]
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) throw new Error('useLanguage must be used within LanguageProvider')
  return context
}
