import { Lightbulb } from 'lucide-react'

interface SimulationExplanationProps {
  explanation: string
}

export default function SimulationExplanation({ explanation }: SimulationExplanationProps) {
  return (
    <section className="simulator-explanation" aria-labelledby="simulation-explanation-title">
      <div className="simulator-explanation-icon" aria-hidden="true">
        <Lightbulb size={18} />
      </div>
      <div>
        <span className="dashboard-eyebrow dashboard-eyebrow-mono">Why this happened</span>
        <h3 id="simulation-explanation-title">Result explanation</h3>
        <p>{explanation}</p>
      </div>
    </section>
  )
}
