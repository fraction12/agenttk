# command-help Specification

## Purpose
TBD - created by archiving change add-command-help. Update Purpose after archive.
## Requirements
### Requirement: Tool help rendering
The system SHALL provide built-in help output for an AgentTK tool.

#### Scenario: Render tool help in human mode
- **WHEN** a tool is run with `help`, `--help`, or `-h`
- **THEN** AgentTK returns help for the tool instead of an unknown-command failure
- **AND** the output includes the tool name
- **AND** it includes the available commands with their descriptions when present

#### Scenario: Render tool help in JSON mode
- **WHEN** a tool help request is made in JSON mode
- **THEN** AgentTK returns a structured success payload describing the tool and its commands
- **AND** downstream automation does not need to scrape plain text help output

### Requirement: Command help rendering
The system SHALL provide built-in help output for a specific command.

#### Scenario: Render command help
- **WHEN** a tool is run with a known command followed by `--help` or `-h`
- **THEN** AgentTK returns help for that command instead of executing the handler
- **AND** the output includes the command name
- **AND** it includes the command description when present
- **AND** it includes usage and examples when present

### Requirement: Alias-aware dispatch
The system SHALL support command aliases.

#### Scenario: Alias resolves to canonical command
- **WHEN** a command defines one or more aliases
- **THEN** invoking an alias dispatches to the same handler as the canonical command
- **AND** help output identifies the canonical command name and aliases clearly

### Requirement: Narrow metadata scope
The system SHALL keep help metadata intentionally small.

#### Scenario: Metadata stays within the agreed v1 help scope
- **WHEN** command help is implemented
- **THEN** the metadata model supports only a narrow set such as descriptions, aliases, usage, and examples
- **AND** it does not require a broader plugin or argument-parser architecture

### Requirement: Risk-aware help output
The system SHALL surface command risk metadata in help output.

#### Scenario: Destructive command shows confirmation posture
- **WHEN** a command is marked as destructive and confirmation-required
- **THEN** command help and tool help can surface that posture without downstream tools hand-rolling custom help text

