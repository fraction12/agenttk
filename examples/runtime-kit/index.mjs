import {
  defineCommand,
  firstPositional,
  hasFlag,
  invalidInput,
  runToolCli,
  unverifiedMutation
} from 'agenttk'

await runToolCli({
  name: 'runtime-demo',
  description: 'Thin-entrypoint AgentTK runtime example',
  presentation: {
    recordFields: [
      { key: 'title', label: 'Title' },
      { key: 'status', label: 'Status' }
    ]
  },
  commands: [
    defineCommand({
      name: 'create',
      description: 'Create a demo task receipt',
      aliases: ['add'],
      usage: 'runtime-demo create "Send estimate" [--dry-run]',
      handler: async ({ rawArgs }) => {
        const title = firstPositional(rawArgs, ['--dry-run'])
        if (!title) return invalidInput('title is required', {
          details: { expected: 'runtime-demo create "Send estimate"' }
        })

        return unverifiedMutation({
          type: 'task',
          destination: 'demo_tasks',
          record: {
            title,
            status: hasFlag(rawArgs, '--dry-run') ? 'previewed' : 'created'
          },
          warnings: hasFlag(rawArgs, '--dry-run') ? ['dry-run requested'] : undefined
        })
      }
    })
  ]
})
