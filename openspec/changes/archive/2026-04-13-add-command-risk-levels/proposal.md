## Why

Phase 3 of the roadmap is autonomy guardrails. By this point AgentTK can describe recovery and mutation safety, but downstream tools still need a provider-agnostic way to mark commands as high risk and pause for confirmation instead of running blindly.

## What Changes

- Add command-level risk metadata to AgentTK command definitions and help records.
- Provide reusable helpers for risk declarations and confirmation-required failures.
- Render risk metadata in help output and human failure output.
- Add tests for risky command help and confirmation gating.

## Capabilities

### Modified Capabilities
- `tool-runtime`: command definitions and help records carry risk metadata.
- `command-help`: help output can surface risk and confirmation posture.
- `command-blocks`: risky commands can fail with a structured confirmation-required outcome.

## Impact

- Downstream tools can declare high-risk commands in a provider-agnostic way.
- Agents can distinguish between safe autonomous actions and actions that should pause for confirmation.
