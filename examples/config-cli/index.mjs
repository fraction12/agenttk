import { z } from 'zod'
import { createTool, defineCommand, isFailure, loadConfig, ok } from 'agenttk'

const schema = z.object({
  account: z.string().min(1),
  region: z.string().min(1),
  apiBaseUrl: z.string().url()
})

function parseFlags(rawArgs) {
  const input = { profile: undefined }

  for (let i = 0; i < rawArgs.length; i += 1) {
    const arg = rawArgs[i]
    if (arg === '--profile') {
      input.profile = rawArgs[i + 1]
      i += 1
    }
  }

  return input
}

const profiles = {
  work: {
    account: 'team@example.com',
    region: 'us',
    apiBaseUrl: 'https://api.example.com'
  },
  personal: {
    account: 'me@example.com',
    region: 'us',
    apiBaseUrl: 'https://personal.example.com'
  }
}

const envConfig = {
  account: process.env.CONFIG_DEMO_ACCOUNT,
  region: process.env.CONFIG_DEMO_REGION,
  apiBaseUrl: process.env.CONFIG_DEMO_API_BASE_URL
}

const tool = createTool({
  name: 'config-demo',
  commands: [
    defineCommand({
      name: 'show',
      description: 'Load config from env and optional named profiles',
      handler: async ({ rawArgs }) => {
        const flags = parseFlags(rawArgs)
        const config = loadConfig(schema, {
          env: envConfig,
          profiles,
          profile: flags.profile
        }, {
          expected: '{"account":"team@example.com","region":"us","apiBaseUrl":"https://api.example.com"}',
          nextStep: 'Set CONFIG_DEMO_* env vars or run config-demo show --profile work'
        })

        if (isFailure(config)) return config
        return ok({ type: 'config', record: config })
      }
    })
  ]
})

await tool.run(process.argv.slice(2))
