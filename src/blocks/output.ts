import type { CommandContext, CommandResult } from '../core/types.js'

function renderHuman(result: CommandResult): string {
  if (!result.ok) {
    return `Error [${result.error.code}]: ${result.error.message}`
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
