export type AiTutorMessageRole = 'user' | 'assistant'

export interface AiTutorMessage {
  role: AiTutorMessageRole
  content: string
}

export interface AiTutorCourseContext {
  course: string
  lesson: string
  summary?: string
  introduction?: string
  keyPoints?: string[]
}

export interface AiTutorRequest {
  messages: AiTutorMessage[]
  language?: string
  courseContext?: AiTutorCourseContext
}

export interface AiTutorResponse {
  message: string
}
