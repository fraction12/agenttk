import assert from 'node:assert/strict'
import type { CommandFailure, CommandResult, CommandSuccess } from '../core/types.js'

export function expectOk<TRecord = unknown>(result: CommandResult<TRecord>): CommandSuccess<TRecord> {
  assert.equal(result.ok, true)
  return result as CommandSuccess<TRecord>
}

export function expectFailure(result: CommandResult, code?: string): CommandFailure {
  assert.equal(result.ok, false)
  const failure = result as CommandFailure
  if (code) {
    assert.equal(failure.error.code, code)
  }
  return failure
}

export function expectDryRun<TRecord = unknown>(result: CommandResult<TRecord>): CommandSuccess<TRecord> {
  const success = expectOk(result)
  assert.equal(success.dryRun, true)
  return success
}

export function expectAuthFailure(
  result: CommandResult,
  options?: {
    code?: 'AUTH_REQUIRED' | 'AUTH_INVALID' | 'ACCOUNT_MISMATCH'
    provider?: string
    currentAccount?: string
    expectedAccount?: string
  }
): CommandFailure {
  const failure = expectFailure(result, options?.code)
  if (options?.provider !== undefined) {
    assert.equal(failure.error.details?.provider, options.provider)
  }
  if (options?.currentAccount !== undefined) {
    assert.equal(failure.error.details?.currentAccount, options.currentAccount)
  }
  if (options?.expectedAccount !== undefined) {
    assert.equal(failure.error.details?.expectedAccount, options.expectedAccount)
  }
  return failure
}

export function expectLookupFailure(
  result: CommandResult,
  options?: {
    code?: 'NOT_FOUND' | 'AMBIGUOUS_MATCH'
    query?: string
    candidateCount?: number
  }
): CommandFailure {
  const failure = expectFailure(result, options?.code)
  if (options?.query !== undefined) {
    assert.equal(failure.error.details?.query, options.query)
  }
  if (options?.candidateCount !== undefined) {
    const candidates = Array.isArray(failure.error.details?.candidates) ? failure.error.details?.candidates : []
    assert.equal(candidates.length, options.candidateCount)
  }
  return failure
}

export function expectAdapterFailure(
  result: CommandResult,
  options?: {
    code?: 'ADAPTER_ERROR' | 'UNSUPPORTED_CAPABILITY'
    provider?: string
    category?: string
    retryable?: boolean
    capability?: string
  }
): CommandFailure {
  const failure = expectFailure(result, options?.code)
  if (options?.provider !== undefined) {
    assert.equal(failure.error.details?.provider, options.provider)
  }
  if (options?.category !== undefined) {
    assert.equal(failure.error.details?.category, options.category)
  }
  if (options?.retryable !== undefined) {
    assert.equal(failure.error.details?.retryable, options.retryable)
  }
  if (options?.capability !== undefined) {
    assert.equal(failure.error.details?.capability, options.capability)
  }
  return failure
}

export function expectConfigFailure(
  result: CommandResult,
  options?: {
    reason?: 'missing' | 'malformed'
    source?: string
    key?: string
    profile?: string
  }
): CommandFailure {
  const failure = expectFailure(result, 'CONFIG_ERROR')
  if (options?.reason !== undefined) {
    assert.equal(failure.error.details?.reason, options.reason)
  }
  if (options?.source !== undefined) {
    assert.equal(failure.error.details?.source, options.source)
  }
  if (options?.key !== undefined) {
    assert.equal(failure.error.details?.key, options.key)
  }
  if (options?.profile !== undefined) {
    assert.equal(failure.error.details?.profile, options.profile)
  }
  return failure
}
