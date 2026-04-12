export const ErrorCodes = {
  Validation: 'VALIDATION_ERROR',
  UnknownCommand: 'UNKNOWN_COMMAND',
  AuthRequired: 'AUTH_REQUIRED',
  AuthInvalid: 'AUTH_INVALID',
  AccountMismatch: 'ACCOUNT_MISMATCH',
  NotFound: 'NOT_FOUND',
  AmbiguousMatch: 'AMBIGUOUS_MATCH',
  AdapterError: 'ADAPTER_ERROR',
  UnsupportedCapability: 'UNSUPPORTED_CAPABILITY',
  ConfigError: 'CONFIG_ERROR'
} as const

export type ErrorCode = (typeof ErrorCodes)[keyof typeof ErrorCodes]
