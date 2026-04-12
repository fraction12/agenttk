# AgentTK

[![npm version](https://img.shields.io/npm/v/agenttk)](https://www.npmjs.com/package/agenttk)
[![Verify](https://github.com/fraction12/agenttk/actions/workflows/verify.yml/badge.svg)](https://github.com/fraction12/agenttk/actions/workflows/verify.yml)
[![license: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)

AgentTK is a small TypeScript toolkit for building deterministic, agent-friendly CLIs.

It gives you a clean core for tools that need:
- structured success and failure envelopes
- JSON-first output for agents
- concise human output for operators
- validation helpers with corrective guidance
- dry-run semantics for mutation commands
- lightweight test helpers for CLI behavior

## What it is

AgentTK is not a giant framework. It is a narrow toolkit for building reliable CLIs with a stable machine-facing contract.

Use it when you want:
- predictable command dispatch
- machine-readable results without string parsing
- simple human output layered on top of the same result envelope
- small test helpers instead of shell-heavy CLI tests

## What it is not

v0 intentionally does **not** include:
- plugin systems
- workflow engines
- auth doctor flows
- provenance helpers
- dynamic runtime loading
- provider SDK wrappers
- domain-specific adapters

## Install

```bash
npm install agenttk
```

If you want schema validation:

```bash
npm install zod
```

## Example

```ts
import { createTool, defineCommand, ok } from 'agenttk'

const tool = createTool({
  name: 'demo',
  description: 'Example CLI built with AgentTK',
  commands: [
    defineCommand({
      name: 'hello',
      description: 'Say hello',
      aliases: ['hi'],
      usage: 'demo hello [name]',
      examples: ['demo hello', 'demo hi Dushyant'],
      handler: async ({ rawArgs }) =>
        ok({
          type: 'greeting',
          record: { message: `hello, ${rawArgs[0] ?? 'world'}` }
        })
    })
  ]
})

await tool.run(process.argv.slice(2))
```

## Validation + dry-run

```ts
import { z } from 'zod'
import { asDryRun, createTool, defineCommand, isFailure, ok, validateInput } from 'agenttk'

const schema = z.object({
  title: z.string().min(1, 'title is required'),
  dryRun: z.boolean().default(false)
})

const tool = createTool({
  name: 'tasks',
  commands: [
    defineCommand({
      name: 'add',
      handler: async () => {
        const parsed = validateInput(schema, { title: '', dryRun: true }, {
          nextStep: 'Run tasks add --title "Send estimate" [--dry-run]'
        })

        if (isFailure(parsed)) return parsed

        const result = ok({
          type: 'task',
          id: 'task-123',
          destination: 'demo_tasks',
          record: { title: parsed.title }
        })

        return parsed.dryRun ? asDryRun(result) : result
      }
    })
  ]
})
```

## API

Core:
- `createTool`
- `defineCommand`
- `ok`
- `fail`
- `isFailure`

Helpers:
- `validateInput`
- `validationError`
- `expectedPayloadShape`
- `nextStepGuidance`
- `authRequired`
- `authInvalid`
- `accountMismatch`
- `requireAuth`
- `defineAdapter`
- `supportsCapability`
- `requireCapability`
- `adapterFailure`
- `unsupportedCapability`
- `defineProfile`
- `loadConfig`
- `validateConfig`
- `missingConfig`
- `malformedConfig`
- `selectProfile`
- `notFound`
- `ambiguousMatch`
- `resolveById`
- `resolveByQuery`
- `resolveOne`
- `renderResult`
- `asDryRun`

Testing:
- `runTool`
- `expectOk`
- `expectFailure`
- `fakeAdapter`

## Auth preflight

```ts
import { createTool, defineCommand, ok, requireAuth } from 'agenttk'

const tool = createTool({
  name: 'calendar',
  commands: [
    defineCommand({
      name: 'sync',
      handler: async () => {
        const auth = await requireAuth(async () => ({
          ok: false,
          code: 'AUTH_REQUIRED',
          provider: 'google',
          nextStep: 'Run calendar auth login'
        }))

        if (auth !== true) return auth

        return ok({ type: 'sync', record: { status: 'started' } })
      }
    })
  ]
})
```

## Adapter contracts

```ts
import {
  adapterFailure,
  createTool,
  defineAdapter,
  defineCommand,
  requireCapability
} from 'agenttk'

const adapter = defineAdapter({
  provider: 'google',
  capabilities: ['tasks.read']
})

const tool = createTool({
  name: 'tasks',
  commands: [
    defineCommand({
      name: 'add',
      handler: async () => {
        const capability = requireCapability(adapter, 'tasks.write', {
          operation: 'createTask',
          nextStep: 'Reconnect with write scopes'
        })

        if (capability !== true) return capability

        return adapterFailure('Google API timed out', {
          provider: 'google',
          operation: 'createTask',
          category: 'timeout',
          retryable: true,
          nextStep: 'Retry in a few seconds'
        })
      }
    })
  ]
})
```

Provider-specific SDK calls and object models should stay in the downstream repo. AgentTK only owns the contract boundary, capability checks, and normalized failure shapes.

## Config conventions

```ts
import { createTool, defineCommand, isFailure, loadConfig, ok } from 'agenttk'
import { z } from 'zod'

const schema = z.object({
  account: z.string().min(1),
  apiBaseUrl: z.string().url()
})

const config = loadConfig(schema, {
  env: { apiBaseUrl: process.env.API_BASE_URL },
  profiles: {
    work: { account: 'team@example.com', apiBaseUrl: 'https://api.example.com' }
  },
  profile: 'work'
}, {
  expected: '{"account":"team@example.com","apiBaseUrl":"https://api.example.com"}',
  nextStep: 'Set API_BASE_URL or choose a valid profile'
})

if (isFailure(config)) return config
return ok({ type: 'config', record: config })
```

Load order is predictable: base config, then selected profile, then env overrides. AgentTK stays out of secrets management and provider-specific config policy.

## Lookup resolution

```ts
import { ambiguousMatch, createTool, defineCommand, notFound, ok, resolveOne } from 'agenttk'

const tool = createTool({
  name: 'tasks',
  commands: [
    defineCommand({
      name: 'pick',
      handler: async () => {
        const matches = [
          { id: 'task-1', label: 'Invoice follow-up', description: 'Daily Focus' },
          { id: 'task-2', label: 'Invoice draft', description: 'Backlog' }
        ]

        const resolved = resolveOne({ query: 'invoice' }, matches, {
          nextStep: 'Retry with an explicit id'
        })

        if (!resolved.ok) return resolved
        return ok({ type: 'task', id: resolved.candidate.id, record: resolved.candidate })
      }
    })
  ]
})
```

## Examples

- `examples/minimal-cli/`
- `examples/tasks-cli/`
- `examples/adapter-cli/`
- `examples/config-cli/`

```bash
node examples/minimal-cli/index.mjs hello --json
node examples/minimal-cli/index.mjs help
node examples/tasks-cli/index.mjs add --title "Send estimate" --dry-run --json
node examples/tasks-cli/index.mjs add
node examples/adapter-cli/index.mjs status --json
node examples/config-cli/index.mjs show --profile work
```

## Development

```bash
npm run build
npm test
npm run examples:smoke
npm run verify
```

## Changelog

See [CHANGELOG.md](./CHANGELOG.md).

## Release discipline

For normal releases:

```bash
npm version patch
git push origin main --follow-tags
```

Rules:
- release only from a clean `main`
- let CI verify before trusting the tag
- keep `package.json`, npm, and GitHub releases aligned
- document user-visible changes in `CHANGELOG.md`
