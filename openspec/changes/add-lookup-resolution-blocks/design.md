## Context

Agent-authored CLIs often begin with a lookup. A user says "update the task about invoices" or an automation passes a query string instead of a record id. Today every tool would need to reinvent resolution rules and ambiguity handling.

## Goals / Non-Goals

**Goals:**
- Support id-or-query style lookup helpers.
- Standardize not-found and ambiguous-match failures.
- Support candidate summaries that are safe for both human and JSON rendering.
- Keep matching policy configurable by downstream tools.

**Non-Goals:**
- Build an interactive selector or prompt loop.
- Force a single ranking algorithm into core.
- Own provider search adapters in AgentTK.

## Decisions

### 1. Resolution helpers should separate matching from outcome handling
Downstream tools should supply candidate data and match policy, while AgentTK owns the envelope shapes for no match, one match, and many matches.

### 2. Ambiguity is a first-class result
Ambiguous matches should not be treated as a generic validation error because agents and operators often need the candidate set.

### 3. Candidate summaries must stay small
The v1 shape should support a compact candidate list with ids and labels, not full records.

## Risks / Trade-offs

- **Risk: matching logic becomes too opinionated** → keep ranking outside core.
- **Risk: candidate payloads become bloated** → cap the summary model at compact labels/ids.
- **Risk: tools skip the helper** → make the result shapes obviously more useful than bespoke strings.

## Migration Plan

1. Add resolution helper types and outcome helpers.
2. Add standard failure shapes for not found and ambiguous matches.
3. Add tests for human and JSON output across lookup outcomes.
4. Document a minimal id-or-query command example.
