## MODIFIED Requirements

### Requirement: Corrective guidance in validation failures
The system SHALL support validation failures that include corrective guidance.

#### Scenario: Lookup failures point to the next narrowing step
- **WHEN** a resolution helper returns a not-found or ambiguous-match outcome
- **THEN** AgentTK can surface next-step guidance such as listing records or retrying with an explicit id
- **AND** the guidance remains concise in human mode and structured in JSON mode
