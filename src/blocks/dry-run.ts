import { ok } from '../core/result.js'
import type { CommandResult } from '../core/types.js'

export function asDryRun<TRecord = unknown>(result: CommandResult<TRecord>): CommandResult<TRecord> {
  if (!result.ok) return result
  return ok({ ...result, dryRun: true })
}
