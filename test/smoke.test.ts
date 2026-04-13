import test from 'node:test'
import assert from 'node:assert/strict'
import { z } from 'zod'
import {
  accountMismatch,
  adapterFailure,
  ambiguousMatch,
  asDryRun,
  authInvalid,
  authRequired,
  createTool,
  defineAdapter,
  defineCommand,
  defineProfile,
  expectAdapterFailure,
  expectAuthFailure,
  expectConfigFailure,
  expectDryRun,
  expectFailure,
  expectLookupFailure,
  expectOk,
  expectRecovery,
  fakeAdapter,
  loadConfig,
  malformedConfig,
  missingConfig,
  nextStepGuidance,
  notFound,
  ok,
  requireAuth,
  requireCapability,
  resolveById,
  resolveByQuery,
  resolveOne,
  runTool,
  selectProfile,
  supportsCapability,
  unsupportedCapability,
  validateConfig,
  validateInput,
  withRecovery,
  authFailureFixture,
  lookupCandidatesFixture
} from '../src/index.js'

test('tool runs a simple command and emits json', async () => {
  const definition = {
    name: 'demo',
    commands: [
      defineCommand({
        name: 'hello',
        handler: async () => ok({ type: 'greeting', record: { message: 'hello' } })
      })
    ]
  }

  const result = await runTool(definition, ['hello', '--json'])
  const success = expectOk(result.result)
  assert.equal(success.type, 'greeting')
  assert.match(result.stdout, /"ok": true/)
  assert.match(result.stdout, /"type": "greeting"/)
})

test('tool help renders in human mode', async () => {
  const tool = createTool({
    name: 'demo',
    description: 'Example CLI',
    commands: [
      defineCommand({
        name: 'hello',
        description: 'Say hello',
        aliases: ['hi'],
        handler: async () => ok({ type: 'greeting', record: { message: 'hello' } })
      })
    ]
  })

  const result = await runTool(tool, ['help'])
  const success = expectOk(result.result)
  assert.equal(success.type, 'help')
  assert.match(result.stdout, /^demo/m)
  assert.match(result.stdout, /Example CLI/)
  assert.match(result.stdout, /Commands:/)
  assert.match(result.stdout, /hello \(aliases: hi\) - Say hello/)
})

test('tool help renders in json mode', async () => {
  const tool = createTool({
    name: 'demo',
    description: 'Example CLI',
    commands: [
      defineCommand({
        name: 'hello',
        description: 'Say hello',
        handler: async () => ok({ type: 'greeting', record: { message: 'hello' } })
      })
    ]
  })

  const result = await runTool(tool, ['--help', '--json'])
  const success = expectOk(result.result)
  assert.equal(success.type, 'help')
  assert.match(result.stdout, /"kind": "tool"/)
  assert.match(result.stdout, /"name": "demo"/)
  assert.match(result.stdout, /"description": "Say hello"/)
})

test('command help renders without executing the handler', async () => {
  let called = false
  const tool = createTool({
    name: 'demo',
    commands: [
      defineCommand({
        name: 'hello',
        description: 'Say hello',
        usage: 'demo hello [name]',
        examples: ['demo hello', 'demo hello Dushyant'],
        handler: async () => {
          called = true
          return ok({ type: 'greeting', record: { message: 'hello' } })
        }
      })
    ]
  })

  const result = await runTool(tool, ['hello', '--help'])
  const success = expectOk(result.result)
  assert.equal(success.type, 'help')
  assert.equal(called, false)
  assert.match(result.stdout, /demo hello/)
  assert.match(result.stdout, /Usage: demo hello \[name\]/)
  assert.match(result.stdout, /Examples:/)
  assert.match(result.stdout, /demo hello Dushyant/)
})

test('aliases dispatch to the canonical command', async () => {
  const tool = createTool({
    name: 'demo',
    commands: [
      defineCommand({
        name: 'hello',
        aliases: ['hi'],
        handler: async ({ rawArgs }) => ok({ type: 'greeting', record: { rawArgs } })
      })
    ]
  })

  const result = await runTool(tool, ['hi', 'there', '--json'])
  const success = expectOk(result.result)
  assert.equal(success.type, 'greeting')
  assert.match(result.stdout, /"there"/)
})

