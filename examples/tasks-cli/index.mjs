import { z } from 'zod'
import { asDryRun, createTool, defineCommand, isFailure, ok, validateInput } from 'agenttk'

const addTaskSchema = z.object({
  title: z.string().min(1, 'title is required'),
  due: z.string().optional(),
  dryRun: z.boolean().default(false)
})

function parseFlags(rawArgs) {
  const input = { dryRun: false }

  for (let i = 0; i < rawArgs.length; i += 1) {
    const arg = rawArgs[i]

    if (arg === '--dry-run') {
      input.dryRun = true
      continue
    }

    if (arg === '--title') {
      input.title = rawArgs[i + 1]
      i += 1
      continue
    }

    if (arg === '--due') {
      input.due = rawArgs[i + 1]
      i += 1
    }
  }

  return input
}

const tool = createTool({
  name: 'tasks-demo',
  commands: [
    defineCommand({
      name: 'add',
      description: 'Create a task receipt with validation and dry-run support',
      handler: async ({ rawArgs }) => {
        const parsed = validateInput(addTaskSchema, parseFlags(rawArgs), {
          nextStep: 'Run tasks-demo add --title "Send estimate" [--due 2026-04-11] [--dry-run]'
        })

        if (isFailure(parsed)) return parsed

        const result = ok({
          type: 'task',
          destination: 'demo_tasks',
          id: 'task-demo-1',
          record: {
            title: parsed.title,
            due: parsed.due ?? null
          }
        })

        return parsed.dryRun ? asDryRun(result) : result
      }
    })
  ]
})

await tool.run(process.argv.slice(2))
