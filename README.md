# AgentTK

**AgentTK** is a small TypeScript toolkit for deterministic, agent-friendly CLIs.

It gives you a stable result envelope, predictable JSON output, concise human output, reusable validation, dry-run support, and a lightweight testing kit.

## V0 scope

Included in v0:
- tool creation and command registration
- structured success and failure envelopes
- validation helpers
- output rendering for JSON and human mode
- dry-run helpers
- lightweight test helpers

Not included in v0:
- plugin systems
- workflow engines
- auth doctor flows
- provenance helpers
- lookup resolvers
- live UAT runners
- domain adapters for third-party systems

The point is a sharp dependency, not a sprawling framework.

## Install

```bash
npm install agenttk
```

If you want schema-based validation, install `zod` in the consuming CLI as well:

```bash
npm install zod
```

## Minimal example

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

## Validation + dry-run example

```ts
import { z } from 'zod'
import { asDryRun, createTool, defineCommand, isFailure, ok, validateInput } from 'agenttk'

const addTaskSchema = z.object({
  title: z.string().min(1, 'title is required'),
  dryRun: z.boolean().default(false)
})

const tool = createTool({
  name: 'tasks',
  commands: [
    defineCommand({
      name: 'add',
      handler: async () => {
        const parsed = validateInput(addTaskSchema, { title: '', dryRun: true }, {
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

## Public API

Core runtime:
- `createTool`
- `defineCommand`
- `ok`
- `fail`
- `isFailure`

Command blocks:
- `validateInput`
- `validationError`
- `expectedPayloadShape`
- `nextStepGuidance`
- `renderResult`
- `asDryRun`

Testing kit:
- `runTool`
- `expectOk`
- `expectFailure`
- `fakeAdapter`

## Example CLIs in this repo

- `examples/minimal-cli/` - smallest consumer-facing example
- `examples/tasks-cli/` - validation and dry-run example

Run them locally:

```bash
node examples/minimal-cli/index.mjs hello --json
node examples/tasks-cli/index.mjs add --title "Send estimate" --dry-run --json
node examples/tasks-cli/index.mjs add
```

## Repo layout

```text
src/
  core/
  blocks/
  errors/
  testing/
examples/
  minimal-cli/
  tasks-cli/
test/
openspec/
```

## Development

```bash
npm run build
npm test
openspec validate add-agenttk-v0
```

## Publish readiness

Current state:
- build passes
- tests pass
- example smoke checks pass
- `openspec validate add-agenttk-v0` passes
- npm dry-run pack succeeds
- package name `agenttk` is currently unclaimed on npm

## Current status

The full `add-agenttk-v0` task list is implemented and verified.
The remaining work is release-facing, for example npm account auth, final version choice, and first publish.