test('missing command renders tool help', async () => {
  const definition = {
    name: 'demo',
    commands: [
      defineCommand({
        name: 'hello',
        handler: async () => ok({ type: 'greeting', record: { message: 'hello' } })
      })
    ]
  }

  const result = await runTool(definition, [])
  const success = expectOk(result.result)
  assert.equal(success.type, 'help')
  assert.match(result.stdout, /^demo/m)
  assert.equal(result.stderr, '')
})

test('unknown command returns UNKNOWN_COMMAND failure', async () => {
  const definition = {
    name: 'demo',
    commands: [
      defineCommand({
        name: 'hello',
        handler: async () => ok({ type: 'greeting', record: { message: 'hello' } })
      })
    ]
  }

  const result = await runTool(definition, ['goodbye'])
  const failure = expectFailure(result.result, 'UNKNOWN_COMMAND')
  assert.match(failure.error.message, /Unknown command: goodbye/)
  assert.match(result.stderr, /Unknown command: goodbye/)
})

test('handlers receive a stable execution context', async () => {
  const tool = createTool({
    name: 'demo',
    commands: [
      defineCommand({
        name: 'inspect',
        handler: async ({ ctx, rawArgs }) =>
          ok({
            type: 'context',
            record: {
              toolName: ctx.toolName,
              json: ctx.json,
              sameStdout: ctx.stdout.writable === true,
              sameStderr: ctx.stderr.writable === true,
              rawArgs
            }
          })
      })
    ]
  })

  const result = await runTool(tool, ['inspect', 'alpha', 'beta', '--json'])
  assert.match(result.stdout, /"toolName": "demo"/)
  assert.match(result.stdout, /"json": true/)
  assert.match(result.stdout, /"sameStdout": true/)
  assert.match(result.stdout, /"sameStderr": true/)
  assert.match(result.stdout, /"alpha"/)
  assert.match(result.stdout, /"beta"/)
})

test('validation returns structured VALIDATION_ERROR failures with expected payload guidance', async () => {
  const tool = createTool({
    name: 'demo',
    commands: [
      defineCommand({
        name: 'validate',
        handler: async () =>
          validateInput(
            z.object({ title: z.string().min(1), due: z.string() }),
            { due: '2026-04-11' },
            { expectedPayload: '{"title":"Send estimate","due":"2026-04-11"}' }
          )
      })
    ]
  })

  const result = await runTool(tool, ['validate', '--json'])
  const failure = expectFailure(result.result, 'VALIDATION_ERROR')
  assert.match(failure.error.message, /Expected payload shape:/)
  assert.match(result.stdout, /Expected payload shape:/)
  assert.match(result.stdout, /title:/)
})

test('validation failures can include next-step guidance', async () => {
  const result = nextStepGuidance('Run relay inbox --json to find a valid note id', 'note-id is required')
  assert.equal(result.ok, false)
  if (!result.ok) {
    assert.equal(result.error.code, 'VALIDATION_ERROR')
    assert.match(result.error.message, /Next step: Run relay inbox --json/)
  }
})

test('auth required failure preserves guidance and recovery metadata in json mode', async () => {
  const result = authRequired('Google auth required', {
    provider: 'google',
    nextStep: 'Run demo auth login'
  })

  const failure = expectFailure(result, 'AUTH_REQUIRED')
  expectRecovery(failure, {
    nextAction: 'reauth',
    classification: 'user_action_required',
    retryable: false
  })
  assert.equal(failure.error.details?.provider, 'google')
  assert.equal(failure.error.details?.nextStep, 'Run demo auth login')
})

test('auth invalid and account mismatch helpers use stable auth codes', async () => {
  const invalid = expectFailure(
    authInvalid('Stored token has expired', {
      provider: 'google',
      nextStep: 'Run demo auth login'
    }),
    'AUTH_INVALID'
  )
  assert.equal(invalid.error.details?.provider, 'google')

  const mismatch = expectFailure(
    accountMismatch('team@example.com', 'personal@example.com', 'Wrong Google account', {
      provider: 'google',
      nextStep: 'Switch accounts and try again'
    }),
    'ACCOUNT_MISMATCH'
  )
  assert.equal(mismatch.error.details?.expectedAccount, 'team@example.com')
  assert.equal(mismatch.error.details?.currentAccount, 'personal@example.com')
})

