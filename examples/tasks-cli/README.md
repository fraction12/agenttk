# tasks-cli

Task-oriented example showing the v0 blocks that matter most.

## Run

```bash
node examples/tasks-cli/index.mjs add --title "Send estimate" --due 2026-04-11 --json
node examples/tasks-cli/index.mjs add --title "Send estimate" --dry-run
node examples/tasks-cli/index.mjs add
```

## What it shows

- validation via `validateInput(...)`
- corrective guidance via `nextStep` validation options
- dry-run behavior via `asDryRun(...)`
- structured write receipts via `ok(...)`
- JSON and human output modes
