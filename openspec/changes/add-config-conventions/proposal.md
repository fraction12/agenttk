## Why

Once downstream tools move beyond toy CLIs, they all need configuration: default accounts, env vars, profile selection, and provider-specific settings. The doctrine says AgentTK should own config conventions, not ad hoc per-tool chaos.

## What Changes

- Define reusable config loading conventions for AgentTK-based CLIs.
- Standardize environment and config validation helpers.
- Support account/profile naming patterns without dictating storage backends.
- Keep scope narrow: no secrets manager, no full config UI, and no project-specific schemas in core.

## Capabilities

### New Capabilities
- `config-conventions`: Shared config loading, validation, and profile/account conventions for downstream tools.

### Modified Capabilities
- `command-blocks`: Validation helpers should support config and environment diagnostics cleanly.

## Impact

- Gives downstream tools a predictable config story without forcing a giant framework.
- Makes agent-authored CLIs easier to generate consistently.
- Creates a clean boundary between generic config plumbing and domain-specific settings.
