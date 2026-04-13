## Context

Phase 2 needs a reusable contract for verification status after a mutation. Downstream tools will always own the actual read-back logic, but AgentTK should own the result shape and helpers.

## Goals

- Add shared verification metadata to result envelopes.
- Provide helpers for common verified and unverified paths.
- Align unverified outcomes with the existing recovery-semantics layer.

## Non-Goals

- Build provider-specific read-back logic.
- Guarantee that every mutation command must verify itself.
- Add approval policies or higher-level orchestration.

## Decisions

### 1. Verification metadata belongs on the result envelope
The shared fields are:
- `verified`
- `verificationStatus`

### 2. Verification status should be explicit
The framework uses:
- `verified`
- `unverified`
- `not_applicable`
- `verification_failed`

### 3. Unverified results should bias toward verify_state
When a tool marks a result as unverified, AgentTK should default the recovery layer toward `nextAction: verify_state` unless a better action is already present.

### 4. Helpers should compose with mutation-safety metadata
Verification helpers should work on top of the same result envelope used for idempotency and replay cues.

## File-level plan

- extend `src/core/types.ts` with verification status types
- add verification helpers in `src/core/mutation-safety.ts`
- update human output rendering and testing assertions
- extend smoke coverage for verified and unverified mutation outcomes
