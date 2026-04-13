# agent-authoring-doctrine Specification

## Purpose
Define the durable product boundary for AgentTK as a framework for agent-authored CLIs, so future roadmap and scope decisions stay narrow, reusable, and free of generator/framework sludge.
## Requirements
### Requirement: AgentTK is a framework for agent-authored CLIs
The system SHALL define AgentTK as a reusable framework used by a user's agent to build CLI tools.

#### Scenario: Agent authors a tool using AgentTK
- **WHEN** a user's agent reads a skill, interface contract, or integration description
- **THEN** the agent can use AgentTK as the framework for writing the CLI tool
- **AND** AgentTK provides reusable primitives instead of trying to generate the complete tool itself

### Requirement: Clear ownership boundaries
The system SHALL distinguish among framework responsibilities, agent responsibilities, and downstream tool responsibilities.

#### Scenario: Framework boundary
- **WHEN** a capability is part of repeated CLI plumbing
- **THEN** it may belong in AgentTK core or an AgentTK helper layer

#### Scenario: Agent boundary
- **WHEN** a capability involves interpreting a skill, deciding the command surface, or writing tool-specific code
- **THEN** that responsibility belongs to the user's agent rather than AgentTK itself

#### Scenario: Downstream tool boundary
- **WHEN** a capability depends on provider-specific behavior, business rules, or domain quirks
- **THEN** that responsibility belongs in the downstream tool repo unless it later proves broadly reusable

### Requirement: Anti-goals remain explicit
The system SHALL reject scope that conflicts with the doctrine.

#### Scenario: Reject built-in tool generation
- **WHEN** a proposal attempts to make AgentTK itself generate complete tools
- **THEN** that proposal conflicts with the doctrine and should not be treated as core framework scope

#### Scenario: Reject domain-specific core bloat
- **WHEN** a proposal attempts to place provider-specific integrations or business logic into AgentTK core
- **THEN** that proposal conflicts with the doctrine unless the behavior is proven reusable across multiple tools

### Requirement: Roadmap decisions optimize for agent leverage
The system SHALL evaluate future capabilities by how much they help agents build good CLIs without rebuilding plumbing.

#### Scenario: Good future primitive
- **WHEN** a proposal adds help metadata, auth blocks, lookup patterns, adapter contracts, config conventions, or richer test helpers
- **THEN** it aligns with the doctrine if it increases agent leverage without forcing domain assumptions into core

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

### Requirement: Canonical agent-safe CLI checklist
The system SHALL define a durable checklist for evaluating whether a downstream CLI is ready for autonomous-agent use.

#### Scenario: Review a downstream CLI for autonomous use
- **WHEN** a downstream CLI is reviewed for autonomous-agent readiness
- **THEN** the checklist covers predictable failure envelopes, machine-usable recovery semantics, explicit write retry posture, post-mutation verification, risk posture for dangerous commands, and review-grade test coverage
- **AND** the checklist remains provider-agnostic so downstream tools can supply domain-specific evidence without pushing their business rules into AgentTK core

