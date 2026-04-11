import type { CommandDefinition } from './types.js'

export function defineCommand<TInput = unknown, TRecord = unknown>(command: CommandDefinition<TInput, TRecord>): CommandDefinition<TInput, TRecord> {
  return command
}
