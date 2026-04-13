import type {
  CommandResult,
  MutationSafetyMetadata,
  RecoveryAction,
  VerificationStatus
} from './types.js'

export type { MutationSafetyMetadata, ReplayRisk, RetrySafety, VerificationStatus } from './types.js'

export function withMutationSafety<TRecord = unknown>(
  result: CommandResult<TRecord>,
  metadata: MutationSafetyMetadata
): CommandResult<TRecord> {
  return {
    ...result,
    ...metadata
  }
}

export function markPartial<TRecord = unknown>(
  result: CommandResult<TRecord>,
  options?: Omit<MutationSafetyMetadata, 'partial'>
): CommandResult<TRecord> {
  return withMutationSafety(result, {
    ...options,
    partial: true
  })
}

export function markVerified<TRecord = unknown>(
  result: CommandResult<TRecord>,
  options?: Omit<MutationSafetyMetadata, 'verified' | 'verificationStatus'>
): CommandResult<TRecord> {
  return withMutationSafety(result, {
    ...options,
    verified: true,
    verificationStatus: 'verified'
  })
}

export function markUnverified<TRecord = unknown>(
  result: CommandResult<TRecord>,
  options?: Omit<MutationSafetyMetadata, 'verified' | 'verificationStatus'> & {
    status?: Exclude<VerificationStatus, 'verified'>
    nextAction?: RecoveryAction
  }
): CommandResult<TRecord> {
  const annotated = withMutationSafety(result, {
    ...options,
    verified: false,
    verificationStatus: options?.status ?? 'unverified'
  })

  return {
    ...annotated,
    nextAction: options?.nextAction ?? annotated.nextAction ?? 'verify_state'
  }
}
