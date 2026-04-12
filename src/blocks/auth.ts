import { fail } from '../core/result.js'
import { ErrorCodes } from '../errors/codes.js'
import type { CommandFailure } from '../core/types.js'

export type AuthFailureDetails = {
  kind: 'auth'
  provider?: string
  currentAccount?: string
  expectedAccount?: string
  nextStep?: string
}

export type AuthCheckSuccess = {
  ok: true
  provider?: string
  account?: string
}

export type AuthCheckFailure = {
  ok: false
  code?: typeof ErrorCodes.AuthRequired | typeof ErrorCodes.AuthInvalid | typeof ErrorCodes.AccountMismatch
  message?: string
  provider?: string
  currentAccount?: string
  expectedAccount?: string
  nextStep?: string
}

export type AuthCheckResult = AuthCheckSuccess | AuthCheckFailure
export type AuthCheck = () => Promise<AuthCheckResult> | AuthCheckResult

type AuthFailureOptions = Omit<AuthFailureDetails, 'kind'>

function authFailure(code: AuthCheckFailure['code'], message: string, options?: AuthFailureOptions): CommandFailure {
  return fail({
    error: {
      code: code ?? ErrorCodes.AuthRequired,
      message,
      details: {
        kind: 'auth',
        provider: options?.provider,
        currentAccount: options?.currentAccount,
        expectedAccount: options?.expectedAccount,
        nextStep: options?.nextStep
      }
    }
  })
}

export function authRequired(message = 'Authentication required', options?: AuthFailureOptions): CommandFailure {
  return authFailure(ErrorCodes.AuthRequired, message, options)
}

export function authInvalid(message = 'Authentication is invalid', options?: AuthFailureOptions): CommandFailure {
  return authFailure(ErrorCodes.AuthInvalid, message, options)
}

export function accountMismatch(
  expectedAccount: string,
  currentAccount?: string,
  message = 'Authenticated account does not match the expected account',
  options?: Omit<AuthFailureOptions, 'expectedAccount' | 'currentAccount'>
): CommandFailure {
  return authFailure(ErrorCodes.AccountMismatch, message, {
    ...options,
    expectedAccount,
    currentAccount
  })
}

export async function requireAuth(check: AuthCheck | AuthCheckResult): Promise<true | CommandFailure> {
  const result = typeof check === 'function' ? await check() : check
  if (result.ok) return true

  const message = result.message
  switch (result.code) {
    case ErrorCodes.AuthInvalid:
      return authInvalid(message ?? 'Authentication is invalid', result)
    case ErrorCodes.AccountMismatch:
      return accountMismatch(
        result.expectedAccount ?? 'unknown',
        result.currentAccount,
        message ?? 'Authenticated account does not match the expected account',
        result
      )
    case ErrorCodes.AuthRequired:
    default:
      return authRequired(message ?? 'Authentication required', result)
  }
}
