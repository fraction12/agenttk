## Context

The current testing kit proves the basic runtime, but the next set of downstream tools will need more than "run a command and inspect stdout". They will need reusable patterns for auth failures, lookup ambiguity, dry-run verification, config diagnostics, and adapter-backed command behavior.

## Goals / Non-Goals

**Goals:**
- Add reusable fixtures and assertions for common AgentTK patterns.
- Support testing of auth, lookup, adapter, and dry-run flows without shell-heavy harnesses.
- Keep helpers lightweight and composable.

**Non-Goals:**
- Create a full end-to-end integration framework.
- Replace a consumer's preferred test runner.
- Add snapshot-driven golden-file infrastructure in core.

## Decisions

### 1. Testing helpers should mirror framework primitives
As AgentTK adds auth, lookup, adapter, and config primitives, the testing kit should expose matching helpers so downstream tools can verify those flows cheaply.

### 2. Fixtures should stay data-first
Helpers should focus on input/output assertions and fake dependencies rather than heavy runtime simulation.

### 3. The kit should stay compatible with standard test runners
The framework should complement Node test, Vitest, or Jest rather than trying to replace them.

## Risks / Trade-offs

- **Risk: the test kit becomes a framework inside the framework** → keep the helpers small and pattern-specific.
- **Risk: helpers lag behind primitives** → add fixture lanes in lockstep with new core capabilities.
- **Risk: too much hidden magic** → keep fixtures explicit and data-driven.

## Migration Plan

1. Extend the testing kit with richer reusable fixtures and assertions.
2. Add examples covering auth, lookup, dry-run, and adapter-backed flows.
3. Validate the changes against the emerging roadmap lanes.
