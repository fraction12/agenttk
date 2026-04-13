## Context

Phase 1 of the agent-safe roadmap is recovery semantics. The goal is narrow and deliberate: make command outcomes machine-actionable before adding more ambitious mutation safety or approval behavior.

AgentTK already has useful ingredients:
- structured success and failure envelopes
- helper blocks for auth, lookup, adapter, config, and validation
- human and JSON renderers

What is missing is a framework-level recovery contract that downstream tools can rely on consistently.

## Goals

- Add first-class recovery metadata to command outcomes.
- Normalize recovery defaults in the most important helper blocks.
- Keep the implementation small and composable.
- Avoid smuggling Phase 2 or Phase 3 concerns into Phase 1.

## Non-Goals

- Add idempotency keys or replay-risk semantics.
- Add post-mutation verification flows.
- Add approval or confirmation orchestration.
- Encode provider-specific retry policies in core.

## Decisions

### 1. Recovery metadata belongs on the result envelope
Phase 1 should make recovery cues first-class at the top level of success and failure results rather than hiding them inside provider-specific details.

The shared fields are:
- `nextAction`
- `classification`
- `retryable`

These fields should work in both success and failure envelopes, even if failures are the dominant initial use case.

### 2. Keep the classification set small
To avoid premature taxonomy sludge, Phase 1 uses a narrow classification family:
- `transient`
- `permanent`
- `user_action_required`
- `unknown`

This is enough to help agents choose among retry, pause, clarify, and stop behaviors without pretending the framework already knows every nuance.

### 3. Existing helper blocks should set sane defaults
Phase 1 should immediately improve the helpers that downstream tools already use most:
- auth failures → `reauth`, `user_action_required`, `retryable: false`
- lookup ambiguity → `choose_candidate`, `user_action_required`, `retryable: false`
- lookup not-found → `clarify`, `user_action_required`, `retryable: false`
- validation/config failures → `fix_input`, `user_action_required`, `retryable: false`
- retryable adapter/network/timeouts → `retry`, `transient`, `retryable: true`
- unsupported capability and hard adapter failures → `abort`, `permanent`, `retryable: false`

These defaults should stay overridable when downstream tools need a better generic recovery cue.

### 4. Rendering must surface recovery cues cleanly
Human mode should show recovery fields in a concise readable form.
JSON mode should preserve the fields exactly without decoration.

### 5. Testing needs explicit recovery assertions
AgentTK should expose a reusable assertion for recovery metadata so downstream tools can test for recovery semantics directly instead of scraping strings.

## File-level implementation plan

- `src/core/types.ts`
  - add `RecoveryAction`, `RecoveryClassification`, and `RecoveryMetadata`
  - extend success/failure envelopes with first-class recovery fields
- `src/core/recovery.ts`
  - add a small helper for attaching recovery metadata to an existing result
- `src/blocks/output.ts`
  - render `classification`, `retryable`, and `nextAction` in human mode
- `src/blocks/auth.ts`
  - attach default auth recovery metadata
- `src/blocks/lookup.ts`
  - attach default recovery metadata for not-found and ambiguous outcomes
- `src/blocks/validation.ts`
  - attach default recovery metadata for validation failures
- `src/blocks/config.ts`
  - attach default recovery metadata for config failures
- `src/blocks/adapter.ts`
  - derive recovery defaults from adapter failure category and retryability
- `src/errors/guidance.ts`
  - keep basic guidance helpers aligned with the new recovery contract
- `src/testing/assertions.ts`
  - add `expectRecovery`
- `src/index.ts`
  - export recovery types and helpers
- `test/smoke.test.ts`
  - cover top-level recovery metadata and human rendering

## Risks / Trade-offs

- **Risk: top-level recovery plus detail-specific metadata feels redundant.** Acceptable for now because top-level recovery is the shared contract while details still carry domain-specific context.
- **Risk: default recovery actions may be imperfect for some tools.** Mitigation: keep them overridable.
- **Risk: Phase 1 expands too far.** Mitigation: do not add idempotency, verification, or approvals here.
