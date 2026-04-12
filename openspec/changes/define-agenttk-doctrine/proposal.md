## Why

AgentTK now has a working v0 runtime, but the long-term product direction needs to be made explicit before the package drifts into a vague framework. The intended role is not to generate CLIs itself. It is to provide the reusable building blocks that let a user's agent read a skill, understand the required APIs/auth/config, and write a good CLI tool quickly without rebuilding the plumbing from scratch.

Without a doctrine change, future work will fragment between three conflicting directions:
- a tiny runtime only
- a giant all-in-one framework that tries to do everything
- a hidden generator product that owns tool creation directly

We need a durable statement of what AgentTK is, what it is not, and what kinds of primitives should come next.

## What Changes

- Define AgentTK's product doctrine as a framework for **agent-authored CLIs**, not a built-in CLI generator.
- Specify the core boundaries between AgentTK, the user's agent, and downstream tool repos.
- Establish the next roadmap lanes for primitives that help agents build CLIs repeatedly: help metadata, auth blocks, adapter contracts, lookup patterns, config conventions, and richer testing.
- Explicitly reject scope creep into first-party tool generation, domain-specific adapters in core, or giant framework bloat.

## Capabilities

### New Capabilities
- `agent-authoring-doctrine`: Product doctrine and roadmap guardrails for AgentTK as the framework layer for agent-authored CLI tools.

### Modified Capabilities
- None.

## Impact

- Affects roadmap decisions for runtime, blocks, testing, and future package boundaries.
- Provides a durable source of truth for evaluating future OpenSpec changes.
- Makes it easier to decide what belongs in core, what belongs in higher-level helper packages, and what should remain in downstream tool repos.
