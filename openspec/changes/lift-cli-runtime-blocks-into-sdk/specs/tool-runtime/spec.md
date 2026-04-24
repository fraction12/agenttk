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

#### Scenario: Unknown command shows tool help
- **WHEN** the tool is run with a command name that is not registered
- **THEN** the runtime returns tool help instead of a structured failure
- **AND** the help output includes the available commands so the user can recover without a second invocation

#### Scenario: Missing command shows tool help
- **WHEN** the tool is run without providing a command name
- **THEN** the runtime returns tool help instead of a structured failure
- **AND** the help output includes the available commands so the user can choose the next command

#### Scenario: High-level runtime executes command and emits output
- **WHEN** a downstream tool uses the high-level CLI runtime helper with a registered command
- **THEN** the runtime executes the command handler with the same raw-argument contract
- **AND** it emits the resulting envelope to stdout or stderr according to the success or failure outcome

### Requirement: Separate package consumption
The system SHALL be usable as a dependency from separate TypeScript CLI repositories.

#### Scenario: Import AgentTK from another repo
- **WHEN** a developer installs AgentTK in another TypeScript CLI repository
- **THEN** they can import the public runtime primitives from the package entrypoint
- **AND** they do not need to copy internal files from the AgentTK repo to build a tool

#### Scenario: Import higher-level runtime helpers from another repo
- **WHEN** a developer installs AgentTK in another TypeScript CLI repository
- **THEN** they can import the higher-level CLI runtime helpers from the public package surface
- **AND** they do not need to recreate dispatch, help, or output-emission glue in the downstream repository
