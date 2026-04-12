## ADDED Requirements

### Requirement: Id-or-query resolution helpers
The system SHALL provide reusable helpers for commands that resolve a record by explicit id or by query.

#### Scenario: Direct id resolves cleanly
- **WHEN** a downstream tool already has an explicit record id
- **THEN** AgentTK can treat that as a successful resolution path without requiring a search-specific error shape

#### Scenario: Query resolves to one candidate
- **WHEN** a downstream tool searches using a free-text query and finds exactly one matching candidate
- **THEN** AgentTK can return a successful resolution outcome with that candidate

### Requirement: Not-found outcome
The system SHALL provide a standard structured outcome for lookup misses.

#### Scenario: Query returns no candidates
- **WHEN** a downstream lookup returns zero candidates
- **THEN** AgentTK returns a structured failure with a predictable not-found code
- **AND** the failure may include guidance for how to broaden or inspect available records

### Requirement: Ambiguous-match outcome
The system SHALL provide a standard structured outcome for ambiguous matches.

#### Scenario: Query returns many plausible candidates
- **WHEN** a downstream lookup returns multiple plausible matches
- **THEN** AgentTK returns a structured ambiguity outcome
- **AND** the payload includes a compact candidate list that helps the caller choose safely
