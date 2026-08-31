import { Check } from 'lucide-react'

interface ConceptSectionProps {
  introduction: string
  paragraphs: string[]
  keyPoints: string[]
}

export default function ConceptSection({
  introduction,
  paragraphs,
  keyPoints,
}: ConceptSectionProps) {
  return (
    <>
      <section className="courses-lesson-section" aria-labelledby="concept-introduction">
        <span className="dashboard-eyebrow dashboard-eyebrow-mono">
          Concept introduction
        </span>
        <h2 id="concept-introduction">Start with the idea</h2>
        <p className="courses-concept-lead">{introduction}</p>
      </section>

      <section className="courses-lesson-section" aria-labelledby="core-explanation">
        <span className="dashboard-eyebrow dashboard-eyebrow-mono">
          Core explanation
        </span>
        <h2 id="core-explanation">How it works</h2>
        <div className="courses-concept-copy">
          {paragraphs.map(paragraph => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <ul className="courses-key-points">
          {keyPoints.map(point => (
            <li key={point}>
              <Check size={15} aria-hidden="true" />
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}
