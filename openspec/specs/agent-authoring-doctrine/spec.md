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

