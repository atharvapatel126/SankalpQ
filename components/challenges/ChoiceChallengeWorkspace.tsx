'use client'

import { ArrowRight, Check } from 'lucide-react'
import CircuitGrid from '@/components/circuit/CircuitGrid'
import type { UseChallengeSessionReturn } from '@/hooks/useChallengeSession'
import type { ChoiceChallenge } from '@/lib/challenges/types'
import { getCircuitWidth } from '@/lib/quantum/circuit-utils'
import { useLanguage } from '@/components/LanguageProvider'

interface ChoiceChallengeWorkspaceProps {
  challenge: ChoiceChallenge
  session: UseChallengeSessionReturn
}

export default function ChoiceChallengeWorkspace({
  challenge,
  session,
}: ChoiceChallengeWorkspaceProps) {
  const { translations } = useLanguage()
  const t = translations.student.challenges
  const locked = session.result !== null

  return (
    <section className="challenge-task" aria-labelledby="challenge-workspace-title">
      <div className="challenge-task-toolbar">
        <div>
          <span className="dashboard-eyebrow dashboard-eyebrow-mono">{t.workspace}</span>
          <h2 id="challenge-workspace-title">
            {challenge.type === 'predict-output'
              ? t.chooseExpectedOutput
              : t.chooseGate}
          </h2>
        </div>
      </div>

      {challenge.previewCircuit && (
        <div className="challenge-circuit-preview" aria-label={t.circuitToAnalyze}>
          <div className="circuit-grid-scroll">
            <CircuitGrid
              circuit={challenge.previewCircuit}
              circuitWidth={getCircuitWidth(challenge.previewCircuit)}
              placementMode={{ type: 'idle' }}
              selectedOpId={null}
              readOnly
            />
          </div>
        </div>
      )}

      {challenge.stateTransition && (
        <div className="challenge-state-transition" aria-label={t.stateTransformation}>
          <code>{challenge.stateTransition.input}</code>
          <ArrowRight size={22} aria-hidden="true" />
          <code>{challenge.stateTransition.output}</code>
        </div>
      )}

      <fieldset className="challenge-options" disabled={locked}>
        <legend>{t.selectAnswer}</legend>
        {challenge.options.map(option => {
          const selected = session.selectedOptionId === option.id
          const correctAfterSubmit =
            locked && option.id === challenge.correctOptionId
          const incorrectAfterSubmit =
            locked && selected && option.id !== challenge.correctOptionId
          const localizedLabel = t.content[challenge.id]?.options?.[option.id] ?? option.label
          return (
            <label
              className={`challenge-option${selected ? ' is-selected' : ''}${correctAfterSubmit ? ' is-correct' : ''}${incorrectAfterSubmit ? ' is-incorrect' : ''}`}
              key={option.id}
            >
              <input
                type="radio"
                name={`challenge-${challenge.id}`}
                value={option.id}
                checked={selected}
                onChange={() => session.selectOption(option.id)}
              />
              <span>{localizedLabel}</span>
            </label>
          )
        })}
      </fieldset>

      <div className="challenge-choice-actions">
        <button
          type="button"
          className="btn-primary challenge-submit-button"
          onClick={session.submitChoice}
          disabled={!session.selectedOptionId || locked}
        >
          <Check size={15} aria-hidden="true" />
          {t.submitAnswer}
        </button>
      </div>
    </section>
  )
}
