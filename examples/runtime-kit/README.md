# runtime-kit

Reference migration shape for downstream CLIs that currently carry their own dispatch, output, and envelope glue.

## Before

Many tool repos have an entrypoint that does all of this by hand:

- parse `--json`
- switch on `argv[0]`
- special-case `help`
- resolve command aliases
- choose stdout or stderr
- build common failures like invalid input, busy runtime, and unverified mutation receipts

## After

The entrypoint defines commands and delegates the framework layer to AgentTK:

```js
await runToolCli({
  name: 'runtime-demo',
  presentation: {
    recordFields: ['title', 'status']
  },
  commands: [
    defineCommand({
      name: 'create',
      aliases: ['add'],
      handler: async ({ rawArgs }) => {
        const title = firstPositional(rawArgs, ['--dry-run'])
        if (!title) return invalidInput('title is required')

        return unverifiedMutation({
          type: 'task',
          record: { title, status: 'created' },
          warnings: hasFlag(rawArgs, '--dry-run') ? ['dry-run requested'] : undefined
        })
      }
    })
  ]
})
```

This is the shape Microcanvas-style CLIs can migrate toward: keep domain behavior in command handlers, and let AgentTK own dispatch, help, rendering, recovery metadata, and common result factories.
