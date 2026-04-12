import type { AuthCheckFailure } from '../blocks/auth.js'
import type { CandidateSummary } from '../blocks/lookup.js'

export function authFailureFixture(overrides: Partial<AuthCheckFailure> = {}): AuthCheckFailure {
  return {
    ok: false,
    code: 'AUTH_REQUIRED',
    provider: 'google',
    nextStep: 'Run demo auth login',
    ...overrides
  }
}

export function lookupCandidatesFixture(candidates?: CandidateSummary[]): CandidateSummary[] {
  if (candidates) return candidates
  return [
    { id: 'task-1', label: 'Invoice follow-up', description: 'Daily Focus' },
    { id: 'task-2', label: 'Invoice draft', description: 'Backlog' }
  ]
}
