import type { CommandContext, CommandResult, HelpRecord } from '../core/types.js'

function renderFailureDetails(result: Extract<CommandResult, { ok: false }>): string[] {
  const details = result.error.details
  if (!details || typeof details !== 'object') return []

  const lines: string[] = []
  const provider = typeof details.provider === 'string' ? details.provider : undefined
  const currentAccount = typeof details.currentAccount === 'string' ? details.currentAccount : undefined
  const expectedAccount = typeof details.expectedAccount === 'string' ? details.expectedAccount : undefined
  const nextStep = typeof details.nextStep === 'string' ? details.nextStep : undefined

  if (provider) lines.push(`Provider: ${provider}`)
  if (currentAccount) lines.push(`Current account: ${currentAccount}`)
  if (expectedAccount) lines.push(`Expected account: ${expectedAccount}`)
  if (nextStep) lines.push(`Next step: ${nextStep}`)

  return lines
}

function renderHelp(record: HelpRecord): string {
  if (record.kind === 'tool') {
    const lines = [record.name]
    if (record.description) lines.push(record.description)
    lines.push('Commands:')

    for (const command of record.commands) {
      const aliasText = command.aliases?.length ? ` (aliases: ${command.aliases.join(', ')})` : ''
      const description = command.description ? ` - ${command.description}` : ''
      lines.push(`- ${command.name}${aliasText}${description}`)
    }

    return lines.join('\n')
  }

  const lines = [`${record.toolName} ${record.name}`]
  if (record.description) lines.push(record.description)
  if (record.aliases?.length) lines.push(`Aliases: ${record.aliases.join(', ')}`)
  if (record.usage) lines.push(`Usage: ${record.usage}`)
  if (record.examples?.length) {
    lines.push('Examples:')
    for (const example of record.examples) lines.push(`- ${example}`)
  }

  return lines.join('\n')
}

function renderHuman(result: CommandResult): string {
  if (!result.ok) {
    const lines = [`Error [${result.error.code}]: ${result.error.message}`, ...renderFailureDetails(result)]
    return lines.join('\n')
  }

  if (result.type === 'help' && result.record && typeof result.record === 'object') {
    return renderHelp(result.record as HelpRecord)
  }

  const action = result.dryRun ? 'Dry run' : 'Saved'
  const lines = [`${action} ${result.type}`]
  if (result.id) lines.push(`ID: ${result.id}`)
  if (result.destination) lines.push(`Destination: ${result.destination}`)

  if (result.record && typeof result.record === 'object' && !Array.isArray(result.record)) {
    for (const [key, value] of Object.entries(result.record)) {
      if (value === undefined || value === null || value === '') continue
      if (typeof value === 'object') continue
      lines.push(`${key}: ${String(value)}`)
    }
  }

  if (result.warnings?.length) {
    lines.push('Warnings:')
    for (const warning of result.warnings) lines.push(`- ${warning}`)
  }
  return lines.join('\n')
}

export function renderResult(result: CommandResult, ctx: CommandContext) {
  if (ctx.json) {
    ctx.stdout.write(`${JSON.stringify(result, null, 2)}\n`)
    return
  }

  const stream = result.ok ? ctx.stdout : ctx.stderr
  stream.write(`${renderHuman(result)}\n`)
}
