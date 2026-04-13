## Why

The roadmap already defines the execution semantics that make AgentTK safer for autonomous use. The missing final piece is a durable review bar so downstream tools can be judged against the same standard instead of vague “agent-safe” claims.

## What Changes

- Define the canonical AgentTK checklist for evaluating whether a downstream CLI is ready for autonomous-agent use.
- Export that checklist from the testing surface so downstream repos and reviewers can consume the same source of truth.
- Document the checklist in the README and test it as part of the package surface.

## Capabilities

### Modified Capabilities
- `agent-authoring-doctrine`: the doctrine now includes the canonical agent-safe review checklist.
- `testing-kit`: the package exports the checklist so downstream review and release gates can consume it directly.

## Impact

- Downstream tools get a stable review bar for autonomous use.
- PRs and release gates can point at one checklist instead of inventing bespoke standards.
- AgentTK’s “agent-safe” posture becomes auditable instead of hand-wavy.
