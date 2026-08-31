import { ArrowRight } from 'lucide-react'
import type { LessonVisual } from '@/lib/courses/types'

interface VisualExplanationProps {
  visual: LessonVisual
}

export default function VisualExplanation({ visual }: VisualExplanationProps) {
  return (
    <section className="courses-lesson-section" aria-labelledby="visual-explanation">
      <span className="dashboard-eyebrow dashboard-eyebrow-mono">
        Visual explanation
      </span>
      <h2 id="visual-explanation">{visual.title}</h2>
      <p className="courses-section-intro">{visual.description}</p>
      <div className="courses-visual-flow">
        {visual.stages.map((stage, index) => (
          <div className="courses-visual-stage-wrap" key={stage.label}>
            <div className="courses-visual-stage">
              <span>{stage.label}</span>
              <code>{stage.state}</code>
              <p>{stage.explanation}</p>
            </div>
            {index < visual.stages.length - 1 && (
              <ArrowRight
                className="courses-visual-arrow"
                size={18}
                strokeWidth={1.5}
                aria-hidden="true"
              />
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