test('requireAuth short-circuits auth failures from a preflight check', async () => {
  const gated = await requireAuth(async () =>
    authFailureFixture({
      code: 'ACCOUNT_MISMATCH',
      currentAccount: 'personal@example.com',
      expectedAccount: 'team@example.com',
      nextStep: 'Reauthenticate with the team account'
    })
  )

  const failure = expectAuthFailure(gated, {
    code: 'ACCOUNT_MISMATCH',
    provider: 'google',
    expectedAccount: 'team@example.com',
    currentAccount: 'personal@example.com'
  })
  assert.equal(failure.error.details?.expectedAccount, 'team@example.com')
})

test('requireAuth returns true for a passing auth preflight', async () => {
  const result = await requireAuth({ ok: true, provider: 'google', account: 'team@example.com' })
  assert.equal(result, true)
})

test('testing fixtures provide reusable auth and lookup defaults', () => {
  const auth = authFailureFixture()
  assert.equal(auth.ok, false)
  assert.equal(auth.code, 'AUTH_REQUIRED')
  assert.equal(auth.provider, 'google')

  const candidates = lookupCandidatesFixture()
  assert.equal(candidates.length, 2)
  assert.equal(candidates[0]?.id, 'task-1')
})

test('human auth output renders provider, account context, and next step', async () => {
  const tool = createTool({
    name: 'demo',
    commands: [
      defineCommand({
        name: 'sync',
        handler: async () =>
          accountMismatch('team@example.com', 'personal@example.com', 'Wrong Google account', {
            provider: 'google',
            nextStep: 'Run demo auth login --account team@example.com'
          })
      })
    ]
  })

  const result = await runTool(tool, ['sync'])
  expectFailure(result.result, 'ACCOUNT_MISMATCH')
  assert.match(result.stderr, /Error \[ACCOUNT_MISMATCH\]: Wrong Google account/)
  assert.match(result.stderr, /Classification: user_action_required/)
  assert.match(result.stderr, /Retryable: no/)
  assert.match(result.stderr, /Next action: reauth/)
  assert.match(result.stderr, /Provider: google/)
  assert.match(result.stderr, /Current account: personal@example.com/)
  assert.match(result.stderr, /Expected account: team@example.com/)
  assert.match(result.stderr, /Next step: Run demo auth login --account team@example.com/)
})

test('lookup helpers resolve by id and query', async () => {
  const invoice = { id: 'task-1', label: 'Invoice follow-up', description: 'Daily Focus' }

  const byId = resolveById(invoice)
  assert.equal(byId.ok, true)
  if (byId.ok) {
    assert.equal(byId.strategy, 'id')
    assert.equal(byId.candidate.id, 'task-1')
  }

  const byQuery = resolveByQuery(invoice)
  assert.equal(byQuery.ok, true)
  if (byQuery.ok) {
    assert.equal(byQuery.strategy, 'query')
    assert.equal(byQuery.candidate.label, 'Invoice follow-up')
  }
})

test('resolveOne returns NOT_FOUND with guidance for misses', () => {
  const result = resolveOne({ query: 'invoice' }, [], {
    nextStep: 'Run demo list --json'
  })

  const failure = expectFailure(result, 'NOT_FOUND')
  expectRecovery(failure, {
    nextAction: 'clarify',
    classification: 'user_action_required',
    retryable: false
  })
  assert.equal(failure.error.details?.query, 'invoice')
  assert.equal(failure.error.details?.nextStep, 'Run demo list --json')
})

