import { GoogleGenAI, ThinkingLevel } from '@google/genai'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { User } from '@supabase/supabase-js'
import { LANGUAGES } from '@/lib/languages'
import type {
  AiTutorCourseContext,
  AiTutorMessage,
  AiTutorRequest,
} from '@/lib/ai-tutor/types'

export const runtime = 'nodejs'

const PRIMARY_MODEL = 'gemini-3.6-flash'
const FALLBACK_MODEL = 'gemini-3.5-flash-lite'
const MAX_PRIMARY_RETRIES = 1
const RETRY_DELAY_MS = 250
const MAX_BODY_LENGTH = 120_000
const MAX_MESSAGES = 20
const MAX_INCOMING_MESSAGES = 50
const MAX_MESSAGE_LENGTH = 4_000
const MAX_HISTORY_LENGTH = 28_000
const MAX_CONTEXT_LENGTH = 12_000

class RequestValidationError extends Error {}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function parseMessages(value: unknown): AiTutorMessage[] {
  if (!Array.isArray(value) || value.length === 0) {
    throw new RequestValidationError('Messages are required.')
  }

  if (value.length > MAX_INCOMING_MESSAGES) {
    throw new RequestValidationError('Conversation history is too long.')
  }

  const messages = value.map(item => {
    if (!isRecord(item) || (item.role !== 'user' && item.role !== 'assistant')) {
      throw new RequestValidationError('Message roles are invalid.')
    }

    if (typeof item.content !== 'string') {
      throw new RequestValidationError('Message content is invalid.')
    }

    const content = item.content.trim()
    if (!content) {
      throw new RequestValidationError('Messages cannot be empty.')
    }

    if (content.length > MAX_MESSAGE_LENGTH) {
      throw new RequestValidationError('A message is too long.')
    }

    return {
      role: item.role,
      content,
    } as AiTutorMessage
  })

  const recentMessages = messages.slice(-MAX_MESSAGES)
  if (recentMessages[recentMessages.length - 1]?.role !== 'user') {
    throw new RequestValidationError('The latest message must come from the student.')
  }

  if (recentMessages.reduce((total, message) => total + message.content.length, 0) > MAX_HISTORY_LENGTH) {
    throw new RequestValidationError('Conversation history is too large.')
  }

  return recentMessages
}

function parseCourseContext(value: unknown): AiTutorCourseContext | undefined {
  if (value === undefined) return undefined
  if (!isRecord(value)) {
    throw new RequestValidationError('Course context is invalid.')
  }

  if (
    typeof value.course !== 'string' ||
    typeof value.lesson !== 'string' ||
    !value.course.trim() ||
    !value.lesson.trim()
  ) {
    throw new RequestValidationError('Course context is incomplete.')
  }

  const context: AiTutorCourseContext = {
    course: value.course.trim().slice(0, 300),
    lesson: value.lesson.trim().slice(0, 300),
  }

  for (const key of ['summary', 'introduction'] as const) {
    if (value[key] !== undefined) {
      if (typeof value[key] !== 'string') {
        throw new RequestValidationError('Course context is invalid.')
      }
      context[key] = value[key].trim().slice(0, 4_000)
    }
  }

  if (value.keyPoints !== undefined) {
    if (
      !Array.isArray(value.keyPoints) ||
      value.keyPoints.length > 12 ||
      value.keyPoints.some(point => typeof point !== 'string' || !point.trim())
    ) {
      throw new RequestValidationError('Course key points are invalid.')
    }

    context.keyPoints = value.keyPoints
      .map(point => point.trim().slice(0, 600))
      .filter(Boolean)
  }

  const contextLength = [
    context.course,
    context.lesson,
    context.summary,
    context.introduction,
    ...(context.keyPoints ?? []),
  ].reduce((total, value) => total + (value?.length ?? 0), 0)

  if (contextLength > MAX_CONTEXT_LENGTH) {
    throw new RequestValidationError('Course context is too large.')
  }

  return context
}

function parseRequestBody(value: unknown): AiTutorRequest {
  if (!isRecord(value)) {
    throw new RequestValidationError('Request body is invalid.')
  }

  const messages = parseMessages(value.messages)
  const languageValue = value.language
  if (languageValue !== undefined && typeof languageValue !== 'string') {
    throw new RequestValidationError('Language is invalid.')
  }

  const languageCode = typeof languageValue === 'string' && languageValue.trim()
    ? languageValue.trim().toUpperCase()
    : 'EN'
  if (!LANGUAGES.some(language => language.code === languageCode)) {
    throw new RequestValidationError('Language is not supported.')
  }

  return {
    messages,
    language: languageCode,
    courseContext: parseCourseContext(value.courseContext),
  }
}

