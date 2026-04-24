import { renderResult } from '../blocks/output.js'
import { ok } from './result.js'
import type {
  CommandContext,
  CommandDefinition,
  CommandHelpRecord,
  ToolDefinition,
  ToolHelpRecord,
  ToolIO,
  ToolRuntime
} from './types.js'

function isToolHelpRequest(value?: string) {
  return value === 'help' || value === '--help' || value === '-h'
}

function isCommandHelpFlag(value?: string) {
  return value === '--help' || value === '-h'
}

function findCommand(commands: CommandDefinition[], name?: string) {
  if (!name) return undefined
  return commands.find((command) => command.name === name || command.aliases?.includes(name))
}

function createContext(definition: ToolDefinition, json: boolean, io?: ToolIO): CommandContext {
  return {
    toolName: definition.name,
    json,
    stdout: io?.stdout ?? process.stdout,
    stderr: io?.stderr ?? process.stderr,
    presentation: definition.presentation
  }
}

function toolHelpResult(definition: ToolDefinition) {
  const record: ToolHelpRecord = {
    kind: 'tool',
    name: definition.name,
    description: definition.description,
    commands: definition.commands.map((command) => ({
      name: command.name,
      description: command.description,
      aliases: command.aliases,
      risk: command.risk
    }))
  }

  return ok({ type: 'help', record })
}

function commandHelpResult(definition: ToolDefinition, command: CommandDefinition) {
  const record: CommandHelpRecord = {
    kind: 'command',
    toolName: definition.name,
    name: command.name,
    description: command.description,
    aliases: command.aliases,
    usage: command.usage,
    examples: command.examples,
    risk: command.risk
  }

  return ok({ type: 'help', record })
}

export function createTool(definition: ToolDefinition): ToolRuntime {
  return {
    ...definition,
    async run(argv: string[], io?: ToolIO) {
      const json = argv.includes('--json')
      const filteredArgs = argv.filter((arg) => arg !== '--json')
      const [commandName, ...rawArgs] = filteredArgs
      const ctx = createContext(definition, json, io)

      if (!commandName || isToolHelpRequest(commandName)) {
        const result = toolHelpResult(definition)
        renderResult(result, ctx)
        return result
      }

      const command = findCommand(definition.commands, commandName)

      if (!command) {
        const result = toolHelpResult(definition)
        renderResult(result, ctx)
        return result
      }

      if (rawArgs.some((arg) => isCommandHelpFlag(arg))) {
        const result = commandHelpResult(definition, command)
        renderResult(result, ctx)
        return result
      }

      const result = await command.handler({ input: undefined, rawArgs, ctx })
      renderResult(result, ctx)
      return result
    }
  }
}
