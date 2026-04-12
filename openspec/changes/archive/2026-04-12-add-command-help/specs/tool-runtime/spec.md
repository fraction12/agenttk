## MODIFIED Requirements

### Requirement: Command dispatch
The system SHALL dispatch execution by command name from CLI arguments.

#### Scenario: Known command executes
- **WHEN** the tool is run with a registered command name
- **THEN** the matching command handler is invoked
- **AND** the remaining arguments are passed to the command as raw arguments

#### Scenario: Alias command executes
- **WHEN** the tool is run with a registered command alias
- **THEN** the matching canonical command handler is invoked
- **AND** the remaining arguments are passed to the command as raw arguments

#### Scenario: Unknown command fails predictably
- **WHEN** the tool is run with a command name that is not registered
- **THEN** the runtime returns a structured failure with code `UNKNOWN_COMMAND`
- **AND** the failure does not require downstream tools to parse ad hoc strings to determine what happened

#### Scenario: Missing command fails predictably
- **WHEN** the tool is run without providing a command name
- **THEN** the runtime returns a structured failure with code `UNKNOWN_COMMAND`
- **AND** the message states that no command was provided for the tool
