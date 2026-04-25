## MODIFIED Requirements

### Requirement: Command dispatch
The system SHALL dispatch execution by command name from CLI arguments and provide configurable missing-command and unknown-command handling.

#### Scenario: Known command executes
- **WHEN** the tool is run with a registered command name
- **THEN** the matching command handler is invoked
- **AND** the remaining arguments are passed to the command as raw arguments
- **AND** parsed arguments are passed when the command defines an argument schema

#### Scenario: Alias command executes
- **WHEN** the tool is run with a registered command alias
- **THEN** the matching canonical command handler is invoked
- **AND** the remaining arguments are passed to the command as raw arguments

#### Scenario: Unknown command shows help by default
- **WHEN** the tool is run with a command name that is not registered
- **AND** the tool has not configured strict unknown-command behavior
- **THEN** the runtime returns the tool help result
- **AND** the output follows the same JSON or human rendering rules as explicit tool help

#### Scenario: Unknown command fails when configured
- **WHEN** the tool is run with a command name that is not registered
- **AND** the tool configures `unknownCommand` as `fail`
- **THEN** the runtime returns a structured failure with code `UNKNOWN_COMMAND`
- **AND** the failure message identifies the unknown command
- **AND** the failure does not require downstream tools to parse ad hoc strings to determine what happened

#### Scenario: Unknown command uses custom handler
- **WHEN** the tool is run with a command name that is not registered
- **AND** the tool defines `onUnknownCommand`
- **THEN** the runtime delegates unknown-command result creation to that handler
- **AND** the runtime still owns JSON mode and stdout/stderr rendering for the returned result

#### Scenario: Missing command shows help by default
- **WHEN** the tool is run without providing a command name
- **AND** the tool has not configured strict missing-command behavior
- **THEN** the runtime returns help for the tool
- **AND** downstream tools can still request stricter automation behavior independently

#### Scenario: Missing command fails when configured
- **WHEN** the tool is run without providing a command name
- **AND** the tool configures `missingCommand` as `fail`
- **THEN** the runtime returns a structured failure with code `UNKNOWN_COMMAND`
- **AND** the failure message states that no command was provided for the tool

### Requirement: Command execution context
The system SHALL provide a shared execution context to command handlers and runtime extension hooks.

#### Scenario: Context is available to handlers
- **WHEN** a command handler runs
- **THEN** it receives a context including the tool name, JSON output mode flag, stdout/stderr streams, presentation hooks, and runtime policy

#### Scenario: Context is available to render hooks
- **WHEN** a presentation render hook runs
- **THEN** it receives the same command context used by the runtime
- **AND** the hook can inspect JSON mode and tool identity without taking over dispatch

## ADDED Requirements

### Requirement: Human render hook integration
The system SHALL allow tools to customize human help, success, and failure presentation while preserving stable runtime behavior.

#### Scenario: Custom success renderer
- **WHEN** a command succeeds in human mode
- **AND** the tool defines `presentation.renderSuccess`
- **THEN** the runtime uses the rendered text for stdout
- **AND** the structured success result returned from `run` is unchanged

#### Scenario: Custom failure renderer
- **WHEN** a command fails in human mode
- **AND** the tool defines `presentation.renderFailure`
- **THEN** the runtime uses the rendered text for stderr
- **AND** the structured failure result returned from `run` is unchanged

#### Scenario: JSON mode bypasses human render hooks
- **WHEN** a command result is rendered in JSON mode
- **THEN** the runtime writes the structured result as JSON
- **AND** human presentation hooks do not alter the JSON payload
