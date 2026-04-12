export type CommandHelpRecord = {
  kind: 'command'
  toolName: string
  name: string
  description?: string
  aliases?: string[]
  usage?: string
  examples?: string[]
}

export type ToolHelpRecord = {
  kind: 'tool'
  name: string
  description?: string
  commands: Array<{
    name: string
    description?: string
    aliases?: string[]
  }>
}

export type HelpRecord = ToolHelpRecord | CommandHelpRecord

export type CommandSuccess<TRecord = unknown> = {
  ok: true
  type: string
  destination?: string
  id?: string
  record?: TRecord
  warnings?: string[]
  dryRun?: boolean
}

export type CommandFailure = {
  ok: false
  type?: string
  error: {
    code: string
    message: string
    details?: Record<string, unknown>
  }
}

export type CommandResult<TRecord = unknown> = CommandSuccess<TRecord> | CommandFailure

export type CommandContext = {
  toolName: string
  json: boolean
  stdout: NodeJS.WritableStream
  stderr: NodeJS.WritableStream
}

export type ToolIO = Partial<Pick<CommandContext, 'stdout' | 'stderr'>>

export type CommandInvocation<TInput = unknown> = {
  input: TInput
  rawArgs: string[]
  ctx: CommandContext
}

export type CommandHandler<TInput = unknown, TRecord = unknown> = (
  args: CommandInvocation<TInput>
) => Promise<CommandResult<TRecord>> | CommandResult<TRecord>

export type CommandDefinition<TInput = unknown, TRecord = unknown> = {
  name: string
  description?: string
  aliases?: string[]
  usage?: string
  examples?: string[]
  handler: CommandHandler<TInput, TRecord>
}

export type ToolDefinition = {
  name: string
  description?: string
  commands: CommandDefinition[]
}

export type ToolRuntime = ToolDefinition & {
  run(argv: string[], io?: ToolIO): Promise<CommandResult>
}
