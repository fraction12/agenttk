## ADDED Requirements

### Requirement: Mutation-safety assertions
The system SHALL provide reusable testing assertions for mutation-safety metadata.

#### Scenario: Downstream tool tests replay safety
- **WHEN** a downstream tool test checks a result produced by a mutation command
- **THEN** AgentTK can assert mutation-safety fields such as replay risk, retry safety, partial state, and idempotency key without custom test helpers
