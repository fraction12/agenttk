import type { CommandFailure, CommandResult, CommandSuccess, RecoveryMetadata } from './types.js'

export type { RecoveryAction, RecoveryClassification, RecoveryMetadata } from './types.js'

export function withRecovery<TRecord = unknown>(
  result: CommandSuccess<TRecord>,
  recovery: RecoveryMetadata
): CommandSuccess<TRecord>
export function withRecovery(result: CommandFailure, recovery: RecoveryMetadata): CommandFailure
export function withRecovery<TRecord = unknown>(
  result: CommandResult<TRecord>,
  recovery: RecoveryMetadata
): CommandResult<TRecord> {
  return {
    ...result,
    ...recovery
  }
}
