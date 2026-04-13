import { withRecovery } from '../core/recovery.js'
import { fail } from '../core/result.js'
import { ErrorCodes } from '../errors/codes.js'
import type { CommandFailure, RecoveryClassification, RecoveryMetadata } from '../core/types.js'

export type AdapterCapability = string

export type AdapterContract<TCapability extends AdapterCapability = AdapterCapability> = {
  provider: string
  capabilities?: readonly TCapability[]
}

export type AdapterFailureCategory =
  | 'auth'
  | 'network'
  | 'rate_limit'
  | 'timeout'
  | 'validation'
  | 'conflict'
  | 'not_found'
  | 'unknown'

export type AdapterFailureDetails<TCapability extends AdapterCapability = AdapterCapability> = {
  kind: 'adapter'
  provider?: string
  operation?: string
  category: AdapterFailureCategory
  retryable: boolean
  capability?: TCapability
  causeCode?: string
  nextStep?: string
}

export type AdapterFailureOptions<TCapability extends AdapterCapability = AdapterCapability> = Omit<
  AdapterFailureDetails<TCapability>,
  'kind'
> &
  RecoveryMetadata

export function defineAdapter<TAdapter extends AdapterContract>(adapter: TAdapter): TAdapter {
  return adapter
}

function classifyAdapterFailure(
  options: AdapterFailureOptions
): Pick<RecoveryMetadata, 'nextAction' | 'classification' | 'retryable'> {
  if (options.category === 'auth') {
    return {
      nextAction: options.nextAction ?? 'reauth',
      classification: options.classification ?? 'user_action_required',
      retryable: options.retryable ?? false
    }
  }

  if (options.category === 'network' || options.category === 'rate_limit' || options.category === 'timeout') {
    return {
      nextAction: options.nextAction ?? 'retry',
      classification: options.classification ?? 'transient',
      retryable: options.retryable ?? true
    }
  }

  const classification: RecoveryClassification =
    options.classification ?? (options.retryable ? 'transient' : 'permanent')

  return {
    nextAction: options.nextAction ?? (options.retryable ? 'retry' : 'abort'),
    classification,
    retryable: options.retryable
  }
}

export function adapterFailure<TCapability extends AdapterCapability = AdapterCapability>(
  message: string,
  options: AdapterFailureOptions<TCapability>
): CommandFailure {
  return withRecovery(
    fail({
      error: {
        code: ErrorCodes.AdapterError,
        message,
        details: {
          kind: 'adapter',
          provider: options.provider,
          operation: options.operation,
          category: options.category,
          retryable: options.retryable,
          capability: options.capability,
          causeCode: options.causeCode,
          nextStep: options.nextStep
        }
      }
    }),
    classifyAdapterFailure(options)
  )
}

export function unsupportedCapability<TCapability extends AdapterCapability = AdapterCapability>(
  capability: TCapability,
  options?: Omit<AdapterFailureOptions<TCapability>, 'category' | 'retryable' | 'capability'> & {
    message?: string
  }
): CommandFailure {
  return withRecovery(
    fail({
      error: {
        code: ErrorCodes.UnsupportedCapability,
        message: options?.message ?? `Adapter does not support capability: ${capability}`,
        details: {
          kind: 'adapter',
          provider: options?.provider,
          operation: options?.operation,
          category: 'validation',
          retryable: false,
          capability,
          causeCode: options?.causeCode,
          nextStep: options?.nextStep
        }
      }
    }),
    {
      nextAction: options?.nextAction ?? 'abort',
      classification: options?.classification ?? 'permanent',
      retryable: false
    }
  )
}

export function supportsCapability<TCapability extends AdapterCapability>(
  adapter: AdapterContract<TCapability>,
  capability: TCapability
): boolean {
  return adapter.capabilities?.includes(capability) ?? false
}

export function requireCapability<TCapability extends AdapterCapability>(
  adapter: AdapterContract<TCapability>,
  capability: TCapability,
  options?: {
    message?: string
    operation?: string
    nextStep?: string
  }
): true | CommandFailure {
  if (supportsCapability(adapter, capability)) return true

  return unsupportedCapability(capability, {
    provider: adapter.provider,
    operation: options?.operation,
    nextStep: options?.nextStep,
    message: options?.message
  })
}
