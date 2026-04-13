## ADDED Requirements

### Requirement: Recovery metadata rendering
The system SHALL preserve recovery metadata in both JSON and human rendering modes.

#### Scenario: JSON rendering preserves recovery fields
- **WHEN** a command result with recovery metadata is rendered in JSON mode
- **THEN** the recovery fields are preserved exactly in the JSON envelope

#### Scenario: Human rendering surfaces recovery fields
- **WHEN** a command result with recovery metadata is rendered in human mode
- **THEN** the output shows recovery cues such as classification, retryability, and next action in a concise readable format
- **AND** those cues appear without requiring downstream tools to hand-roll presentation logic for common recovery cases
