import { Check } from 'lucide-react'
import { useLanguage } from '@/components/LanguageProvider'

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
  const { translations } = useLanguage()
  const t = translations.student.courses
  return (
    <>
      <section className="courses-lesson-section" aria-labelledby="concept-introduction">
        <span className="dashboard-eyebrow dashboard-eyebrow-mono">
          {t.conceptIntroduction}
        </span>
        <h2 id="concept-introduction">{t.startWithIdea}</h2>
        <p className="courses-concept-lead">{introduction}</p>
      </section>

      <section className="courses-lesson-section" aria-labelledby="core-explanation">
        <span className="dashboard-eyebrow dashboard-eyebrow-mono">
          {t.coreExplanation}
        </span>
        <h2 id="core-explanation">{t.howItWorks}</h2>
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
