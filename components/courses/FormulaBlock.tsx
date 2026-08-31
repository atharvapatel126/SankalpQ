import type { LessonFormula } from '@/lib/courses/types'

interface FormulaBlockProps {
  formula: LessonFormula
}

export default function FormulaBlock({ formula }: FormulaBlockProps) {
  return (
    <section className="courses-formula-block" aria-labelledby="lesson-formula">
      <span className="dashboard-eyebrow dashboard-eyebrow-mono">
        Formula
      </span>
      <code id="lesson-formula">{formula.expression}</code>
      <p>{formula.explanation}</p>
    </section>
  )
}
