## Why

Phase 2 of the roadmap starts with mutation safety. Recovery semantics tell an agent how to interpret a failure, but they still do not tell it whether replaying a write is safe. That gap leads straight to duplicate cards, duplicate tasks, double comments, and other messy side effects.

AgentTK needs a narrow shared contract for mutation-safety metadata so downstream tools can describe write behavior without inventing incompatible field names and retry semantics.

## What Changes

- Add first-class mutation-safety metadata to AgentTK command result envelopes.
- Provide reusable helpers for attaching idempotency and replay-safety hints to results.
- Preserve mutation-safety metadata in human and JSON output.
- Add tests for idempotency, replay risk, and partial mutation cues.

## Capabilities

### Modified Capabilities
- `tool-runtime`: result envelopes gain mutation-safety metadata for write operations.
- `command-blocks`: human and JSON rendering preserve mutation-safety cues for operators and agents.
- `testing-kit`: assertions cover mutation-safety metadata.

## Impact

- Downstream tools can say whether a write is safe to replay, unsafe to replay, or should be verified first.
- Agents no longer have to guess retry behavior from ad hoc warnings or provider-specific strings.
