export type CourseStatus = 'not-started' | 'in-progress' | 'completed'

export type QuizQuestionType =
  | 'multiple-choice'
  | 'true-false'
  | 'output-prediction'

export type StarterCircuitId =
  | 'starter-bell-state'
  | 'starter-superposition'
  | 'starter-not'
  | 'starter-ghz'
  | 'starter-phase-kickback'

export interface QuizOption {
  id: string
  label: string
}

export interface QuizQuestion {
  id: string
  type: QuizQuestionType
  prompt: string
  options: QuizOption[]
  correctOptionId: string
  explanation: string
}

export interface LessonFormula {
  expression: string
  explanation: string
}

export interface LessonStage {
  label: string
  state: string
  explanation: string
}

export interface LessonVisual {
  title: string
  description: string
  stages: LessonStage[]
}

export interface InteractiveExample {
  title: string
  description: string
  steps: LessonStage[]
}

export interface BuilderExercise {
  starterCircuitId: StarterCircuitId
  task: string
}

export interface Lesson {
  id: string
  slug: string
  order: number
  title: string
  summary: string
  introduction: string
  coreExplanation: string[]
  keyPoints: string[]
  formula?: LessonFormula
  visual: LessonVisual
  interactive: InteractiveExample
  builderExercise: BuilderExercise
  quiz: QuizQuestion
}

export interface Course {
  id: string
  databaseId?: string
  slug: string
  level: number
  title: string
  description: string
  outcome: string
  lessons: Lesson[]
}

export interface CourseProgressState {
  version: 1
  completedLessonIds: string[]
  currentLessonId: string | null
  quizScores: Record<string, number>
  quizAnswers: Record<string, string>
  updatedAt: string | null
}

export interface CourseProgressSummary {
  completedLessons: number
  totalLessons: number
  percentage: number
  status: CourseStatus
  continueLesson: Lesson
}
