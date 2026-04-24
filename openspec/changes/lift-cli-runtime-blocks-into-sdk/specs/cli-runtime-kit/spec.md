## ADDED Requirements

### Requirement: High-level CLI runtime helper
The system SHALL provide a high-level runtime helper that executes a tool definition from CLI arguments without downstream tools hand-rolling dispatch and output plumbing.

#### Scenario: Runtime handles tool help
- **WHEN** a tool is run through the high-level runtime helper with `help`, `--help`, or `-h`
- **THEN** the runtime returns tool help instead of an unknown-command failure
- **AND** it emits the result in JSON or human mode according to the runtime context

#### Scenario: Runtime handles command execution and emission
- **WHEN** a tool is run through the high-level runtime helper with a known command
- **THEN** the matching handler is invoked with raw arguments
- **AND** the resulting success or failure envelope is emitted to the correct stream without downstream emission glue

#### Scenario: Runtime handles unknown commands with tool help
- **WHEN** a tool is run through the high-level runtime helper with an unregistered command
- **THEN** the runtime returns tool help instead of a structured `UNKNOWN_COMMAND` failure
- **AND** downstream tools do not need to implement their own unknown-command help flow

### Requirement: Lightweight raw-argument helpers
The system SHALL provide lightweight helpers for common raw-argument parsing patterns without requiring a full parser framework.

#### Scenario: Boolean flag is detected
- **WHEN** a downstream command checks raw arguments for one or more known flags
- **THEN** AgentTK can report whether the flag is present without the command hand-rolling array scans

#### Scenario: First positional value is extracted
- **WHEN** a downstream command needs the first positional argument while ignoring known flags
- **THEN** AgentTK can return that positional value predictably without requiring a third-party parser

### Requirement: Simple record presentation hooks
The system SHALL support lightweight presentation hooks for rendering common success and failure output in human mode.

#### Scenario: Tool renders simple record fields without custom formatter
- **WHEN** a command result includes a record and the tool configures ordered display fields
- **THEN** AgentTK renders those fields in human mode using a stable concise key/value layout
- **AND** the JSON envelope remains unchanged

#### Scenario: Tool can override record presentation lightly
- **WHEN** a downstream tool needs minor presentation customization for a result record
- **THEN** AgentTK allows a small formatting hook without requiring the tool to replace the entire runtime path
