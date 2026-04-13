export { createTool } from './core/create-tool.js'
export { withMutationSafety, markPartial, markUnverified, markVerified } from './core/mutation-safety.js'
export { withRecovery } from './core/recovery.js'
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
  MutationSafetyMetadata,
  RecoveryAction,
  RecoveryClassification,
  RecoveryMetadata,
  ReplayRisk,
  RetrySafety,
  VerificationStatus,
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
export {
  defineProfile,
  loadConfig,
  malformedConfig,
  missingConfig,
  selectProfile,
  validateConfig
} from './blocks/config.js'
export type {
  ConfigDiagnosticDetails,
  ConfigFailureOptions,
  ConfigLoadInput,
  ConfigLoadOptions,
  ConfigProfile,
  ConfigSource
} from './blocks/config.js'
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
export {
  expectAdapterFailure,
  expectAuthFailure,
  expectConfigFailure,
  expectDryRun,
  expectFailure,
  expectLookupFailure,
  expectMutationSafety,
  expectOk,
  expectRecovery
} from './testing/assertions.js'
export { authFailureFixture, lookupCandidatesFixture } from './testing/fixtures.js'
export { fakeAdapter } from './testing/fake-adapter.js'
