## Context

Configuration drift is one of the quickest ways for downstream CLIs to become inconsistent. AgentTK does not need to own every settings shape, but it should offer conventions for loading, validating, and diagnosing config so generated tools feel consistent.

## Goals / Non-Goals

**Goals:**
- Define a narrow config loading model for environment variables and local config objects.
- Support validation and actionable diagnostics for missing or malformed config.
- Support account/profile selection conventions that work across tools.

**Non-Goals:**
- Implement a secrets manager.
- Define every domain-specific config key in core.
- Build interactive config editors or setup wizards.

## Decisions

### 1. Config should be convention-based, not magic
Core should give downstream tools helper patterns and result shapes, not hidden global behavior.

### 2. Validation and diagnostics matter more than storage
The first pass should focus on predictable loading inputs and good repair messages.

### 3. Profiles should stay generic
AgentTK can support generic profile/account naming patterns without embedding provider semantics.

## Risks / Trade-offs

- **Risk: config abstraction becomes bloated** → keep to loading + validation + diagnostics.
- **Risk: env handling gets opinionated** → support conventions, not hard-coded app policy.
- **Risk: downstream tools still invent their own model** → keep the framework shape simple and useful.

## Migration Plan

1. Add config loading and validation helper shapes.
2. Add config-diagnostic failures with corrective guidance.
3. Add examples for environment-backed and profile-backed config.
4. Extend tests for missing and malformed config flows.
