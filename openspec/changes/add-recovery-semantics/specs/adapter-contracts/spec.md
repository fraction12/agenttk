## ADDED Requirements

### Requirement: Adapter failures project into shared recovery semantics
The system SHALL map normalized adapter failure categories into shared recovery metadata.

#### Scenario: Retryable operational adapter failure
- **WHEN** an adapter failure represents a temporary operational problem such as a timeout, network issue, or rate limit
- **THEN** the resulting AgentTK failure can classify the outcome as transient
- **AND** it can mark the outcome as retryable with a recovery action such as `retry`

#### Scenario: Non-retryable adapter failure
- **WHEN** an adapter failure represents a permanent or caller-fixable problem
- **THEN** the resulting AgentTK failure can classify the outcome as permanent or user-action-required
- **AND** it can surface a non-retry recovery action such as `abort` or `reauth`
