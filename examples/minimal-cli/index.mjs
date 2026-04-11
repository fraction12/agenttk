import { createTool, defineCommand, ok } from 'agenttk'

const tool = createTool({
  name: 'minimal-demo',
  commands: [
    defineCommand({
      name: 'hello',
      description: 'Emit a greeting receipt',
      handler: async ({ rawArgs }) => {
        const name = rawArgs[0] ?? 'world'
        return ok({
          type: 'greeting',
          record: { message: `hello, ${name}` }
        })
      }
    })
  ]
})

await tool.run(process.argv.slice(2))
