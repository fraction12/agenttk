## ADDED Requirements

### Requirement: Copyable CLI examples
The system SHALL provide a small set of copyable example CLIs that demonstrate the highest-leverage AgentTK patterns.

#### Scenario: Minimal CLI example
- **WHEN** a downstream agent needs the smallest useful AgentTK CLI
- **THEN** the examples include a minimal CLI with one command and `runToolCli`

#### Scenario: Strict rich-output CLI example
- **WHEN** a downstream agent needs strict automation behavior with custom human presentation
- **THEN** the examples include a CLI that demonstrates strict missing-command and unknown-command failure plus help, success, and failure render hooks

#### Scenario: Mutating locked CLI example
- **WHEN** a downstream agent needs a write command with dry-run behavior and runtime locking
- **THEN** the examples include a mutating CLI that demonstrates dry-run, mutation-safety metadata, and lock handling
