## ADDED Requirements

### Requirement: Mutation-safety rendering
The system SHALL preserve mutation-safety metadata in both JSON and human rendering modes.

#### Scenario: Human output surfaces mutation-safety metadata
- **WHEN** a command result includes mutation-safety metadata
- **THEN** human output renders those cues in a concise readable form
- **AND** operators can see whether replay should be safe, verify-first, or avoided
