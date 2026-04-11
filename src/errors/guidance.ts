import { fail } from '../core/result.js'
import { ErrorCodes } from './codes.js'

export function authRequiredError(message = 'Authentication required. Run the relevant auth flow and try again.') {
  return fail({
    error: {
      code: ErrorCodes.AuthRequired,
      message
    }
  })
}

export function notFoundError(message: string) {
  return fail({
    error: {
      code: ErrorCodes.NotFound,
      message
    }
  })
}

export function ambiguousMatchError(message: string) {
  return fail({
    error: {
      code: ErrorCodes.AmbiguousMatch,
      message
    }
  })
}
