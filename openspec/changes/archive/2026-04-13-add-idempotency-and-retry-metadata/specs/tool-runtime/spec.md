## ADDED Requirements

### Requirement: Mutation-safety metadata on command results
The system SHALL support first-class mutation-safety metadata on AgentTK command result envelopes.

#### Scenario: Write result includes replay-safety cues
- **WHEN** a downstream tool returns the result of a mutation command
- **THEN** the result can include `idempotencyKey`, `retrySafety`, `replayRisk`, and `partial`
- **AND** those fields remain available to downstream automation without parsing human text
