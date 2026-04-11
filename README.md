# AgentTK

AgentTK is a small TypeScript toolkit for building deterministic, agent-friendly CLIs.

It gives you:
- structured success and failure results
- clean JSON output for agents
- simple human output for operators
- validation helpers
- dry-run helpers
- lightweight test helpers

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
```

## Releases

Tagging `vX.Y.Z` publishes the matching package version to npm and creates a GitHub release.

```bash
npm version patch
git push origin main --follow-tags
```

GitHub Actions expects an `NPM_TOKEN` repo secret with npm publish access.
