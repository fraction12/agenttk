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
