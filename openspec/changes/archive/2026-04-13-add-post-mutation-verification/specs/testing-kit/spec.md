## ADDED Requirements

### Requirement: Verification assertions
The system SHALL provide reusable testing assertions for verification metadata.

#### Scenario: Downstream tool tests verification state
- **WHEN** a downstream tool test checks whether a mutation result was verified
- **THEN** AgentTK can assert `verified` and `verificationStatus` directly without custom test helpers
