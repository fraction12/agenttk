export { createTool } from './core/create-tool.js'
export { runToolCli } from './core/run-tool-cli.js'
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
  CommandRisk,
  CommandRiskLevel,
  CommandSuccess,
  ConfirmationPolicy,
  HelpRecord,
  MutationSafetyMetadata,
  RecoveryAction,
  RecoveryClassification,
  RecoveryMetadata,
  RecordFormatter,
  RecordPresentationField,
  ReplayRisk,
  RetrySafety,
  ToolPresentation,
  VerificationStatus,
  ToolDefinition,
  ToolHelpRecord,
  ToolIO,
  ToolRuntime
} from './core/types.js'

export { renderResult } from './blocks/output.js'
export { firstPositional, hasFlag } from './blocks/args.js'
export type { RawArgFlag } from './blocks/args.js'
export {
  confirmationRequiredResult,
  invalidInput,
  lockedOrBusy,
  operationalFailure,
  unverifiedMutation,
  verifiedMutation
} from './blocks/results.js'
export type {
  CommonFailureOptions,
  MutationResultInput,
  UnverifiedMutationOptions,
  VerifiedMutationOptions
} from './blocks/results.js'
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
export {
  confirmationRequired,
  defineRisk,
  requireConfirmation
} from './blocks/risk.js'
export type { RiskFailureDetails } from './blocks/risk.js'
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
export {
  agentSafeCliChecklist,
  getAgentSafeCliChecklist
} from './testing/checklist.js'
export type {
  AgentSafeChecklistArea,
  AgentSafeChecklistItem
} from './testing/checklist.js'
export { fakeAdapter } from './testing/fake-adapter.js'
