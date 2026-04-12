## MODIFIED Requirements

### Requirement: Validation helpers
The system SHALL provide reusable validation helpers for command inputs.

#### Scenario: Config diagnostics reuse structured validation style
- **WHEN** a downstream tool validates environment or config inputs before command execution
- **THEN** AgentTK can return a structured failure with actionable guidance using the same predictable envelope style as other validation helpers
