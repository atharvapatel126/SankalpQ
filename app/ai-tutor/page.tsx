'use client'

import { FormEvent, KeyboardEvent, useEffect, useMemo, useRef, useState } from 'react'
import { BookOpen, RotateCcw, Send, Sparkles } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import rehypeKatex from 'rehype-katex'
import remarkMath from 'remark-math'
import AppShell from '@/components/AppShell'
import { useLanguage } from '@/components/LanguageProvider'
import { useCourseProgress } from '@/hooks/useCourseProgress'
import { getLessonById } from '@/lib/courses/course-data'
import type { AiTutorMessage } from '@/lib/ai-tutor/types'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function AssistantMessage({ content }: { content: string }) {
  return (
    <div className="ai-tutor-message-content ai-tutor-markdown">
      <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
        {content}
      </ReactMarkdown>
    </div>
  )
}

export default function AiTutorPage() {
  const { language, translations } = useLanguage()
  const { progress, hydrated } = useCourseProgress()
  const [messages, setMessages] = useState<AiTutorMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const isSendingRef = useRef(false)
  const tutor = translations.aiTutor

  const activeLesson = useMemo(() => {
    if (!hydrated || !progress.currentLessonId) return null
    return getLessonById(progress.currentLessonId) ?? null
  }, [hydrated, progress.currentLessonId])

  const courseContext = useMemo(() => {
    if (!activeLesson) return undefined

    return {
      course: activeLesson.course.title,
      lesson: activeLesson.lesson.title,
      summary: activeLesson.lesson.summary,
      introduction: activeLesson.lesson.introduction,
      keyPoints: activeLesson.lesson.keyPoints,
    }
  }, [activeLesson])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: loading ? 'smooth' : 'auto' })
  }, [loading, messages])

  async function sendMessage() {
    const content = input.trim()
    if (!content || loading || isSendingRef.current) return

    isSendingRef.current = true
    const userMessage: AiTutorMessage = { role: 'user', content }
    const nextMessages = [...messages, userMessage]
    setMessages(nextMessages)
    setInput('')
    setError(null)
    setLoading(true)
    let streamedAssistant = ''

    try {
      const response = await fetch('/api/ai-tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: nextMessages.slice(-20),
          language: language.code,
          courseContext,
        }),
      })

      if (!response.ok) {
        const payload: unknown = await response.json().catch(() => null)
        const message = isRecord(payload) && typeof payload.error === 'string'
          ? payload.error
          : tutor.requestError
        throw new Error(message)
      }

      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error(tutor.requestError)
      }

      const decoder = new TextDecoder()
      const appendAssistantText = (text: string) => {
        if (!text) return
        streamedAssistant += text
        setMessages(current => {
          const lastMessage = current[current.length - 1]
          if (lastMessage?.role === 'assistant') {
            return [
              ...current.slice(0, -1),
              { role: 'assistant', content: streamedAssistant },
            ]
          }
          return [...current, { role: 'assistant', content: streamedAssistant }]
        })
      }

      try {
        while (true) {
          const chunk = await reader.read()
          if (chunk.done) break
          appendAssistantText(decoder.decode(chunk.value, { stream: true }))
        }
        appendAssistantText(decoder.decode())
      } finally {
        reader.releaseLock()
      }

      if (!streamedAssistant.trim()) {
        throw new Error(tutor.requestError)
      }
    } catch (requestError) {
      setMessages(current => {
        const lastMessage = current[current.length - 1]
        const withoutAssistant = lastMessage?.role === 'assistant' ? current.slice(0, -1) : current
        if (streamedAssistant.trim()) {
          return [...withoutAssistant, { role: 'assistant', content: streamedAssistant }]
        }
        return withoutAssistant.slice(0, -1)
      })
      setInput(content)
      const requestMessage = requestError instanceof Error ? requestError.message : ''
      setError(/failed to fetch|network error|body stream/i.test(requestMessage) ? tutor.requestError : requestMessage || tutor.requestError)
      textareaRef.current?.focus()
    } finally {
      isSendingRef.current = false
      setLoading(false)
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    void sendMessage()
  }

  function handleInputKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      void sendMessage()
    }
  }

  function clearConversation() {
    if (loading) return
    setMessages([])
    setError(null)
    setInput('')
    textareaRef.current?.focus()
  }

  return (
    <AppShell>
      <div className="ai-tutor-page">
        <header className="ai-tutor-header">
          <div>
            <div className="ai-tutor-title-row">
              <span className="ai-tutor-title-mark" aria-hidden="true">
                <Sparkles size={18} strokeWidth={1.5} />
              </span>
              <h1>{tutor.title}</h1>
            </div>
            <p>{tutor.subtitle}</p>
          </div>

          <button
            type="button"
            className="ai-tutor-clear-button"
            onClick={clearConversation}
            disabled={loading || messages.length === 0}
          >
            <RotateCcw size={15} strokeWidth={1.5} aria-hidden="true" />
            {tutor.clearConversation}
          </button>
        </header>

        <section className="ai-tutor-context" aria-label={tutor.contextLabel}>
          <div className="ai-tutor-context-icon" aria-hidden="true">
            <BookOpen size={18} strokeWidth={1.5} />
          </div>
          <div className="ai-tutor-context-copy">
            <span className="ai-tutor-eyebrow">{tutor.contextLabel}</span>
            {activeLesson ? (
              <div className="ai-tutor-context-path">
                <strong>{activeLesson.course.title}</strong>
                <span className="ai-tutor-context-arrow" aria-hidden="true">↓</span>
                <span>{tutor.currentLesson}</span>
                <strong>{activeLesson.lesson.title}</strong>
              </div>
            ) : (
              <span className="ai-tutor-no-context">{tutor.noActiveLesson}</span>
            )}
          </div>
        </section>

        <section className="ai-tutor-chat" aria-label={tutor.messageListLabel}>
          <div className="ai-tutor-messages" role="log" aria-live="polite">
            {messages.length === 0 ? (
              <div className="ai-tutor-empty-state">
                <div className="ai-tutor-empty-icon" aria-hidden="true">
                  <Sparkles size={24} strokeWidth={1.5} />
                </div>
                <h2>{tutor.welcomeTitle}</h2>
                <p>{tutor.welcomeDescription}</p>
              </div>
            ) : (
              messages.map((message, index) => (
                <article
                  className={`ai-tutor-message-row${message.role === 'user' ? ' is-user' : ''}`}
                  key={`${message.role}-${index}`}
                >
                  <div className="ai-tutor-message-avatar" aria-hidden="true">
                    {message.role === 'user' ? 'S' : <Sparkles size={16} strokeWidth={1.5} />}
                  </div>
                  <div className="ai-tutor-message-card">
                    <div className="ai-tutor-message-meta">
                      {message.role === 'user' ? tutor.student : tutor.tutor}
                    </div>
                    {message.role === 'assistant' ? (
                      <AssistantMessage content={message.content} />
                    ) : (
                      <p className="ai-tutor-message-content">{message.content}</p>
                    )}
                  </div>
                </article>
              ))
            )}

            {loading && messages[messages.length - 1]?.role !== 'assistant' && (
              <div className="ai-tutor-message-row">
                <div className="ai-tutor-message-avatar" aria-hidden="true">
                  <Sparkles size={16} strokeWidth={1.5} />
                </div>
                <div className="ai-tutor-message-card ai-tutor-thinking">
                  <div className="ai-tutor-message-meta">{tutor.tutor}</div>
                  <div className="ai-tutor-thinking-copy">
                    <span className="ai-tutor-thinking-dots" aria-hidden="true"><i /><i /><i /></span>
                    {tutor.thinking}
                  </div>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {error && (
            <div className="ai-tutor-error" role="alert">
              <span>{error}</span>
              <button
                type="button"
                onClick={() => void sendMessage()}
                disabled={loading || !input.trim()}
              >
                {tutor.tryAgain}
              </button>
            </div>
          )}

          <form className="ai-tutor-composer" onSubmit={handleSubmit}>
            <textarea
              ref={textareaRef}
              value={input}
              onChange={event => setInput(event.target.value)}
              onKeyDown={handleInputKeyDown}
              placeholder={tutor.placeholder}
              aria-label={tutor.placeholder}
              rows={2}
              disabled={loading}
              maxLength={4000}
            />
            <button
              type="submit"
              className="btn-primary ai-tutor-send-button"
              disabled={loading || !input.trim()}
              aria-label={tutor.send}
            >
              <Send size={16} strokeWidth={1.8} aria-hidden="true" />
              <span>{tutor.send}</span>
            </button>
          </form>
        </section>
      </div>
    </AppShell>
  )
}