test('resolveOne returns AMBIGUOUS_MATCH with compact candidates', () => {
  const result = resolveOne({ query: 'invoice' }, lookupCandidatesFixture(), {
    nextStep: 'Retry with an explicit id'
  })

  const failure = expectLookupFailure(result, {
    code: 'AMBIGUOUS_MATCH',
    query: 'invoice',
    candidateCount: 2
  })
  expectRecovery(failure, {
    nextAction: 'choose_candidate',
    classification: 'user_action_required',
    retryable: false
  })
  const candidates = failure.error.details?.candidates as Array<{ id: string; label: string }>
  assert.equal(candidates[0]?.id, 'task-1')
  assert.equal(failure.error.details?.nextStep, 'Retry with an explicit id')
})

test('adapter contracts expose stable capability checks', () => {
  const adapter = defineAdapter({
    provider: 'google',
    capabilities: ['tasks.read', 'tasks.write'] as const
  })

  assert.equal(supportsCapability(adapter, 'tasks.read'), true)
  assert.equal(supportsCapability(adapter, 'tasks.write'), true)
  assert.equal(supportsCapability(adapter, 'calendar.read'), false)
})

test('requireCapability returns a structured unsupported capability failure', () => {
  const adapter = defineAdapter({
    provider: 'google',
    capabilities: ['tasks.read'] as const
  })

  const result = requireCapability(adapter, 'tasks.write', {
    operation: 'createTask',
    nextStep: 'Use an adapter with tasks.write support'
  })

  const failure = expectAdapterFailure(result, {
    code: 'UNSUPPORTED_CAPABILITY',
    provider: 'google',
    capability: 'tasks.write',
    retryable: false
  })
  assert.equal(failure.error.details?.operation, 'createTask')
})

test('adapterFailure preserves normalized category and recovery hints', () => {
  const failure = expectFailure(
    adapterFailure('Google API timed out', {
      provider: 'google',
      operation: 'listTasks',
      category: 'timeout',
      retryable: true,
      causeCode: 'ETIMEDOUT',
      nextStep: 'Retry in a few seconds'
    }),
    'ADAPTER_ERROR'
  )

  expectRecovery(failure, {
    nextAction: 'retry',
    classification: 'transient',
    retryable: true
  })
  assert.equal(failure.error.details?.provider, 'google')
  assert.equal(failure.error.details?.operation, 'listTasks')
  assert.equal(failure.error.details?.category, 'timeout')
  assert.equal(failure.error.details?.retryable, true)
  assert.equal(failure.error.details?.causeCode, 'ETIMEDOUT')
})

test('lookup failures render candidates and next steps in human mode', async () => {
  const tool = createTool({
    name: 'demo',
    commands: [
      defineCommand({
        name: 'pick',
        handler: async () =>
          ambiguousMatch(
            [
              { id: 'task-1', label: 'Invoice follow-up', description: 'Daily Focus' },
              { id: 'task-2', label: 'Invoice draft', description: 'Backlog' }
            ],
            'Multiple tasks matched',
            {
              query: 'invoice',
              nextStep: 'Run demo pick --id task-1'
            }
          )
      })
    ]
  })

  const result = await runTool(tool, ['pick'])
  expectFailure(result.result, 'AMBIGUOUS_MATCH')
  assert.match(result.stderr, /Error \[AMBIGUOUS_MATCH\]: Multiple tasks matched/)
  assert.match(result.stderr, /Classification: user_action_required/)
  assert.match(result.stderr, /Next action: choose_candidate/)
  assert.match(result.stderr, /Query: invoice/)
  assert.match(result.stderr, /Candidates:/)
  assert.match(result.stderr, /Invoice follow-up \(task-1\) - Daily Focus/)
  assert.match(result.stderr, /Invoice draft \(task-2\) - Backlog/)
  assert.match(result.stderr, /Next step: Run demo pick --id task-1/)
})

test('config helpers can define and select named profiles', () => {
  const work = defineProfile('work', { account: 'team@example.com', region: 'us' }, { account: 'team@example.com' })
  assert.equal(work.name, 'work')
  assert.equal(work.account, 'team@example.com')

  const selected = selectProfile(
    {
      work: work.values,
      personal: { account: 'me@example.com', region: 'us' }
    },
    'work'
  )

  if ('ok' in selected) throw new Error('expected selected profile values')
  assert.equal(selected.account, 'team@example.com')
})

