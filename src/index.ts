export { createTool } from './core/create-tool.js'
export { defineCommand } from './core/define-command.js'
export { ok, fail, isFailure } from './core/result.js'
export type {
  CommandContext,
  CommandDefinition,
  CommandFailure,
  CommandHandler,
  CommandHelpRecord,
  CommandInvocation,
  CommandResult,
  CommandSuccess,
  HelpRecord,
  ToolDefinition,
  ToolHelpRecord,
  ToolIO,
  ToolRuntime
} from './core/types.js'

export { renderResult } from './blocks/output.js'
export {
  adapterFailure,
  defineAdapter,
  requireCapability,
  supportsCapability,
  unsupportedCapability
} from './blocks/adapter.js'
export type {
  AdapterCapability,
  AdapterContract,
  AdapterFailureCategory,
  AdapterFailureDetails,
  AdapterFailureOptions
} from './blocks/adapter.js'
export {
  accountMismatch,
  authInvalid,
  authRequired,
  requireAuth
} from './blocks/auth.js'
export type {
  AuthCheck,
  AuthCheckFailure,
  AuthCheckResult,
  AuthCheckSuccess,
  AuthFailureDetails
} from './blocks/auth.js'
export {
  ambiguousMatch,
  notFound,
  resolveById,
  resolveByQuery,
  resolveOne
} from './blocks/lookup.js'
export type {
  CandidateSummary,
  ResolutionFailure,
  ResolutionInput,
  ResolutionResult,
  ResolutionSuccess
} from './blocks/lookup.js'
export {
  expectedPayloadShape,
  nextStepGuidance,
  validateInput,
  validationError
} from './blocks/validation.js'
export { asDryRun } from './blocks/dry-run.js'

export * from './errors/index.js'

export { runTool } from './testing/run-cli.js'
export { expectFailure, expectOk } from './testing/assertions.js'
export { fakeAdapter } from './testing/fake-adapter.js'
