## ADDED Requirements

### Requirement: Verification rendering
The system SHALL preserve verification metadata in both JSON and human rendering modes.

#### Scenario: Human output surfaces verification status
- **WHEN** a command result includes verification metadata
- **THEN** human output renders verification status in a concise readable form
- **AND** downstream tools do not need to hand-roll display logic for verified versus unverified outcomes
