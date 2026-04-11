import { ZodError, type ZodIssue, type ZodSchema } from 'zod'
import { fail } from '../core/result.js'
import { ErrorCodes } from '../errors/codes.js'
import type { CommandFailure } from '../core/types.js'

type ValidationOptions = {
  expectedPayload?: string
  nextStep?: string
  prefix?: string
}

function formatIssue(issue: ZodIssue): string {
  const path = issue.path.length ? `${issue.path.join('.')}: ` : ''
  return `${path}${issue.message}`
}

function withGuidance(message: string, options?: ValidationOptions): string {
  const parts = [options?.prefix ?? message]

  if (options?.expectedPayload) {
    parts.push(`Expected payload shape: ${options.expectedPayload}`)
  }

  if (options?.nextStep) {
    parts.push(`Next step: ${options.nextStep}`)
  }

  return parts.join(' ')
}

export function validationError(message: string, options?: ValidationOptions): CommandFailure {
  return fail({
    error: {
      code: ErrorCodes.Validation,
      message: withGuidance(message, options)
    }
  })
}

export function expectedPayloadShape(expectedPayload: string, message = 'Input is invalid') {
  return validationError(message, { expectedPayload })
}

export function nextStepGuidance(nextStep: string, message = 'Input is incomplete') {
  return validationError(message, { nextStep })
}

export function validateInput<T>(schema: ZodSchema<T>, input: unknown, options?: ValidationOptions): T | CommandFailure {
  try {
    return schema.parse(input)
  } catch (error) {
    if (error instanceof ZodError) {
      const message = error.issues.map(formatIssue).join('; ') || 'Input validation failed'
      return validationError(message, options)
    }
    return validationError('Input validation failed', options)
  }
}
