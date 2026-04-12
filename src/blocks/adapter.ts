import { fail } from '../core/result.js'
import { ErrorCodes } from '../errors/codes.js'
import type { CommandFailure } from '../core/types.js'

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
>

export function defineAdapter<TAdapter extends AdapterContract>(adapter: TAdapter): TAdapter {
  return adapter
}

export function adapterFailure<TCapability extends AdapterCapability = AdapterCapability>(
  message: string,
  options: AdapterFailureOptions<TCapability>
): CommandFailure {
  return fail({
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
  })
}

export function unsupportedCapability<TCapability extends AdapterCapability = AdapterCapability>(
  capability: TCapability,
  options?: Omit<AdapterFailureOptions<TCapability>, 'category' | 'retryable' | 'capability'> & {
    message?: string
  }
): CommandFailure {
  return fail({
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
  })
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
