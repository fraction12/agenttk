# minimal-cli

Smallest useful AgentTK example.

## Run

```bash
node examples/minimal-cli/index.mjs hello --json
node examples/minimal-cli/index.mjs hello Dushyant
```

## What it shows

- package-style import from `agenttk`
- `createTool(...)`
- `defineCommand(...)`
- structured success output via `ok(...)`
- JSON and human output modes
