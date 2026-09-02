// ─────────────────────────────────────────────────────────────────────────────
// SankalpQ — AI Insights Service (Instructor Portal)
// Rule-based insight engine. Architecture is LLM-ready for future integration.
// To upgrade: swap the generateInsights() body with an LLM API call.
// ─────────────────────────────────────────────────────────────────────────────

import type { AIInsight } from '../types'
import { MOCK_AI_INSIGHTS } from '../mock-data'

/**
 * Returns AI-powered instructor insights.
 *
 * Currently: rule-based analysis of aggregated analytics.
 * Future: replace body with LLM API call (Gemini / GPT-4 / Claude).
 *
 * The function signature and return type remain stable across versions.
 */
export async function getInstructorInsights(): Promise<AIInsight[]> {
  // TODO: Pass analytics to LLM when backend is integrated.
  // For now, return pre-computed rule-based insights.
  return Promise.resolve(
    [...MOCK_AI_INSIGHTS].sort((a, b) => {
      const priorityRank: Record<string, number> = { high: 0, medium: 1, low: 2 }
      return (priorityRank[a.priority] ?? 3) - (priorityRank[b.priority] ?? 3)
    })
  )
}

/**
 * Placeholder for future LLM integration.
 * When ready, connect to Gemini API / OpenAI / Claude here.
 */
export async function generateLLMInsight(): Promise<string> {
  // Future implementation:
  // const response = await fetch('/api/ai/insights', { method: 'POST', body: JSON.stringify({ prompt }) })
  // return response.json().then(d => d.insight)
  throw new Error('LLM integration not yet configured. Set NEXT_PUBLIC_AI_ENABLED=true and configure API key.')
}
