## Context

Autonomy guardrails should stay lightweight. AgentTK does not need to ship an approval workflow engine, but it should let downstream tools declare command risk and require a confirmation step before dangerous actions run.

## Goals

- Add reusable command-level risk metadata.
- Provide a structured confirmation-required failure path.
- Surface risk metadata in help output and human rendering.

## Non-Goals

- Build a fixed approval UX.
- Add provider-specific approval policies.
- Force every command to declare risk metadata.

## Decisions

### 1. Risk metadata belongs on command definitions
The shared fields are:
- `level`
- `confirmation`
- `reason`

### 2. Confirmation should be a helper, not a runtime policy engine
Downstream tools decide when a confirmation flag or UX signal is present. AgentTK only provides the structured contract for blocking when confirmation is required.

### 3. Risk should appear in help output
If a command is high risk, help output should say so plainly.

## File-level plan

- extend `src/core/types.ts` with command risk metadata
- update `src/core/create-tool.ts` help record generation
- add `src/blocks/risk.ts`
- add a new error code for confirmation-required failures
- render risk metadata in help and human failure output
- add smoke coverage for risky help and confirmation-required failures
