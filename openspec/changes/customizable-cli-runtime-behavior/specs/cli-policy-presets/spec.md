## ADDED Requirements

### Requirement: Agent-safe CLI defaults
The system SHALL provide a stable policy helper for strict agent-safe CLI defaults.

#### Scenario: Agent-safe defaults configure missing-command failure
- **WHEN** a tool applies `agentSafeDefaults`
- **THEN** the resulting tool configuration uses structured missing-command failure
- **AND** missing commands return code `UNKNOWN_COMMAND`

#### Scenario: Agent-safe defaults configure unknown-command failure
- **WHEN** a tool applies `agentSafeDefaults`
- **THEN** the resulting tool configuration uses structured unknown-command failure
- **AND** unknown commands return code `UNKNOWN_COMMAND`

#### Scenario: Agent-safe defaults preserve JSON flag
- **WHEN** a tool applies `agentSafeDefaults`
- **THEN** the resulting tool configuration uses the standard `--json` flag unless explicitly overridden by the tool

#### Scenario: Agent-safe defaults document failure output posture
- **WHEN** a tool applies `agentSafeDefaults`
- **THEN** the policy documents that human failures are written to stderr
- **AND** JSON mode remains machine-readable on stdout

#### Scenario: Agent-safe defaults are overridable
- **WHEN** a tool applies `agentSafeDefaults` with explicit overrides
- **THEN** explicit tool settings take precedence over preset defaults
- **AND** the resulting configuration remains a normal AgentTK tool definition