function getTutorSystemInstruction(languageCode: string, courseContext?: AiTutorCourseContext) {
  const language = LANGUAGES.find(item => item.code === languageCode) ?? LANGUAGES[0]
  const contextBlock = courseContext
    ? [
        'The student is currently studying this context:',
        `Course: ${courseContext.course}`,
        `Lesson: ${courseContext.lesson}`,
        courseContext.summary ? `Summary: ${courseContext.summary}` : '',
        courseContext.introduction ? `Introduction: ${courseContext.introduction}` : '',
        courseContext.keyPoints?.length ? `Key points:\n- ${courseContext.keyPoints.join('\n- ')}` : '',
      ].filter(Boolean).join('\n')
    : 'No current course or lesson context is available. Answer from the student\'s question and general quantum-computing knowledge.'

  return `You are SankalpQ AI Tutor, a clear and accurate quantum-computing tutor for a second-year engineering student.

Be concise, conversational, and educational. For a normal question, answer in roughly 100-250 words, preferably 2-4 short paragraphs or one compact list. Treat about 220 words as a hard default ceiling and stop once the question is answered; expand only when the student explicitly asks for detail or the concept genuinely requires it. Do not add multiple large sections, a long derivation, or several examples to a simple question. Use a heading, bullets, or numbered steps only when they improve clarity. Explain intuition first, then the precise definition or mathematics. Use Markdown and LaTeX when helpful: inline math as $...$ and display math as $$...$$. Do not force a quiz question into every answer; at most, end with one short understanding check when it is natural.

Be technically precise about quantum computing:
- Never say that n qubits simply process 2^n answers simultaneously. Explain that an n-qubit state has 2^n computational-basis amplitudes, which algorithms manipulate through superposition and interference; measurement does not reveal all 2^n values at once. For three qubits, measurement returns one three-bit basis state, not all eight states.
- Never say a qubit is literally both 0 and 1. Explain that it can be in a superposition, written as alpha|0> + beta|1>, with measurement probabilities determined by the amplitudes.
- Never say measurement destroys a qubit unconditionally. Explain that measurement produces a classical outcome and projects the quantum state onto the measured basis state.
- Prefer no analogy for a simple definition. If an analogy helps, label it explicitly as "Analogy:" and immediately give the actual quantum definition. Do not let an analogy replace the definition.

Use the supplied course context only when relevant; do not force the current lesson into an unrelated basic question. If the context is Grover's Algorithm, connect it when the student asks about search, amplitude amplification, or related ideas. Correct misconceptions gently, stay focused on quantum computing, and say when you are uncertain rather than inventing facts.

The student's selected application language is ${language.name} (${language.code}). Respond in that language whenever practical, while keeping standard quantum notation, code, and formulas readable.

${contextBlock}`
}

type GeminiErrorInfo = {
  name: string
  status?: number
  code?: string | number
  message: string
}

function getGeminiErrorInfo(error: unknown): GeminiErrorInfo {
  const details = isRecord(error) ? error : {}
  const nestedDetails = isRecord(details.error) ? details.error : {}
  const rawMessage = error instanceof Error
    ? error.message
    : typeof details.message === 'string'
      ? details.message
      : 'Unknown Gemini error'
  let parsedMessage: Record<string, unknown> | undefined
  try {
    const parsed = JSON.parse(rawMessage)
    parsedMessage = isRecord(parsed) ? parsed : undefined
  } catch {
    // Some SDK errors expose the upstream JSON response in message.
  }
  const parsedError = parsedMessage && isRecord(parsedMessage.error) ? parsedMessage.error : {}
  const status = [details.status, nestedDetails.status].find(value => typeof value === 'number')
  const code = [details.code, nestedDetails.code, parsedError.code].find(
    value => typeof value === 'string' || typeof value === 'number'
  )

  return {
    name: typeof details.name === 'string' ? details.name : error instanceof Error ? error.name : 'UnknownError',
    status: typeof status === 'number' ? status : undefined,
    code: typeof code === 'string' || typeof code === 'number' ? code : undefined,
    message: rawMessage,
  }
}

function isRateLimitError(errorInfo: GeminiErrorInfo) {
  return errorInfo.status === 429 || /rate|quota|too many requests/i.test(errorInfo.message)
}

function isAuthenticationError(errorInfo: GeminiErrorInfo) {
  return [401, 403].includes(errorInfo.status ?? 0) || /api key|authentication|unauthorized|permission denied/i.test(errorInfo.message)
}

