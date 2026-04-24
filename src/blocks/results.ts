import { fail } from '../core/result.js'
import type {
  CommandFailure,
  CommandSuccess,
  MutationSafetyMetadata,
  RecoveryMetadata,
  VerificationStatus
} from '../core/types.js'
import { ErrorCodes } from '../errors/codes.js'

export type CommonFailureOptions = RecoveryMetadata & {
  code?: string
  details?: Record<string, unknown>
  type?: string
}

function commonFailure(
  code: string,
  message: string,
  defaults: Required<RecoveryMetadata>,
  options?: CommonFailureOptions
): CommandFailure {
  return fail({
    type: options?.type,
    error: {
      code: options?.code ?? code,
      message,
      details: options?.details
    },
    nextAction: options?.nextAction ?? defaults.nextAction,
    classification: options?.classification ?? defaults.classification,
    retryable: options?.retryable ?? defaults.retryable
  })
}

export function invalidInput(message = 'Invalid input', options?: CommonFailureOptions): CommandFailure {
  return commonFailure(ErrorCodes.InvalidInput, message, {
    nextAction: 'fix_input',
    classification: 'user_action_required',
    retryable: false
  }, options)
}

export function operationalFailure(message = 'Operation failed', options?: CommonFailureOptions): CommandFailure {
  return commonFailure(ErrorCodes.OperationFailed, message, {
    nextAction: 'abort',
    classification: 'unknown',
    retryable: false
  }, options)
}

export function lockedOrBusy(message = 'Resource is locked or busy', options?: CommonFailureOptions): CommandFailure {
  return commonFailure(ErrorCodes.LockedOrBusy, message, {
    nextAction: 'retry',
    classification: 'transient',
    retryable: true
  }, options)
}

export function confirmationRequiredResult(
  message = 'Confirmation required before running this command',
  options?: CommonFailureOptions
): CommandFailure {
  return commonFailure(ErrorCodes.ConfirmationRequired, message, {
    nextAction: 'confirm',
    classification: 'user_action_required',
    retryable: false
  }, options)
}

export type MutationResultInput<TRecord = unknown> = Omit<
  CommandSuccess<TRecord>,
  'ok' | 'verified' | 'verificationStatus'
>

export type UnverifiedMutationOptions = Omit<
  MutationSafetyMetadata,
  'verified' | 'verificationStatus'
> & RecoveryMetadata & {
  status?: Exclude<VerificationStatus, 'verified'>
}

export function unverifiedMutation<TRecord = unknown>(
  result: MutationResultInput<TRecord>,
  options?: UnverifiedMutationOptions
): CommandSuccess<TRecord> {
  const { status, ...metadata } = options ?? {}
  return {
    ok: true,
    ...result,
    ...metadata,
    verified: false,
    verificationStatus: status ?? 'unverified',
    nextAction: options?.nextAction ?? result.nextAction ?? 'verify_state'
  }
}

export type VerifiedMutationOptions = Omit<
  MutationSafetyMetadata,
  'verified' | 'verificationStatus'
> & RecoveryMetadata

export function verifiedMutation<TRecord = unknown>(
  result: MutationResultInput<TRecord>,
  options?: VerifiedMutationOptions
): CommandSuccess<TRecord> {
  return {
    ok: true,
    ...result,
    ...options,
    verified: true,
    verificationStatus: 'verified'
  }
}
