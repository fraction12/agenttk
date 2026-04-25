## ADDED Requirements

### Requirement: Command argument schema
The system SHALL allow commands to define typed CLI argument schemas.

#### Scenario: Required positional argument parses
- **WHEN** a command defines a required positional argument
- **AND** the CLI invocation provides that positional value
- **THEN** the command handler receives the value by positional name in parsed args
- **AND** the original raw args remain available

#### Scenario: Missing required positional fails
- **WHEN** a command defines a required positional argument
- **AND** the CLI invocation omits that value
- **THEN** the runtime returns an `INVALID_INPUT` failure before invoking the handler
- **AND** the failure details identify the missing argument

#### Scenario: Boolean flag parses aliases
- **WHEN** a command defines a boolean flag with aliases
- **AND** the CLI invocation includes any alias
- **THEN** the command handler receives `true` for that flag name

#### Scenario: String flag parses value
- **WHEN** a command defines a string flag
- **AND** the CLI invocation includes the flag followed by a value
- **THEN** the command handler receives that value by flag name

#### Scenario: String array flag parses repeated values
- **WHEN** a command defines a string-array flag
- **AND** the CLI invocation includes the flag more than once
- **THEN** the command handler receives all provided values by flag name

#### Scenario: Unknown flag fails
- **WHEN** a command has an argument schema
- **AND** the CLI invocation includes a flag not defined by that schema
- **THEN** the runtime returns an `INVALID_INPUT` failure before invoking the handler
- **AND** the failure details identify the unknown flag

### Requirement: Parser scope boundaries
The system SHALL keep built-in CLI argument parsing intentionally lightweight.

#### Scenario: Shell parsing remains external
- **WHEN** a command receives argv values
- **THEN** AgentTK parses the provided argv tokens
- **AND** AgentTK does not attempt shell quoting or command-line string tokenization

#### Scenario: Raw arg helpers remain available
- **WHEN** a command does not define an argument schema
- **THEN** the command continues to receive raw args
- **AND** existing helpers such as `firstPositional` and `hasFlag` remain usable
