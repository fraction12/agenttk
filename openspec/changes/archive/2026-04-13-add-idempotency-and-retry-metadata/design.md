## Context

Mutation safety sits between recovery semantics and full post-mutation verification. The framework needs to describe whether a write can be retried safely before it attempts richer read-back flows.

## Goals

- Add shared mutation-safety metadata to result envelopes.
- Keep the contract generic and provider-agnostic.
- Support partial mutation outcomes and replay-risk hints.

## Non-Goals

- Build provider-specific idempotency implementations.
- Attempt automatic verification flows in this change.
- Infer replay safety from opaque provider errors.

## Decisions

### 1. Mutation-safety metadata belongs on the result envelope
The shared fields are:
- `idempotencyKey`
- `retrySafety`
- `replayRisk`
- `partial`

### 2. Retry safety should stay intentionally small
The framework uses:
- `safe`
- `verify_first`
- `do_not_retry`

### 3. Replay risk should stay descriptive, not magical
The framework uses:
- `none`
- `low`
- `high`
- `unknown`

### 4. Helper functions should stay composable
A downstream tool should be able to attach mutation-safety metadata to an existing success or failure without adopting a workflow engine.

## File-level plan

- extend `src/core/types.ts` with mutation-safety metadata types
- add `src/core/mutation-safety.ts` helpers
- update `src/blocks/output.ts` to render mutation-safety metadata
- add testing assertions and smoke coverage
