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
