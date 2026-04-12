## MODIFIED Requirements

### Requirement: Corrective guidance in validation failures
The system SHALL support validation failures that include corrective guidance.

#### Scenario: Auth guidance uses the same corrective model
- **WHEN** a downstream tool returns an auth-related failure with a next-step recommendation
- **THEN** AgentTK renders that guidance in the same concise actionable style used for validation repair paths
- **AND** tools do not need a separate human-output system just for auth repair
