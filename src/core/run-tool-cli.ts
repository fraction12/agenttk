import { createTool } from './create-tool.js'
import type { CommandResult, ToolDefinition, ToolIO, ToolRuntime } from './types.js'

export function runToolCli(
  definition: ToolDefinition | ToolRuntime,
  argv: string[] = process.argv.slice(2),
  io?: ToolIO
): Promise<CommandResult> {
  const tool = 'run' in definition ? definition : createTool(definition)
  return tool.run(argv, io)
}
