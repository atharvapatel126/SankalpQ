// ─────────────────────────────────────────────────────────────────────────────
// SankalpQ — Instructor Portal Types
// Strict TypeScript — no `any` usage
// ─────────────────────────────────────────────────────────────────────────────

import type { QuantumCircuit } from '@/lib/quantum/types'
import type {
  ChallengeDifficulty,
  ChallengeType,
} from '@/lib/challenges/types'
import type { QuizQuestionType } from '@/lib/courses/types'

// ── User / Role ───────────────────────────────────────────────────────────────

export type UserRole = 'student' | 'instructor' | 'admin'

export interface PlatformUser {
  id: string
  name: string
  email: string
  role: UserRole
  avatarInitials: string
  createdAt: string
  lastActiveAt: string | null
}

// ── Student (instructor view) ─────────────────────────────────────────────────

export type StudentStatus = 'active' | 'inactive' | 'needs-attention'

export interface StudentOverview extends PlatformUser {
  role: 'student'
  overallProgress: number      // 0-100
  coursesCompleted: number
  lessonsCompleted: number
  challengesCompleted: number
  averageQuizScore: number     // 0-100
  learningStreak: number       // days
  status: StudentStatus
  strongConcepts: string[]
  weakConcepts: string[]
}

export interface StudentActivity {
  id: string
  studentId: string
  type: 'lesson-complete' | 'circuit-built' | 'challenge-attempt' | 'quiz-complete'
  label: string
  detail: string
  timestamp: string
}

export interface StudentCourseProgress {
  courseId: string
  courseTitle: string
  completedLessons: number
  totalLessons: number
  percentage: number
  averageQuizScore: number
  lastAccessedAt: string | null
}

export interface StudentChallengeProgress {
  challengeId: string
  challengeTitle: string
  difficulty: ChallengeDifficulty
  completed: boolean
  attempts: number
  bestScore: number
  hintsUsed: number
}

export interface StudentDetail extends StudentOverview {
  courseProgress: StudentCourseProgress[]
  challengeProgress: StudentChallengeProgress[]
  recentActivity: StudentActivity[]
}

// ── Instructor Course ─────────────────────────────────────────────────────────

export type CourseLevel = 'beginner' | 'intermediate' | 'advanced'
export type ContentStatus = 'draft' | 'published' | 'archived'

export interface InstructorLesson {
  id: string
  courseId: string
  order: number
  title: string
  description: string
  learningObjectives: string[]
  theoryContent: string
  formula: string
  interactiveExplanation: string
  circuitTemplateId: string | null
  quizQuestions: InstructorQuizQuestion[]
  status: ContentStatus
  estimatedMinutes: number
  createdAt: string
  updatedAt: string
}

export interface InstructorCourse {
  id: string
  title: string
  description: string
  level: CourseLevel
  thumbnailUrl: string | null
  lessons: InstructorLesson[]
  studentsEnrolled: number
  completionRate: number       // 0-100
  averageQuizScore: number     // 0-100
  status: ContentStatus
  createdAt: string
  updatedAt: string
}

// ── Circuit Template ──────────────────────────────────────────────────────────

export type CircuitCategory =
  | 'superposition'
  | 'entanglement'
  | 'measurement'
  | 'gates'
  | 'algorithms'
  | 'error-correction'

export interface CircuitTemplate {
  id: string
  name: string
  description: string
  category: CircuitCategory
  difficulty: ChallengeDifficulty
  circuit: QuantumCircuit
  expectedResult: string
  educationalExplanation: string
  createdAt: string
  updatedAt: string
}

// ── Instructor Challenge ──────────────────────────────────────────────────────

export interface ChallengeHint {
  order: number
  text: string
}

export interface ChallengeValidationConfig {
  expectedProbabilities: Record<string, number>
  probabilityTolerance: number
  requiredGates: string[]
  explanation: string
}

export interface InstructorChallenge {
  id: string
  title: string
  description: string
  objective: string
  type: ChallengeType
  difficulty: ChallengeDifficulty
  starterCircuitId: string | null
  validationConfig: ChallengeValidationConfig
  hints: ChallengeHint[]
  totalAttempts: number
  completionRate: number       // 0-100
  averageAttempts: number
  hintsUsedRate: number        // 0-100
  status: ContentStatus
  estimatedMinutes: number
  createdAt: string
  updatedAt: string
}

// ── Assessment / Quiz ─────────────────────────────────────────────────────────

export interface InstructorQuizOption {
  id: string
  label: string
}

export interface InstructorQuizQuestion {
  id: string
  assessmentId: string
  type: QuizQuestionType
  prompt: string
  options: InstructorQuizOption[]
  correctOptionId: string
  explanation: string
  relatedConcept: string
  averageScore: number         // 0-100
  attemptCount: number
}

export interface InstructorAssessment {
  id: string
  title: string
  relatedCourseId: string | null
  relatedConcept: string
  questions: InstructorQuizQuestion[]
  averageScore: number         // 0-100
  totalAttempts: number
  successRate: number          // 0-100
  status: ContentStatus
  createdAt: string
  updatedAt: string
}

// ── Announcements ─────────────────────────────────────────────────────────────

export type AnnouncementTarget = 'all' | 'course' | 'specific'
export type AnnouncementStatus = 'draft' | 'published' | 'archived'

export interface Announcement {
  id: string
  title: string
  message: string
  targetType: AnnouncementTarget
  targetCourseId: string | null
  targetStudentIds: string[]
  status: AnnouncementStatus
  publishDate: string
  createdAt: string
  updatedAt: string
}

// ── Analytics ─────────────────────────────────────────────────────────────────

export interface ConceptDifficulty {
  concept: string
  strugglingPercentage: number   // 0-100
  totalStudents: number
  averageScore: number           // 0-100
}

export interface CourseAnalytics {
  courseId: string
  courseTitle: string
  enrolled: number
  completionRate: number
  averageQuizScore: number
  averageTimeMinutes: number
  engagementScore: number        // 0-100
}

export interface ChallengeAnalytics {
  challengeId: string
  challengeTitle: string
  difficulty: ChallengeDifficulty
  totalAttempts: number
  completionRate: number
  averageAttempts: number
  hintsUsedRate: number
}

export interface StudentGrowthPoint {
  month: string
  students: number
}

export interface PlatformAnalytics {
  totalStudents: number
  activeStudents: number
  totalCourses: number
  activeChallenges: number
  averageCourseCompletion: number
  averageQuizScore: number
  studentGrowth: StudentGrowthPoint[]
  courseAnalytics: CourseAnalytics[]
  challengeAnalytics: ChallengeAnalytics[]
  conceptDifficulty: ConceptDifficulty[]
}

// ── AI Insights ───────────────────────────────────────────────────────────────

export type InsightPriority = 'high' | 'medium' | 'low'
export type InsightType =
  | 'concept-struggle'
  | 'course-improvement'
  | 'challenge-recommendation'
  | 'student-at-risk'
  | 'positive-trend'

export interface AIInsight {
  id: string
  type: InsightType
  priority: InsightPriority
  title: string
  message: string
  recommendation: string
  affectedStudentCount: number
  relatedConceptOrCourse: string
  generatedAt: string
}

// ── Filter/Sort Types ─────────────────────────────────────────────────────────

export type StudentFilter = 'all' | 'active' | 'inactive' | 'high-performing' | 'needs-attention'
export type SortDirection = 'asc' | 'desc'

export interface StudentSortConfig {
  field: keyof Pick<StudentOverview, 'name' | 'overallProgress' | 'averageQuizScore' | 'lastActiveAt' | 'challengesCompleted'>
  direction: SortDirection
}
