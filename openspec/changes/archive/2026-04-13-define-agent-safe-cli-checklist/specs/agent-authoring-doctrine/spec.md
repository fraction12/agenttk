## ADDED Requirements

### Requirement: Canonical agent-safe CLI checklist
The system SHALL define a durable checklist for evaluating whether a downstream CLI is ready for autonomous-agent use.

#### Scenario: Review a downstream CLI for autonomous use
- **WHEN** a downstream CLI is reviewed for autonomous-agent readiness
- **THEN** the checklist covers predictable failure envelopes, machine-usable recovery semantics, explicit write retry posture, post-mutation verification, risk posture for dangerous commands, and review-grade test coverage
- **AND** the checklist remains provider-agnostic so downstream tools can supply domain-specific evidence without pushing their business rules into AgentTK core
