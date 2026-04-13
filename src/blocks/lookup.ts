import { withRecovery } from '../core/recovery.js'
import { fail } from '../core/result.js'
import { ErrorCodes } from '../errors/codes.js'
import type { CommandFailure, RecoveryMetadata } from '../core/types.js'

export type CandidateSummary = {
  id: string
  label: string
  description?: string
}

export type ResolutionInput = {
  id?: string
  query?: string
}

export type ResolutionSuccess<TCandidate extends CandidateSummary = CandidateSummary> = {
  ok: true
  candidate: TCandidate
  strategy: 'id' | 'query'
}

export type ResolutionFailure = CommandFailure
export type ResolutionResult<TCandidate extends CandidateSummary = CandidateSummary> =
  | ResolutionSuccess<TCandidate>
  | ResolutionFailure

type LookupFailureOptions = RecoveryMetadata & {
  nextStep?: string
  query?: string
  candidates?: CandidateSummary[]
}

function compactCandidates(candidates: CandidateSummary[]): CandidateSummary[] {
  return candidates.map((candidate) => ({
    id: candidate.id,
    label: candidate.label,
    description: candidate.description
  }))
}

export function resolveById<TCandidate extends CandidateSummary>(candidate: TCandidate): ResolutionSuccess<TCandidate> {
  return {
    ok: true,
    candidate,
    strategy: 'id'
  }
}

export function resolveByQuery<TCandidate extends CandidateSummary>(candidate: TCandidate): ResolutionSuccess<TCandidate> {
  return {
    ok: true,
    candidate,
    strategy: 'query'
  }
}

export function notFound(message = 'No matching record found', options?: LookupFailureOptions): ResolutionFailure {
  return withRecovery(
    fail({
      error: {
        code: ErrorCodes.NotFound,
        message,
        details: {
          kind: 'lookup',
          query: options?.query,
          nextStep: options?.nextStep
        }
      }
    }),
    {
      nextAction: options?.nextAction ?? 'clarify',
      classification: options?.classification ?? 'user_action_required',
      retryable: options?.retryable ?? false
    }
  )
}

export function ambiguousMatch(
  candidates: CandidateSummary[],
  message = 'Multiple matching records found',
  options?: Omit<LookupFailureOptions, 'candidates'>
): ResolutionFailure {
  return withRecovery(
    fail({
      error: {
        code: ErrorCodes.AmbiguousMatch,
        message,
        details: {
          kind: 'lookup',
          query: options?.query,
          nextStep: options?.nextStep,
          candidates: compactCandidates(candidates)
        }
      }
    }),
    {
      nextAction: options?.nextAction ?? 'choose_candidate',
      classification: options?.classification ?? 'user_action_required',
      retryable: options?.retryable ?? false
    }
  )
}

export function resolveOne<TCandidate extends CandidateSummary>(
  input: ResolutionInput,
  candidates: TCandidate[],
  options?: {
    notFoundMessage?: string
    ambiguousMessage?: string
    nextStep?: string
  }
): ResolutionResult<TCandidate> {
  if (input.id) {
    const match = candidates.find((candidate) => candidate.id === input.id)
    return match
      ? resolveById(match)
      : notFound(options?.notFoundMessage ?? `No record found for id: ${input.id}`, {
          query: input.id,
          nextStep: options?.nextStep
        })
  }

  if (candidates.length === 1) {
    return resolveByQuery(candidates[0])
  }

  if (candidates.length === 0) {
    return notFound(options?.notFoundMessage, {
      query: input.query,
      nextStep: options?.nextStep
    })
  }

  return ambiguousMatch(candidates, options?.ambiguousMessage, {
    query: input.query,
    nextStep: options?.nextStep
  })
}
