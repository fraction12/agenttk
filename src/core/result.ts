import type { CommandFailure, CommandResult, CommandSuccess } from './types.js'

export function ok<TRecord = unknown>(result: Omit<CommandSuccess<TRecord>, 'ok'>): CommandSuccess<TRecord> {
  return { ok: true, ...result }
}

export function fail(result: Omit<CommandFailure, 'ok'>): CommandFailure {
  return { ok: false, ...result }
}

export function isFailure(result: CommandResult): result is CommandFailure {
  return result.ok === false
}
