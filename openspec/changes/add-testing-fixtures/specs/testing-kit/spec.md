## MODIFIED Requirements

### Requirement: Lightweight testing kit
The system SHALL provide lightweight testing helpers for AgentTK-based CLIs.

#### Scenario: Framework primitives have matching test helpers
- **WHEN** AgentTK introduces reusable primitives such as auth blocks, lookup resolution, dry-run helpers, or adapter contracts
- **THEN** the testing kit can expose matching lightweight fixtures or assertions
- **AND** downstream tools do not need to rebuild the same harness patterns repeatedly

#### Scenario: Data-first testing remains possible
- **WHEN** a downstream developer uses the richer testing kit helpers
- **THEN** they can still test command behavior through explicit inputs and outputs
- **AND** the testing kit does not require a heavyweight integration framework or snapshot system
