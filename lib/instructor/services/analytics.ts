// ─────────────────────────────────────────────────────────────────────────────
// SankalpQ — Analytics Service (Instructor Portal)
// ─────────────────────────────────────────────────────────────────────────────

import type { PlatformAnalytics } from '../types'
import { MOCK_ANALYTICS } from '../mock-data'

export async function getPlatformAnalytics(): Promise<PlatformAnalytics> {
  // TODO: Replace with real aggregation query
  return Promise.resolve(MOCK_ANALYTICS)
}
