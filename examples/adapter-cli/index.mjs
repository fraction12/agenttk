import {
  adapterFailure,
  createTool,
  defineAdapter,
  defineCommand,
  ok,
  requireCapability
} from 'agenttk'

const adapter = defineAdapter({
  provider: 'google',
  capabilities: ['tasks.read']
})

const tool = createTool({
  name: 'adapter-demo',
  commands: [
    defineCommand({
      name: 'create-task',
      description: 'Show capability and adapter failure handling',
      handler: async () => {
        const capability = requireCapability(adapter, 'tasks.write', {
          operation: 'createTask',
          nextStep: 'Reconnect with write scopes or swap adapters'
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
    }),
    defineCommand({
      name: 'status',
      handler: async () => ok({ type: 'adapter', record: adapter })
    })
  ]
})

await tool.run(process.argv.slice(2))
