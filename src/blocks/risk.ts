import { withRecovery } from '../core/recovery.js'
import { fail } from '../core/result.js'
import { ErrorCodes } from '../errors/codes.js'
import type { CommandFailure, CommandRisk } from '../core/types.js'

export type RiskFailureDetails = {
  kind: 'risk'
  level: CommandRisk['level']
  confirmation: NonNullable<CommandRisk['confirmation']>
  reason?: string
  nextStep?: string
}

export function defineRisk<T extends CommandRisk>(risk: T): T {
  return risk
}

export function confirmationRequired(
  risk: CommandRisk,
  options?: {
    message?: string
    nextStep?: string
  }
): CommandFailure {
  const confirmation = risk.confirmation ?? 'required'
  return withRecovery(
    fail({
      error: {
        code: ErrorCodes.ConfirmationRequired,
        message: options?.message ?? 'Confirmation required before running this command',
        details: {
          kind: 'risk',
          level: risk.level,
          confirmation,
          reason: risk.reason,
          nextStep: options?.nextStep
        } satisfies RiskFailureDetails
      }
    }),
    {
      nextAction: 'confirm',
      classification: 'user_action_required',
      retryable: false
    }
  )
}

export function requireConfirmation(
  confirmed: boolean,
  risk: CommandRisk,
  options?: {
    message?: string
    nextStep?: string
  }
): true | CommandFailure {
  const confirmation = risk.confirmation ?? 'recommended'
  if (confirmation === 'none' || confirmed) return true
  return confirmationRequired(risk, options)
}
