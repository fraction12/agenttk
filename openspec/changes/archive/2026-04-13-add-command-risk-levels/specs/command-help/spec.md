## ADDED Requirements

### Requirement: Risk-aware help output
The system SHALL surface command risk metadata in help output.

#### Scenario: Destructive command shows confirmation posture
- **WHEN** a command is marked as destructive and confirmation-required
- **THEN** command help and tool help can surface that posture without downstream tools hand-rolling custom help text
