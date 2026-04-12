# adapter-contracts Specification

## Purpose
TBD - created by archiving change add-adapter-contracts. Update Purpose after archive.
## Requirements
### Requirement: Narrow shared adapter contract
The system SHALL define a small reusable contract pattern for provider-backed adapters used by downstream AgentTK tools.

#### Scenario: Downstream tool adopts adapter contract
- **WHEN** a downstream CLI integrates with an external provider through an adapter layer
- **THEN** AgentTK provides a shared contract pattern that the tool can implement without adopting provider-specific core types

### Requirement: Normalized adapter failures
The system SHALL support normalized adapter failure shapes.

#### Scenario: Retryable adapter failure
- **WHEN** a provider call fails for a temporary operational reason
- **THEN** AgentTK can represent the failure as retryable in a structured normalized form
- **AND** downstream commands do not need to parse provider strings to determine retryability

#### Scenario: Non-retryable adapter failure
- **WHEN** a provider call fails for a permanent or caller-fixable reason
- **THEN** AgentTK can represent the failure as non-retryable in the same normalized family of errors

### Requirement: Capability signaling
The system SHALL support narrow capability signaling for adapters.

#### Scenario: Command requires unsupported capability
- **WHEN** a downstream command depends on an adapter capability that is not available
- **THEN** AgentTK can return a structured unsupported-capability outcome rather than a provider-specific crash

