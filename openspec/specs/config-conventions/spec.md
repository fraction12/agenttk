# config-conventions Specification

## Purpose
TBD - created by archiving change add-config-conventions. Update Purpose after archive.
## Requirements
### Requirement: Config loading conventions
The system SHALL provide reusable conventions for loading config in AgentTK-based tools.

#### Scenario: Load config from declared inputs
- **WHEN** a downstream CLI loads configuration from environment variables, local config objects, or profile selection
- **THEN** AgentTK provides a narrow helper pattern that keeps the loading path predictable

### Requirement: Config diagnostics
The system SHALL support structured diagnostics for missing or malformed config.

#### Scenario: Required config is missing
- **WHEN** a downstream tool cannot find a required config value
- **THEN** AgentTK returns a structured failure that identifies the missing config input
- **AND** the payload can include corrective guidance for how to provide it

#### Scenario: Config value is malformed
- **WHEN** a downstream tool finds a config value but it fails validation
- **THEN** AgentTK returns a structured diagnostic failure rather than an uncaught exception

### Requirement: Provider-agnostic profile conventions
The system SHALL support generic profile or account naming conventions.

#### Scenario: Tool selects a named profile
- **WHEN** a downstream CLI chooses among named profiles or accounts
- **THEN** AgentTK provides a reusable convention that does not depend on any single provider domain

