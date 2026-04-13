## ADDED Requirements

### Requirement: Structured confirmation-required failures
The system SHALL support a structured failure for risky commands that require confirmation before execution.

#### Scenario: Risky command is not confirmed
- **WHEN** a downstream tool requires confirmation for a risky command and confirmation is not present
- **THEN** AgentTK can return a structured `CONFIRMATION_REQUIRED` failure
- **AND** the failure can preserve risk level, confirmation posture, and next-step guidance in a reusable format