test('loadConfig merges base config, selected profile, and env overrides', () => {
  const schema = z.object({
    account: z.string().min(1),
    region: z.string().min(1),
    apiBaseUrl: z.string().url()
  })

  const config = loadConfig(schema, {
    config: { region: 'eu', apiBaseUrl: 'https://base.example.com' },
    profiles: {
      work: { account: 'team@example.com', apiBaseUrl: 'https://work.example.com' }
    },
    profile: 'work',
    env: { region: 'us' }
  })

  if ('ok' in config && config.ok === false) throw new Error('expected config to load successfully')
  assert.equal(config.account, 'team@example.com')
  assert.equal(config.region, 'us')
  assert.equal(config.apiBaseUrl, 'https://work.example.com')
})

test('missingConfig and malformed config paths preserve structured diagnostics', () => {
  const missing = expectConfigFailure(
    missingConfig('API_BASE_URL', {
      source: 'env',
      nextStep: 'Set API_BASE_URL and try again'
    }),
    {
      reason: 'missing',
      source: 'env',
      key: 'API_BASE_URL'
    }
  )
  assert.equal(missing.error.details?.source, 'env')

  const malformed = expectConfigFailure(
    malformedConfig('apiBaseUrl: Invalid url', {
      source: 'merged',
      expected: '{"apiBaseUrl":"https://api.example.com"}',
      issues: ['apiBaseUrl: Invalid url']
    }),
    {
      reason: 'malformed',
      source: 'merged'
    }
  )
  assert.equal(malformed.error.details?.source, 'merged')
})

test('validateConfig returns CONFIG_ERROR for malformed config', () => {
  const schema = z.object({
    account: z.string().min(1),
    apiBaseUrl: z.string().url()
  })

  const result = validateConfig(schema, {
    account: 'team@example.com',
    apiBaseUrl: 'not-a-url'
  }, {
    source: 'merged',
    nextStep: 'Fix apiBaseUrl and try again'
  })

  const failure = expectFailure(result, 'CONFIG_ERROR')
  assert.equal(failure.error.details?.reason, 'malformed')
  assert.match(failure.error.message, /Invalid url/)
})

test('adapter failures render normalized details in human mode', async () => {
  const tool = createTool({
    name: 'demo',
    commands: [
      defineCommand({
        name: 'sync',
        handler: async () =>
          unsupportedCapability('tasks.write', {
            provider: 'google',
            operation: 'createTask',
            nextStep: 'Reconnect with write scopes'
          })
      })
    ]
  })

  const result = await runTool(tool, ['sync'])
  expectFailure(result.result, 'UNSUPPORTED_CAPABILITY')
  assert.match(result.stderr, /Error \[UNSUPPORTED_CAPABILITY\]: Adapter does not support capability: tasks.write/)
  assert.match(result.stderr, /Classification: permanent/)
  assert.match(result.stderr, /Next action: abort/)
  assert.match(result.stderr, /Provider: google/)
  assert.match(result.stderr, /Operation: createTask/)
  assert.match(result.stderr, /Capability: tasks.write/)
  assert.match(result.stderr, /Retryable: no/)
  assert.match(result.stderr, /Next step: Reconnect with write scopes/)
})

test('config failures render structured diagnostics in human mode', async () => {
  const tool = createTool({
    name: 'demo',
    commands: [
      defineCommand({
        name: 'config',
        handler: async () =>
          missingConfig('API_BASE_URL', {
            source: 'env',
            profile: 'work',
            expected: '{"apiBaseUrl":"https://api.example.com"}',
            nextStep: 'Set API_BASE_URL or run demo config --profile work'
          })
      })
    ]
  })

  const result = await runTool(tool, ['config'])
  expectFailure(result.result, 'CONFIG_ERROR')
  assert.match(result.stderr, /Error \[CONFIG_ERROR\]: Missing config: API_BASE_URL/)
  assert.match(result.stderr, /Classification: user_action_required/)
  assert.match(result.stderr, /Next action: fix_input/)
  assert.match(result.stderr, /Source: env/)
  assert.match(result.stderr, /Key: API_BASE_URL/)
  assert.match(result.stderr, /Profile: work/)
  assert.match(result.stderr, /Reason: missing/)
  assert.match(result.stderr, /Expected: \{"apiBaseUrl":"https:\/\/api.example.com"\}/)
  assert.match(result.stderr, /Next step: Set API_BASE_URL or run demo config --profile work/)
})

