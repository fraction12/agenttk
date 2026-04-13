import type { CommandContext, CommandResult, HelpRecord } from '../core/types.js'

function renderFailureDetails(result: Extract<CommandResult, { ok: false }>): string[] {
  const details = result.error.details
  const lines: string[] = []

  if (result.classification) lines.push(`Classification: ${result.classification}`)
  if (result.retryable !== undefined) lines.push(`Retryable: ${result.retryable ? 'yes' : 'no'}`)
  if (result.nextAction) lines.push(`Next action: ${result.nextAction}`)
  if (result.retrySafety) lines.push(`Retry safety: ${result.retrySafety}`)
  if (result.replayRisk) lines.push(`Replay risk: ${result.replayRisk}`)
  if (result.partial !== undefined) lines.push(`Partial: ${result.partial ? 'yes' : 'no'}`)
  if (result.verificationStatus) lines.push(`Verification: ${result.verificationStatus}`)
  if (result.verified !== undefined && !result.verificationStatus) lines.push(`Verified: ${result.verified ? 'yes' : 'no'}`)
  if (result.idempotencyKey) lines.push(`Idempotency key: ${result.idempotencyKey}`)

  if (!details || typeof details !== 'object') return lines

  const provider = typeof details.provider === 'string' ? details.provider : undefined
  const currentAccount = typeof details.currentAccount === 'string' ? details.currentAccount : undefined
  const expectedAccount = typeof details.expectedAccount === 'string' ? details.expectedAccount : undefined
  const nextStep = typeof details.nextStep === 'string' ? details.nextStep : undefined
  const query = typeof details.query === 'string' ? details.query : undefined
  const reason = typeof details.reason === 'string' ? details.reason : undefined
  const source = typeof details.source === 'string' ? details.source : undefined
  const key = typeof details.key === 'string' ? details.key : undefined
  const profile = typeof details.profile === 'string' ? details.profile : undefined
  const account = typeof details.account === 'string' ? details.account : undefined
  const expected = typeof details.expected === 'string' ? details.expected : undefined
  const category = typeof details.category === 'string' ? details.category : undefined
  const operation = typeof details.operation === 'string' ? details.operation : undefined
  const capability = typeof details.capability === 'string' ? details.capability : undefined
  const retryable = typeof details.retryable === 'boolean' ? details.retryable : undefined
  const causeCode = typeof details.causeCode === 'string' ? details.causeCode : undefined
  const issues = Array.isArray(details.issues) ? details.issues : undefined
  const candidates = Array.isArray(details.candidates) ? details.candidates : undefined

  if (source) lines.push(`Source: ${source}`)
  if (key) lines.push(`Key: ${key}`)
  if (profile) lines.push(`Profile: ${profile}`)
  if (account) lines.push(`Account: ${account}`)
  if (reason) lines.push(`Reason: ${reason}`)
  if (expected) lines.push(`Expected: ${expected}`)

  if (provider) lines.push(`Provider: ${provider}`)
  if (currentAccount) lines.push(`Current account: ${currentAccount}`)
  if (expectedAccount) lines.push(`Expected account: ${expectedAccount}`)
  if (operation) lines.push(`Operation: ${operation}`)
  if (category) lines.push(`Category: ${category}`)
  if (capability) lines.push(`Capability: ${capability}`)
  if (retryable !== undefined && result.retryable === undefined) lines.push(`Retryable: ${retryable ? 'yes' : 'no'}`)
  if (causeCode) lines.push(`Cause code: ${causeCode}`)
  if (query) lines.push(`Query: ${query}`)
  if (issues?.length) {
    lines.push('Issues:')
    for (const issue of issues) {
      if (typeof issue !== 'string') continue
      lines.push(`- ${issue}`)
    }
  }
  if (candidates?.length) {
    lines.push('Candidates:')
    for (const candidate of candidates) {
      if (!candidate || typeof candidate !== 'object') continue
      const id = typeof candidate.id === 'string' ? candidate.id : 'unknown'
      const label = typeof candidate.label === 'string' ? candidate.label : 'unknown'
      const description = typeof candidate.description === 'string' ? ` - ${candidate.description}` : ''
      lines.push(`- ${label} (${id})${description}`)
    }
  }
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

function renderSuccessDetails(result: Extract<CommandResult, { ok: true }>): string[] {
  const lines: string[] = []
  if (result.classification) lines.push(`Classification: ${result.classification}`)
  if (result.retryable !== undefined) lines.push(`Retryable: ${result.retryable ? 'yes' : 'no'}`)
  if (result.nextAction) lines.push(`Next action: ${result.nextAction}`)
  if (result.retrySafety) lines.push(`Retry safety: ${result.retrySafety}`)
  if (result.replayRisk) lines.push(`Replay risk: ${result.replayRisk}`)
  if (result.partial !== undefined) lines.push(`Partial: ${result.partial ? 'yes' : 'no'}`)
  if (result.verificationStatus) lines.push(`Verification: ${result.verificationStatus}`)
  if (result.verified !== undefined && !result.verificationStatus) lines.push(`Verified: ${result.verified ? 'yes' : 'no'}`)
  if (result.idempotencyKey) lines.push(`Idempotency key: ${result.idempotencyKey}`)
  return lines
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

  for (const detail of renderSuccessDetails(result)) {
    lines.push(detail)
  }

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
