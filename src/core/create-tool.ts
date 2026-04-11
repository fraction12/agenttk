import { renderResult } from '../blocks/output.js'
import { fail } from './result.js'
import type { CommandContext, CommandDefinition, ToolDefinition, ToolIO, ToolRuntime } from './types.js'

function findCommand(commands: CommandDefinition[], name?: string) {
  if (!name) return undefined
  return commands.find((command) => command.name === name)
}

function createContext(definition: ToolDefinition, json: boolean, io?: ToolIO): CommandContext {
  return {
    toolName: definition.name,
    json,
    stdout: io?.stdout ?? process.stdout,
    stderr: io?.stderr ?? process.stderr
  }
}

function unknownCommandResult(definition: ToolDefinition, commandName?: string) {
  return fail({
    error: {
      code: 'UNKNOWN_COMMAND',
      message: commandName
        ? `Unknown command: ${commandName}`
        : `No command provided for ${definition.name}`
    }
  })
}

export function createTool(definition: ToolDefinition): ToolRuntime {
  return {
    ...definition,
    async run(argv: string[], io?: ToolIO) {
      const json = argv.includes('--json')
      const filteredArgs = argv.filter((arg) => arg !== '--json')
      const [commandName, ...rawArgs] = filteredArgs
      const command = findCommand(definition.commands, commandName)
      const ctx = createContext(definition, json, io)

      if (!command) {
        const result = unknownCommandResult(definition, commandName)
        renderResult(result, ctx)
        return result
      }

      const result = await command.handler({ input: undefined, rawArgs, ctx })
      renderResult(result, ctx)
      return result
    }
  }
}
