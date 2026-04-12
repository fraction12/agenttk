## MODIFIED Requirements

### Requirement: Stable failure envelope
The system SHALL support a standard structured failure envelope for command results.

#### Scenario: Adapter failures stay normalized
- **WHEN** a downstream command converts an adapter-layer failure into an AgentTK failure result
- **THEN** the failure envelope can preserve category and retryability hints without leaking raw provider response formats into the runtime contract
