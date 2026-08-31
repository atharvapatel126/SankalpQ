'use client'

import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react'
import { useState } from 'react'
import type { InteractiveExample } from '@/lib/courses/types'

interface InteractiveDemoProps {
  example: InteractiveExample
}

export default function InteractiveDemo({ example }: InteractiveDemoProps) {
  const [stepIndex, setStepIndex] = useState(0)
  const current = example.steps[stepIndex]
  const isFirst = stepIndex === 0
  const isLast = stepIndex === example.steps.length - 1

  return (
    <section className="courses-lesson-section" aria-labelledby="interactive-example">
      <span className="dashboard-eyebrow dashboard-eyebrow-mono">
        Interactive example
      </span>
      <h2 id="interactive-example">{example.title}</h2>
      <p className="courses-section-intro">{example.description}</p>

      <div className="courses-demo" aria-live="polite">
        <div className="courses-demo-tabs" aria-label="Example steps">
          {example.steps.map((step, index) => (
            <button
              key={step.label}
              type="button"
              className={index === stepIndex ? 'is-active' : ''}
              onClick={() => setStepIndex(index)}
              aria-label={'Show step ' + (index + 1) + ': ' + step.label}
              aria-pressed={index === stepIndex}
            >
              {index + 1}
            </button>
          ))}
        </div>

        <div className="courses-demo-state">
          <span>{current.label}</span>
          <code>{current.state}</code>
          <p>{current.explanation}</p>
        </div>

        <div className="courses-demo-controls">
          <button
            type="button"
            className="courses-icon-button"
            onClick={() => setStepIndex(index => Math.max(0, index - 1))}
            disabled={isFirst}
            aria-label="Previous example step"
            title="Previous step"
          >
            <ChevronLeft size={17} aria-hidden="true" />
          </button>
          <span>
            Step {stepIndex + 1} of {example.steps.length}
          </span>
          {isLast ? (
            <button
              type="button"
              className="courses-icon-button"
              onClick={() => setStepIndex(0)}
              aria-label="Restart example"
              title="Restart example"
            >
              <RotateCcw size={16} aria-hidden="true" />
            </button>
          ) : (
            <button
              type="button"
              className="courses-icon-button"
              onClick={() =>
                setStepIndex(index =>
                  Math.min(example.steps.length - 1, index + 1)
                )
              }
              aria-label="Next example step"
              title="Next step"
            >
              <ChevronRight size={17} aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
    </section>
  )
}
