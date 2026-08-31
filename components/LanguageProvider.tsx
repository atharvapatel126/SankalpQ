'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { LANGUAGES, Language } from '@/lib/languages'
import { getTranslations, TranslationSet } from '@/lib/translations'

const LANGUAGE_STORAGE_KEY = 'sankalpq-language'
const DEFAULT_LANGUAGE = LANGUAGES[0]

interface LanguageContextValue {
  language: Language
  setLanguage: (code: string) => void
  translations: TranslationSet
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined)

export default function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [languageCode, setLanguageCode] = useState(DEFAULT_LANGUAGE.code)
  const [storageReady, setStorageReady] = useState(false)

  useEffect(() => {
    try {
      const storedCode = window.localStorage.getItem(LANGUAGE_STORAGE_KEY)
      if (storedCode && LANGUAGES.some(language => language.code === storedCode)) {
        setLanguageCode(storedCode)
      }
    } catch {
      // Keep English when localStorage is unavailable.
    } finally {
      setStorageReady(true)
    }
  }, [])

  useEffect(() => {
    if (!storageReady) return
    try {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, languageCode)
    } catch {
      // Language selection still works for the current session.
    }
  }, [languageCode, storageReady])

  const language = LANGUAGES.find(item => item.code === languageCode) ?? DEFAULT_LANGUAGE
  const translations = useMemo(() => getTranslations(language.code), [language.code])

  useEffect(() => {
    document.documentElement.lang = language.code.toLowerCase()
    document.documentElement.dir = language.dir ?? 'ltr'
  }, [language])

  const value = useMemo(
    () => ({
      language,
      setLanguage: (code: string) => {
        if (LANGUAGES.some(item => item.code === code)) setLanguageCode(code)
      },
      translations,
    }),
    [language, translations]
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) throw new Error('useLanguage must be used within LanguageProvider')
  return context
}
