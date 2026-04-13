## ADDED Requirements

### Requirement: Command risk metadata
The system SHALL support provider-agnostic risk metadata on AgentTK command definitions.

#### Scenario: Risk metadata appears in command help
- **WHEN** a downstream tool defines a command with risk metadata
- **THEN** the generated help records preserve that metadata so operators and agents can inspect the command posture before execution
