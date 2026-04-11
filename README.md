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
  commands: [
    defineCommand({
      name: 'hello',
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
- `renderResult`
- `asDryRun`

Testing:
- `runTool`
- `expectOk`
- `expectFailure`
- `fakeAdapter`

## Examples

- `examples/minimal-cli/`
- `examples/tasks-cli/`

```bash
node examples/minimal-cli/index.mjs hello --json
node examples/tasks-cli/index.mjs add --title "Send estimate" --dry-run --json
node examples/tasks-cli/index.mjs add
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
