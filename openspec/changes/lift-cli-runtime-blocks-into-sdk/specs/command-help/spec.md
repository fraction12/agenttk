## MODIFIED Requirements

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

#### Scenario: High-level runtime emits tool help without downstream glue
- **WHEN** a downstream tool uses the high-level CLI runtime helper and a tool help request is made
- **THEN** AgentTK emits the help result directly in JSON or human mode
- **AND** the downstream tool does not need custom help-dispatch code

### Requirement: Command help rendering
The system SHALL provide built-in help output for a specific command.

#### Scenario: Render command help
- **WHEN** a tool is run with a known command followed by `--help` or `-h`
- **THEN** AgentTK returns help for that command instead of executing the handler
- **AND** the output includes the command name
- **AND** it includes the command description when present
- **AND** it includes usage and examples when present

#### Scenario: High-level runtime emits command help without downstream glue
- **WHEN** a downstream tool uses the high-level CLI runtime helper and a command help request is made
- **THEN** AgentTK emits the command help result directly in JSON or human mode
- **AND** the downstream tool does not need custom command-help dispatch code
