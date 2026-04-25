## MODIFIED Requirements

### Requirement: Output rendering for human mode
The system SHALL render concise human-readable output when JSON mode is disabled and SHALL allow tools to override human presentation through render hooks.

#### Scenario: Human success output includes receipt details
- **WHEN** a successful result is rendered in human mode
- **THEN** the output includes the result type
- **AND** it includes the id when present
- **AND** it includes the destination when present

#### Scenario: Human output shows warnings
- **WHEN** a successful result contains warnings
- **THEN** the warnings are surfaced in human mode rather than silently dropped

#### Scenario: Human failure output is actionable
- **WHEN** a failed result is rendered in human mode
- **THEN** the output includes the error code and message in a concise actionable format

#### Scenario: Human render hook overrides built-in success output
- **WHEN** a successful result is rendered in human mode
- **AND** the tool defines a success render hook
- **THEN** the hook output is written instead of the built-in human success format
- **AND** warnings and metadata remain available in the result object for the hook to include

#### Scenario: Human render hook overrides built-in failure output
- **WHEN** a failed result is rendered in human mode
- **AND** the tool defines a failure render hook
- **THEN** the hook output is written instead of the built-in human failure format
- **AND** the runtime still writes failures to stderr

## ADDED Requirements

### Requirement: Nested record field presentation
The system SHALL support record presentation fields that read nested values from successful result records.

#### Scenario: Nested field renders by path
- **WHEN** a successful result record contains nested data
- **AND** presentation record fields include a dotted `path`
- **THEN** human output renders the nested value with the configured label

#### Scenario: Field formatter renders nested value
- **WHEN** a presentation field defines a formatter
- **THEN** the formatter receives the selected nested value, record, and result
- **AND** the formatted value is rendered in human output

#### Scenario: Missing nested field is skipped
- **WHEN** a presentation field path does not exist in the result record
- **THEN** the field is omitted from built-in human output
- **AND** rendering continues for other fields

### Requirement: Custom domain error codes in result helpers
The system SHALL document and support domain-specific error-code overrides in reusable result helpers.

#### Scenario: Invalid input uses domain code
- **WHEN** a tool creates an invalid-input result with a custom code
- **THEN** the returned failure preserves the custom code
- **AND** the result still uses the stable AgentTK failure envelope

#### Scenario: Operational failure uses domain code
- **WHEN** a tool creates an operational-failure result with a custom code
- **THEN** the returned failure preserves the custom code
- **AND** the result can still include recovery metadata and details

#### Scenario: Documentation blesses code overrides
- **WHEN** a downstream agent needs tool-specific failures such as `UNSUPPORTED_CONTENT`, `VERIFY_FAILED`, or `VIEWER_LAUNCH_FAILED`
- **THEN** AgentTK documentation identifies helper code overrides as the preferred path
- **AND** the agent does not need to bypass result helpers to keep domain codes
