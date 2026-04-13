## Context

Phase 4 is supposed to codify the bar established by the earlier phases, not invent a new runtime subsystem. The checklist should therefore stay lightweight, exported, and review-oriented.

## Goals

- Define a durable checklist for downstream autonomous-agent readiness.
- Keep the checklist provider-agnostic.
- Make the checklist easy to consume in docs, tests, and PR review.

## Non-Goals

- Build a full policy engine.
- Automatically certify downstream tools.
- Encode provider-specific safety rules in AgentTK core.

## Decisions

### 1. The checklist is a first-class exported artifact
The checklist should live in the testing/review surface because that is where downstream repos will actually consume it.

### 2. The checklist should mirror the roadmap phases
The review bar should cover:
- predictable failure envelopes
- machine-usable recovery semantics
- explicit retry and replay posture for writes
- post-mutation verification
- risk and confirmation posture
- review-grade test coverage

### 3. The checklist is descriptive, not an approval engine
AgentTK should describe what good looks like. Downstream tools still own the domain-specific evidence for each checklist item.

## File-level plan

- add a checklist definition under `src/testing/`
- export the checklist from `src/index.ts`
- add smoke coverage for the exported checklist surface
- document the checklist in `README.md`
- update `CHANGELOG.md`
- add doctrine and testing-kit delta specs
