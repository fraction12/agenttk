import { withRecovery } from '../core/recovery.js'
import { fail } from '../core/result.js'
import { ErrorCodes } from './codes.js'

export function authRequiredError(message = 'Authentication required. Run the relevant auth flow and try again.') {
  return withRecovery(
    fail({
      error: {
        code: ErrorCodes.AuthRequired,
        message
      }
    }),
    {
      nextAction: 'reauth',
      classification: 'user_action_required',
      retryable: false
    }
  )
}

export function notFoundError(message: string) {
  return withRecovery(
    fail({
      error: {
        code: ErrorCodes.NotFound,
        message
      }
    }),
    {
      nextAction: 'clarify',
      classification: 'user_action_required',
      retryable: false
    }
  )
}

export function ambiguousMatchError(message: string) {
  return withRecovery(
    fail({
      error: {
        code: ErrorCodes.AmbiguousMatch,
        message
      }
    }),
    {
      nextAction: 'choose_candidate',
      classification: 'user_action_required',
      retryable: false
    }
  )
}
