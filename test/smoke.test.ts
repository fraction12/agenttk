import test from 'node:test'
import assert from 'node:assert/strict'
import { z } from 'zod'
import {
  asDryRun,
  createTool,
  defineCommand,
  expectFailure,
  expectOk,
  fakeAdapter,
  nextStepGuidance,
  ok,
  runTool,
  validateInput
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

test('missing command returns UNKNOWN_COMMAND failure', async () => {
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
  const failure = expectFailure(result.result, 'UNKNOWN_COMMAND')
  assert.match(failure.error.message, /No command provided for demo/)
  assert.match(result.stderr, /No command provided for demo/)
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

test('dry-run preserves payload and marks successful results', async () => {
  const result = asDryRun(
    ok({
      type: 'task',
      id: 'task-123',
      destination: 'google_tasks',
      record: { title: 'Send estimate' }
    })
  )

  const success = expectOk(result)
  assert.equal(success.dryRun, true)
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
