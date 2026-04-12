## Why

Downstream CLIs repeatedly need the same ugly pattern: accept an id or a free-text query, search for matching records, and then fail safely when there are zero or multiple matches. The doctrine calls this out directly as a reusable primitive lane that belongs in AgentTK rather than scattered across every repo.

## What Changes

- Add reusable lookup and resolution helpers for id-or-query command flows.
- Standardize `NOT_FOUND` and `AMBIGUOUS_MATCH` result patterns for resolution steps.
- Support corrective guidance that points operators and agents toward the next lookup step.
- Keep scope narrow: no interactive picker UI and no provider-specific matching logic in core.

## Capabilities

### New Capabilities
- `lookup-resolution`: Reusable id-or-query resolution contracts, result helpers, and ambiguity handling patterns.

### Modified Capabilities
- `command-blocks`: Corrective guidance should work naturally with lookup-driven flows and ambiguity failures.

## Impact

- Adds a reusable layer for one of the most common CLI patterns.
- Reduces bespoke not-found and ambiguous-match logic across downstream tools.
- Creates a stable base for richer selection flows later without forcing domain assumptions into core.
