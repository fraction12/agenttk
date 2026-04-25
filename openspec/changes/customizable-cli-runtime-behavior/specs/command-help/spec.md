## ADDED Requirements

### Requirement: Custom help rendering
The system SHALL allow tools to customize human help output without replacing AgentTK help records.

#### Scenario: Tool help uses custom renderer
- **WHEN** a tool help result is rendered in human mode
- **AND** the tool defines `presentation.renderHelp`
- **THEN** the renderer receives the structured tool help record
- **AND** the runtime writes the returned human text to stdout

#### Scenario: Command help uses custom renderer
- **WHEN** a command help result is rendered in human mode
- **AND** the tool defines `presentation.renderHelp`
- **THEN** the renderer receives the structured command help record
- **AND** the runtime writes the returned human text to stdout

#### Scenario: Help JSON remains structured
- **WHEN** a help result is rendered in JSON mode
- **THEN** the runtime writes the structured help result as JSON
- **AND** custom human help renderers do not modify the payload