function isModelUnavailableError(errorInfo: GeminiErrorInfo) {
  return errorInfo.status === 404 || /model.*(not found|unavailable|does not exist)|unknown model/i.test(errorInfo.message)
}

function isInvalidGeminiRequest(errorInfo: GeminiErrorInfo) {
  return errorInfo.status === 400 || /invalid argument|malformed request|invalid request/i.test(errorInfo.message)
}

function isNetworkError(errorInfo: GeminiErrorInfo) {
  return errorInfo.name === 'TypeError' || /network|fetch|econn|etimedout|timeout/i.test(errorInfo.message)
}

function isTransientAvailabilityError(errorInfo: GeminiErrorInfo) {
  return (
    (errorInfo.status !== undefined && errorInfo.status >= 500 && errorInfo.status <= 599) ||
    /\bUNAVAILABLE\b|temporarily unavailable|high demand/i.test(errorInfo.message)
  )
}

type GeminiContent = {
  role: 'user' | 'model'
  parts: { text: string }[]
}

class EmptyGeminiResponseError extends Error {
  constructor() {
    super('Gemini returned no usable text')
    this.name = 'EmptyGeminiResponseError'
  }
}

async function generateWithModel({
  ai,
  model,
  contents,
  systemInstruction,
  maxRetries,
}: {
  ai: GoogleGenAI
  model: string
  contents: GeminiContent[]
  systemInstruction: string
  maxRetries: number
}) {
  console.log(`AI Tutor: trying model ${model}`)

  let lastError: unknown
  for (let attempt = 0; attempt <= maxRetries; attempt += 1) {
    try {
      const response = await ai.models.generateContentStream({
        model,
        contents,
        config: {
          systemInstruction,
          thinkingConfig: {
            thinkingLevel: ThinkingLevel.LOW,
          },
          maxOutputTokens: 768,
        },
      })

      const iterator = response[Symbol.asyncIterator]()
      let firstText = ''

      while (!firstText) {
        const next = await iterator.next()
        if (next.done) break
        const chunkText = next.value.text ?? ''
        if (chunkText.trim()) firstText = chunkText
      }

      if (!firstText) {
        throw new EmptyGeminiResponseError()
      }

      console.log(`AI Tutor: successful response from ${model}`)
      return { iterator, firstText }
    } catch (error) {
      lastError = error
      const errorInfo = getGeminiErrorInfo(error)
      if (error instanceof EmptyGeminiResponseError || !isTransientAvailabilityError(errorInfo)) {
        throw error
      }

      const returnedStatus = errorInfo.status ?? errorInfo.code ?? 'unknown status'
      if (attempt < maxRetries) {
        console.warn(`AI Tutor: ${model} returned ${returnedStatus}, retry ${attempt + 1}`, errorInfo)
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS))
      } else {
        console.warn(`AI Tutor: ${model} returned ${returnedStatus} after all retries`, errorInfo)
      }
    }
  }

  throw lastError instanceof Error ? lastError : new Error('Gemini model availability failure')
}

function createTutorStreamResponse(
  stream: Awaited<ReturnType<typeof generateWithModel>>
) {
  const encoder = new TextEncoder()
  const readable = new ReadableStream({
    start(controller) {
      controller.enqueue(encoder.encode(stream.firstText))

      void (async () => {
        try {
          while (true) {
            const next = await stream.iterator.next()
            if (next.done) break
            const chunkText = next.value.text ?? ''
            if (chunkText) controller.enqueue(encoder.encode(chunkText))
          }
          controller.close()
        } catch (error) {
          console.error('AI Tutor stream failed after output began:', getGeminiErrorInfo(error))
          controller.error(error)
        }
      })()
    },
    cancel() {
      void stream.iterator.return?.(undefined)
    },
  })

  return new Response(readable, {
    status: 200,
    headers: {
      'Cache-Control': 'no-cache, no-transform',
      'Content-Type': 'text/plain; charset=utf-8',
      'X-Accel-Buffering': 'no',
    },
  })
}

async function getAuthenticatedUser(): Promise<{
  user: User | null
  configurationError?: boolean
  authenticationError?: boolean
}> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return { user: null, configurationError: true }

  const cookieStore = cookies()
  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options)
          })
        } catch {
          // The response can still authenticate from the current request cookies.
        }
      },
    },
  })

  const { data, error } = await supabase.auth.getUser()
  if (error) {
    console.error('AI Tutor authentication check failed:', error.message)
    return { user: null, authenticationError: true }
  }

  return { user: data.user, authenticationError: false }
}

