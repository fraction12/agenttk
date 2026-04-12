import { ZodError, type ZodSchema } from 'zod'
import { fail } from '../core/result.js'
import { ErrorCodes } from '../errors/codes.js'
import type { CommandFailure } from '../core/types.js'

export type ConfigSource = 'env' | 'config' | 'profile' | 'merged'

export type ConfigDiagnosticDetails = {
  kind: 'config'
  reason: 'missing' | 'malformed'
  source?: ConfigSource
  key?: string
  profile?: string
  account?: string
  expected?: string
  issues?: string[]
  nextStep?: string
}

export type ConfigFailureOptions = Omit<ConfigDiagnosticDetails, 'kind' | 'reason'>

export type ConfigProfile<TConfig extends Record<string, unknown> = Record<string, unknown>> = {
  name: string
  account?: string
  values: Partial<TConfig>
}

export type ConfigLoadInput<TConfig extends Record<string, unknown> = Record<string, unknown>> = {
  env?: Partial<TConfig>
  config?: Partial<TConfig>
  profiles?: Record<string, Partial<TConfig>>
  profile?: string
  account?: string
}

export type ConfigLoadOptions = {
  expected?: string
  nextStep?: string
}

function configFailure(
  reason: ConfigDiagnosticDetails['reason'],
  message: string,
  options?: ConfigFailureOptions
): CommandFailure {
  return fail({
    error: {
      code: ErrorCodes.ConfigError,
      message,
      details: {
        kind: 'config',
        reason,
        source: options?.source,
        key: options?.key,
        profile: options?.profile,
        account: options?.account,
        expected: options?.expected,
        issues: options?.issues,
        nextStep: options?.nextStep
      }
    }
  })
}

export function missingConfig(key: string, options?: ConfigFailureOptions): CommandFailure {
  return configFailure('missing', `Missing config: ${key}`, {
    ...options,
    key
  })
}

export function malformedConfig(message: string, options?: ConfigFailureOptions): CommandFailure {
  return configFailure('malformed', message, options)
}

export function defineProfile<TConfig extends Record<string, unknown>>(
  name: string,
  values: Partial<TConfig>,
  options?: { account?: string }
): ConfigProfile<TConfig> {
  return {
    name,
    account: options?.account,
    values
  }
}

export function selectProfile<TConfig extends Record<string, unknown>>(
  profiles: Record<string, Partial<TConfig>>,
  name: string,
  options?: Omit<ConfigFailureOptions, 'source' | 'profile'>
): Partial<TConfig> | CommandFailure {
  const profile = profiles[name]
  if (profile) return profile

  return missingConfig(`profile:${name}`, {
    source: 'profile',
    profile: name,
    account: options?.account,
    expected: options?.expected,
    nextStep: options?.nextStep
  })
}

function formatIssues(error: ZodError): string[] {
  return error.issues.map((issue) => {
    const path = issue.path.length ? `${issue.path.join('.')}: ` : ''
    return `${path}${issue.message}`
  })
}

function definedEntries<TConfig extends Record<string, unknown>>(input?: Partial<TConfig>): Partial<TConfig> {
  if (!input) return {}
  return Object.fromEntries(Object.entries(input).filter(([, value]) => value !== undefined)) as Partial<TConfig>
}

function isCommandFailure(value: unknown): value is CommandFailure {
  if (!value || typeof value !== 'object') return false
  return 'ok' in value && 'error' in value && value.ok === false
}

export function validateConfig<TConfig>(
  schema: ZodSchema<TConfig>,
  input: unknown,
  options?: ConfigFailureOptions
): TConfig | CommandFailure {
  try {
    return schema.parse(input)
  } catch (error) {
    if (error instanceof ZodError) {
      const issues = formatIssues(error)
      return malformedConfig(issues.join('; ') || 'Config is malformed', {
        ...options,
        issues
      })
    }

    return malformedConfig('Config is malformed', options)
  }
}

export function loadConfig<TConfig extends Record<string, unknown>>(
  schema: ZodSchema<TConfig>,
  input: ConfigLoadInput<TConfig>,
  options?: ConfigLoadOptions
): TConfig | CommandFailure {
  let selectedProfile: Partial<TConfig> | undefined

  if (input.profile) {
    const resolvedProfile = selectProfile(input.profiles ?? {}, input.profile, {
      account: input.account,
      expected: options?.expected,
      nextStep: options?.nextStep
    })

    if (isCommandFailure(resolvedProfile)) {
      return resolvedProfile
    }

    selectedProfile = resolvedProfile
  }

  const merged = {
    ...definedEntries(input.config),
    ...definedEntries(selectedProfile),
    ...definedEntries(input.env)
  }

  return validateConfig(schema, merged, {
    source: 'merged',
    profile: input.profile,
    account: input.account,
    expected: options?.expected,
    nextStep: options?.nextStep
  })
}