test('notFound helper preserves structured lookup guidance', () => {
  const result = notFound('Task not found', {
    query: 'invoice',
    nextStep: 'Run demo list --json'
  })

  const failure = expectFailure(result, 'NOT_FOUND')
  expectRecovery(failure, {
    nextAction: 'clarify',
    classification: 'user_action_required',
    retryable: false
  })
  assert.equal(failure.error.details?.query, 'invoice')
  assert.equal(failure.error.details?.nextStep, 'Run demo list --json')
})

test('human output renders warnings and concise record details', async () => {
  const tool = createTool({
    name: 'demo',
    commands: [
      defineCommand({
        name: 'save',
        handler: async () =>
          ok({
            type: 'task',
            id: 'task-123',
            destination: 'google_tasks',
            record: { title: 'Send estimate', due: '2026-04-11', nested: { ignored: true } },
            warnings: ['Google Tasks ignored the time portion of due-at.']
          })
      })
    ]
  })

  const result = await runTool(tool, ['save'])
  assert.match(result.stdout, /Saved task/)
  assert.match(result.stdout, /ID: task-123/)
  assert.match(result.stdout, /Destination: google_tasks/)
  assert.match(result.stdout, /title: Send estimate/)
  assert.match(result.stdout, /due: 2026-04-11/)
  assert.match(result.stdout, /Warnings:/)
})

test('withRecovery can annotate successful results for follow-up handling', async () => {
  const result = withRecovery(
    ok({
      type: 'task',
      id: 'task-123',
      destination: 'google_tasks',
      record: { title: 'Send estimate' }
    }),
    {
      nextAction: 'verify_state',
      classification: 'unknown',
      retryable: false
    }
  )

  const success = expectOk(result)
  expectRecovery(success, {
    nextAction: 'verify_state',
    classification: 'unknown',
    retryable: false
  })
})

test('dry-run preserves payload and marks successful results', async () => {
  const result = asDryRun(
    ok({
      type: 'task',
      id: 'task-123',
      destination: 'google_tasks',
      record: { title: 'Send estimate' }
    })
  )

  const success = expectDryRun(result)
  assert.equal(success.id, 'task-123')
  assert.equal(success.destination, 'google_tasks')
  assert.deepEqual(success.record, { title: 'Send estimate' })
})

test('runTool captures human failure output on stderr', async () => {
  const tool = createTool({
    name: 'demo',
    commands: [
      defineCommand({
        name: 'fail',
        handler: async () => nextStepGuidance('Run demo hello first', 'missing prerequisite')
      })
    ]
  })

  const result = await runTool(tool, ['fail'])
  const failure = expectFailure(result.result, 'VALIDATION_ERROR')
  assert.match(failure.error.message, /Run demo hello first/)
  assert.equal(result.stdout, '')
  assert.match(result.stderr, /Error \[VALIDATION_ERROR\]: missing prerequisite/)
})

test('runTool captures dry-run human output on stdout', async () => {
  const tool = createTool({
    name: 'demo',
    commands: [
      defineCommand({
        name: 'preview',
        handler: async () =>
          asDryRun(
            ok({
              type: 'task',
              id: 'task-123',
              destination: 'google_tasks',
              record: { title: 'Preview estimate' }
            })
          )
      })
    ]
  })

  const result = await runTool(tool, ['preview'])
  const success = expectOk(result.result)
  assert.equal(success.dryRun, true)
  assert.match(result.stdout, /Dry run task/)
  assert.match(result.stdout, /title: Preview estimate/)
  assert.equal(result.stderr, '')
})

test('fakeAdapter returns readable fake implementations for tests', async () => {
  const tasks = fakeAdapter({
    createTask: async (title: string) => ok({ type: 'task', record: { title } })
  })

  const created = await tasks.createTask('Send estimate')
  const success = expectOk(created)
  assert.deepEqual(success.record, { title: 'Send estimate' })
})
