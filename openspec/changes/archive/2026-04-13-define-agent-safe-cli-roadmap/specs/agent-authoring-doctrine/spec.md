## ADDED Requirements

### Requirement: Recovery-first roadmap doctrine
The system SHALL prioritize future roadmap changes by how much they improve agent recovery and execution safety.

#### Scenario: Future primitive reduces agent stranding
- **WHEN** a proposed AgentTK capability helps an agent recover from failure, avoid unsafe retries, or decide the correct next action after an ambiguous or partial result
- **THEN** that proposal aligns with the roadmap doctrine for near-term core investment

#### Scenario: Future primitive is merely convenient
- **WHEN** a proposed AgentTK capability is convenient but does not materially improve execution predictability, recovery, verification, or mutation safety
- **THEN** it should be deprioritized behind roadmap work that closes the agent-stuck gap

### Requirement: Phased roadmap for agent-safe CLIs
The system SHALL maintain a concrete phased roadmap for the next reusable AgentTK primitives.

#### Scenario: Near-term roadmap phases are evaluated
- **WHEN** roadmap planning is discussed
- **THEN** the next phases should explicitly cover recovery semantics, mutation safety, autonomy guardrails, and an eventual agent-safe CLI checklist
- **AND** the roadmap should describe those as future lanes rather than claiming they already exist in the framework

#### Scenario: Each phase has a clean boundary
- **WHEN** a roadmap phase is defined
- **THEN** it specifies its purpose, what is in scope, what is out of scope, and the likely follow-on implementation change
- **AND** later phases do not get smuggled into earlier ones just because they are related

### Requirement: Agent-safe CLI evaluation bar
The system SHALL define the durable traits expected of a downstream CLI before it is treated as agent-safe for autonomous use.

#### Scenario: Review a downstream CLI for autonomous use
- **WHEN** a downstream CLI is evaluated for agent-autonomous operation
- **THEN** the review should check for predictable failure contracts, machine-usable recovery signals, explicit retry/idempotency behavior for writes, mutation verification where appropriate, and tests that cover failure and verification paths

### Requirement: Boundary discipline for execution safety
The system SHALL keep recovery contracts generic while leaving provider-specific safety rules in downstream tools.

#### Scenario: Generic execution contract enters core
- **WHEN** a proposal adds reusable fields or helpers such as recovery actions, retry classification, verification status, or risk metadata
- **THEN** those capabilities may belong in AgentTK core if they remain provider-agnostic and composable

#### Scenario: Provider-specific safety policy is proposed for core
- **WHEN** a proposal attempts to encode Trello-specific, calendar-specific, email-specific, or other business-rule-specific safety behavior directly into AgentTK core
- **THEN** that proposal conflicts with the roadmap doctrine unless the behavior is abstracted into a reusable framework-level contract
