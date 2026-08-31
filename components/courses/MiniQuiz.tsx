'use client'

import { CheckCircle2, RotateCcw, XCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { QuizQuestion } from '@/lib/courses/types'

interface MiniQuizProps {
  question: QuizQuestion
  savedAnswerId?: string
  onSubmit: (answerId: string, isCorrect: boolean) => void
}

const TYPE_LABELS = {
  'multiple-choice': 'Multiple choice',
  'true-false': 'True or false',
  'output-prediction': 'Output prediction',
} as const

export default function MiniQuiz({
  question,
  savedAnswerId,
  onSubmit,
}: MiniQuizProps) {
  const [selectedAnswerId, setSelectedAnswerId] = useState(
    savedAnswerId ?? ''
  )
  const [submitted, setSubmitted] = useState(Boolean(savedAnswerId))

  useEffect(() => {
    if (savedAnswerId) {
      setSelectedAnswerId(savedAnswerId)
      setSubmitted(true)
    }
  }, [savedAnswerId])

  const isCorrect =
    submitted && selectedAnswerId === question.correctOptionId

  function submitAnswer() {
    if (!selectedAnswerId) return
    const correct = selectedAnswerId === question.correctOptionId
    setSubmitted(true)
    onSubmit(selectedAnswerId, correct)
  }

  function retry() {
    setSelectedAnswerId('')
    setSubmitted(false)
  }

  return (
    <section className="courses-lesson-section" aria-labelledby="knowledge-check">
      <span className="dashboard-eyebrow dashboard-eyebrow-mono">
        Knowledge check
      </span>
      <h2 id="knowledge-check">Check your understanding</h2>

      <div className="courses-quiz">
        <span className="courses-quiz-type">
          {TYPE_LABELS[question.type]}
        </span>
        <p className="courses-quiz-prompt">{question.prompt}</p>

        <fieldset className="courses-quiz-options" disabled={submitted}>
          <legend className="courses-visually-hidden">
            Choose one answer
          </legend>
          {question.options.map(option => {
            const isSelected = selectedAnswerId === option.id
            const isCorrectOption =
              submitted && option.id === question.correctOptionId
            const isWrongSelection =
              submitted && isSelected && !isCorrectOption

            return (
              <label
                className={[
                  'courses-quiz-option',
                  isSelected ? 'is-selected' : '',
                  isCorrectOption ? 'is-correct' : '',
                  isWrongSelection ? 'is-incorrect' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                key={option.id}
              >
                <input
                  type="radio"
                  name={question.id}
                  value={option.id}
                  checked={isSelected}
                  onChange={() => setSelectedAnswerId(option.id)}
                />
                <span className="courses-quiz-radio" aria-hidden="true" />
                <span>{option.label}</span>
              </label>
            )
          })}
        </fieldset>

        {submitted ? (
          <div
            className={
              isCorrect
                ? 'courses-quiz-feedback is-correct'
                : 'courses-quiz-feedback is-incorrect'
            }
            role="status"
          >
            {isCorrect ? (
              <CheckCircle2 size={18} aria-hidden="true" />
            ) : (
              <XCircle size={18} aria-hidden="true" />
            )}
            <div>
              <strong>{isCorrect ? 'Correct' : 'Not quite'}</strong>
              <p>{question.explanation}</p>
            </div>
          </div>
        ) : (
          <button
            type="button"
            className="btn-primary courses-quiz-submit"
            onClick={submitAnswer}
            disabled={!selectedAnswerId}
          >
            Check answer
          </button>
        )}

        {submitted && (
          <button
            type="button"
            className="courses-quiz-retry"
            onClick={retry}
          >
            <RotateCcw size={14} aria-hidden="true" />
            Try again
          </button>
        )}
      </div>
    </section>
  )
}
