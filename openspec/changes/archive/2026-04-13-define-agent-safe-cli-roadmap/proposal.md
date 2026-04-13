## Why

AgentTK now has the right foundations, but the next roadmap needs to be more disciplined than "add useful blocks." The real product goal is not just to help agents build CLIs quickly. It is to help them build CLIs that fail predictably, recover cleanly, and avoid getting stranded after an auth error, ambiguous lookup, transient provider failure, or partially successful write.

Right now, some of that safety exists in pieces:
- structured success and failure envelopes
- auth/config/lookup/adapter blocks
- testing helpers
- downstream examples like Relay and TrelloCLI

What is missing is a concrete roadmap that says which primitives should come next, what belongs in core versus optional layers, and what an "agent-safe" CLI should eventually be able to rely on.

Without that roadmap, AgentTK risks two bad outcomes:
- adding clever but uneven helpers that do not close the actual recovery gap
- leaving downstream tools to reinvent retry, verification, idempotency, and recovery behavior in inconsistent ways

## What Changes

- Define AgentTK's next roadmap explicitly around **agent-safe execution**, not generic framework expansion.
- Break the roadmap into four explicit phases, each with a clear purpose, scope boundary, and follow-on implementation lane:
  - **Phase 1, Recovery semantics**: `nextAction`, failure classification, retryability, recovery-oriented rendering
  - **Phase 2, Mutation safety**: idempotency metadata, replay risk, post-mutation verification, verification-oriented testing
  - **Phase 3, Autonomy guardrails**: risk levels, confirmation hints, stop/ask behavior for dangerous actions
  - **Phase 4, Agent-safe CLI checklist**: durable review bar for whether a downstream CLI is safe for autonomous use
- Define what belongs in AgentTK core versus optional helper layers versus downstream tool repos.
- Record a minimum agent-safe CLI contract so downstream tools can be judged consistently.
- Make the recommended follow-on OpenSpec changes map cleanly onto those phases instead of blending roadmap and implementation into one blob.

## Capabilities

### New Capabilities
- None.

### Modified Capabilities
- `agent-authoring-doctrine`: expand the doctrine so roadmap decisions are explicitly governed by recovery-first, agent-safe CLI behavior.

## Impact

- Gives AgentTK a concrete sequence for the next OpenSpec changes instead of opportunistic feature drift.
- Creates a durable evaluation rubric for whether a proposed primitive improves agent recovery and execution safety.
- Helps downstream CLIs converge on predictable failure handling, verification, and retry semantics.
- Keeps domain-specific business rules out of core while still raising the floor on agent-safe behavior across tools.
