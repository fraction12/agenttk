## Context

The doctrine explicitly names auth-required guidance as one of the next reusable primitives AgentTK should own. Real CLIs need to distinguish between validation problems and operational auth problems, and they need to do so in a machine-readable way.

## Goals / Non-Goals

**Goals:**
- Introduce reusable auth failure helpers with stable error codes.
- Support narrow auth preflight checks before mutation or read commands run.
- Make reauth and account-switch guidance consistent across tools.
- Preserve the existing structured result-envelope model.

**Non-Goals:**
- Implement OAuth flows or provider-specific auth in core.
- Add secret storage, browser auth, or token refresh logic.
- Standardize every possible auth edge case in v1.

## Decisions

### 1. Auth is a first-class operational failure category
AgentTK should distinguish auth failures from generic validation errors so tools can branch on them safely.

### 2. Auth checks should be pluggable
Core should provide the contract and helpers, while downstream tools decide how to query provider/account state.

### 3. Guidance must work in both human and JSON modes
The same auth result should drive operator-friendly repair steps and agent-friendly branching.

### 4. Scope stays narrow
The first pass should cover `AUTH_REQUIRED`, `AUTH_INVALID`, and `ACCOUNT_MISMATCH` style outcomes plus guidance metadata, not a full auth framework.

## Risks / Trade-offs

- **Risk: too many auth states too early** → start with a narrow canonical set.
- **Risk: provider assumptions leak into core** → keep checks interface-based and guidance text generic.
- **Risk: downstream tools still bypass the helpers** → make the primitives simpler than bespoke handling.

## Migration Plan

1. Add auth result helpers and stable auth error codes.
2. Add an auth-check contract and helper wrapper for commands.
3. Extend tests for auth failures in human and JSON modes.
4. Update docs with a minimal auth-preflight example.
