import Link from 'next/link'
import { ArrowRight, CircuitBoard } from 'lucide-react'
import type { BuilderExercise } from '@/lib/courses/types'

interface TryInCircuitBuilderProps {
  exercise: BuilderExercise
}

export default function TryInCircuitBuilder({
  exercise,
}: TryInCircuitBuilderProps) {
  const href =
    '/circuit-builder?starter=' +
    encodeURIComponent(exercise.starterCircuitId) +
    '&source=course'

  return (
    <section className="courses-builder-exercise" aria-labelledby="try-it-yourself">
      <div className="courses-builder-icon" aria-hidden="true">
        <CircuitBoard size={20} strokeWidth={1.5} />
      </div>
      <div>
        <span className="dashboard-eyebrow dashboard-eyebrow-mono">
          Try it yourself
        </span>
        <h2 id="try-it-yourself">Open this idea in Circuit Builder</h2>
        <p>{exercise.task}</p>
      </div>
      <Link href={href} className="btn-outline courses-builder-action">
        Open circuit
        <ArrowRight size={16} strokeWidth={1.5} aria-hidden="true" />
      </Link>
    </section>
  )
}