export async function POST(request: Request) {
  const contentLength = Number(request.headers.get('content-length') ?? 0)
  if (contentLength > MAX_BODY_LENGTH) {
    return NextResponse.json(
      { error: 'That request is too large. Please send a shorter message.' },
      { status: 413 }
    )
  }

  let body: AiTutorRequest
  try {
    const rawBody = await request.text()
    if (rawBody.length > MAX_BODY_LENGTH) {
      return NextResponse.json(
        { error: 'That request is too large. Please send a shorter message.' },
        { status: 413 }
      )
    }
    body = parseRequestBody(JSON.parse(rawBody))
  } catch (error) {
    if (error instanceof RequestValidationError || error instanceof SyntaxError) {
      return NextResponse.json(
        { error: error.message || 'The request could not be understood.' },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'The request could not be understood.' },
      { status: 400 }
    )
  }

  let auth: Awaited<ReturnType<typeof getAuthenticatedUser>>
  try {
    auth = await getAuthenticatedUser()
  } catch (error) {
    console.error('AI Tutor authentication service failed:', error)
    auth = { user: null, authenticationError: true }
  }

  if (auth.configurationError) {
    return NextResponse.json(
      { error: 'Authentication is not configured yet.' },
      { status: 503 }
    )
  }

  if (auth.authenticationError || !auth.user) {
    return NextResponse.json(
      { error: 'Please sign in to use the AI Tutor.' },
      { status: 401 }
    )
  }

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    console.error('AI Tutor is missing GEMINI_API_KEY', {
      exists: false,
      length: 0,
      model: PRIMARY_MODEL,
    })
    return NextResponse.json(
      { error: 'The AI Tutor is not configured yet.' },
      { status: 500 }
    )
  }

  try {
    const ai = new GoogleGenAI({ apiKey })
    const contents = body.messages.map(message => ({
      role: message.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: message.content }],
    })) as GeminiContent[]
    const systemInstruction = getTutorSystemInstruction(body.language ?? 'EN', body.courseContext)
    let response: Awaited<ReturnType<typeof generateWithModel>> | undefined
    let lastTransientError: unknown
    const models = [PRIMARY_MODEL, FALLBACK_MODEL]

    for (let index = 0; index < models.length; index += 1) {
      const model = models[index]
      if (index > 0) {
        console.log(`AI Tutor: falling back to ${model}`)
      }

      try {
        response = await generateWithModel({
          ai,
          model,
          contents,
          systemInstruction,
          maxRetries: index === 0 ? MAX_PRIMARY_RETRIES : 0,
        })
        break
      } catch (error) {
        const errorInfo = getGeminiErrorInfo(error)
        if (!isTransientAvailabilityError(errorInfo)) {
          throw error
        }
        lastTransientError = error
      }
    }

    if (!response) {
      throw lastTransientError instanceof Error
        ? lastTransientError
        : new Error('All configured Gemini models are unavailable')
    }

    return createTutorStreamResponse(response)
  } catch (error) {
    const errorInfo = getGeminiErrorInfo(error)
    console.error('AI Tutor generation failed:', errorInfo)

    if (isRateLimitError(errorInfo)) {
      return NextResponse.json(
        { error: 'The AI Tutor is busy right now. Please try again in a moment.' },
        { status: 429 }
      )
    }

    if (isAuthenticationError(errorInfo)) {
      return NextResponse.json(
        { error: 'The AI Tutor service could not authenticate. Please check the server Gemini API key.' },
        { status: 502 }
      )
    }

    if (isModelUnavailableError(errorInfo)) {
      return NextResponse.json(
        { error: 'The configured AI Tutor model is unavailable. Please check GEMINI_MODEL.' },
        { status: 502 }
      )
    }

    if (isInvalidGeminiRequest(errorInfo)) {
      return NextResponse.json(
        { error: 'The AI Tutor request was rejected. Please try a shorter question.' },
        { status: 400 }
      )
    }

    if (isNetworkError(errorInfo)) {
      return NextResponse.json(
        { error: 'The AI Tutor service is temporarily unreachable. Please try again in a moment.' },
        { status: 502 }
      )
    }

    if (error instanceof EmptyGeminiResponseError) {
      return NextResponse.json(
        { error: 'The AI Tutor returned an empty response. Please try again.' },
        { status: 502 }
      )
    }

    if (errorInfo.status !== undefined && errorInfo.status >= 500) {
      return NextResponse.json(
        { error: 'The AI Tutor service is temporarily unavailable. Please try again in a moment.' },
        { status: 502 }
      )
    }

    return NextResponse.json(
      { error: 'I could not connect to the AI Tutor right now. Please try again in a moment.' },
      { status: 500 }
    )
  }
}
