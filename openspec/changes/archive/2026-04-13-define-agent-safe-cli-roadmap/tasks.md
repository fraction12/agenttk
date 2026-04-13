## 1. Roadmap doctrine

- [x] 1.1 Record that AgentTK's next roadmap is recovery-first and centered on agent-safe execution.
- [x] 1.2 Define the boundary between core recovery contracts, optional helper layers, and downstream domain behavior.
- [x] 1.3 Document the minimum durable characteristics of an eventually agent-safe CLI.

## 2. Phase structure

### Phase 1, Recovery semantics
- [x] 2.1 Define the purpose of Phase 1.
- [x] 2.2 Define what is in scope for Phase 1 (`nextAction`, classification, retryability, rendering).
- [x] 2.3 Define what is explicitly out of scope for Phase 1.
- [x] 2.4 Record the exit criteria and follow-on implementation change for Phase 1.

### Phase 2, Mutation safety
- [x] 2.5 Define the purpose of Phase 2.
- [x] 2.6 Define what is in scope for Phase 2 (idempotency, replay risk, verification, tests).
- [x] 2.7 Define what is explicitly out of scope for Phase 2.
- [x] 2.8 Record the exit criteria and follow-on implementation changes for Phase 2.

### Phase 3, Autonomy guardrails
- [x] 2.9 Define the purpose of Phase 3.
- [x] 2.10 Define what is in scope for Phase 3 (risk levels, confirmation hints, stop/ask behavior).
- [x] 2.11 Define what is explicitly out of scope for Phase 3.
- [x] 2.12 Record the exit criteria and follow-on implementation change for Phase 3.

### Phase 4, Agent-safe CLI checklist
- [x] 2.13 Define the purpose of Phase 4.
- [x] 2.14 Define the durable review bar a downstream CLI should eventually meet.
- [x] 2.15 Record the exit criteria and follow-on implementation change for Phase 4.

## 3. Future change sequencing

- [x] 3.1 Record the recommended order for the next OpenSpec changes.
- [x] 3.2 Ensure the roadmap does not claim that unimplemented primitives already exist.
- [x] 3.3 Keep provider-specific and business-rule-specific behavior out of AgentTK core scope.

## 4. Validation

- [x] 4.1 Validate the OpenSpec change.
- [x] 4.2 Use this roadmap as the reference when evaluating future AgentTK proposals around execution safety.
