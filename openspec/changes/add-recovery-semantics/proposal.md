## Why

The roadmap change defined Phase 1 as recovery semantics, but AgentTK does not yet implement that contract. Today a downstream tool can often tell an agent what failed and sometimes suggest a prose next step, but it still cannot reliably answer the operational questions that matter most in autonomous execution:

- should the agent retry?
- should it stop?
- should it reauthenticate?
- should it clarify ambiguous input?
- should it verify state before doing anything else?

That gap is exactly where agents get stuck or make sloppy follow-up decisions.

## What Changes

- Add first-class recovery metadata to AgentTK success and failure envelopes.
- Normalize Phase 1 recovery fields across the existing helper blocks.
- Render recovery cues clearly in both JSON and human mode.
- Expose recovery helpers and assertions so downstream tools and tests can adopt the contract consistently.

## Capabilities

### Modified Capabilities
- `tool-runtime`: success and failure envelopes gain first-class recovery metadata.
- `command-blocks`: human and JSON rendering preserve recovery semantics.
- `adapter-contracts`: adapter failures normalize retry and classification cues into the shared recovery contract.

## Impact

- Downstream AgentTK tools can return machine-usable instructions about what to do next after a failure.
- Existing auth, lookup, validation, config, and adapter helpers become more useful for autonomous agents.
- Phase 1 of the agent-safe roadmap becomes real code rather than just doctrine.
