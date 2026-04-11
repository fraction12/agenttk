# command-blocks Specification

## Purpose
TBD - created by archiving change add-agenttk-v0. Update Purpose after archive.
## Requirements
### Requirement: Validation helpers
The system SHALL provide reusable validation helpers for command inputs.

#### Scenario: Valid input passes through
- **WHEN** a command validates input against a declared schema and the input is valid
- **THEN** the helper returns the typed parsed value

#### Scenario: Invalid input returns a structured validation failure
- **WHEN** a command validates input against a declared schema and the input is invalid
- **THEN** the helper returns a structured failure with code `VALIDATION_ERROR`
- **AND** the failure message describes the validation problem without throwing an uncaught exception into the caller

### Requirement: Corrective guidance in validation failures
The system SHALL support validation failures that include corrective guidance.

#### Scenario: Validation error includes expected shape
- **WHEN** a caller submits malformed JSON or the wrong object shape to a command
- **THEN** AgentTK can return a validation failure that includes an example or expected payload shape in the error message

#### Scenario: Validation error points to the next action
- **WHEN** a caller omits a required value that must be looked up first
- **THEN** AgentTK can return a validation failure that includes the next command or lookup step needed to correct the input

### Requirement: Output rendering for JSON mode
The system SHALL render command results as structured JSON when JSON mode is enabled.

#### Scenario: Success renders as JSON
- **WHEN** a command result is rendered with JSON mode enabled
- **THEN** the exact structured success envelope is written to stdout as formatted JSON

#### Scenario: Failure renders as JSON
- **WHEN** a failed command result is rendered with JSON mode enabled
- **THEN** the exact structured failure envelope is written as formatted JSON
- **AND** the output remains machine-readable without requiring downstream parsers to strip presentation text

### Requirement: Output rendering for human mode
The system SHALL render concise human-readable output when JSON mode is disabled.

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

### Requirement: Dry-run support
The system SHALL provide a reusable dry-run helper for successful mutation results.

#### Scenario: Dry-run marks successful result
- **WHEN** a successful command result is wrapped as a dry run
- **THEN** the returned success envelope includes `dryRun: true`
- **AND** all other success fields remain intact

#### Scenario: Dry-run does not rewrite failures
- **WHEN** a failed command result is passed through the dry-run helper
- **THEN** the original failure is returned unchanged

### Requirement: V0 scope boundaries
The system SHALL keep the v0 block set intentionally narrow.

#### Scenario: V0 excludes non-core blocks
- **WHEN** AgentTK v0 is implemented
- **THEN** it does not require built-in auth doctor, provenance helpers, lookup resolution, plugin loading, or workflow composition to satisfy the v0 contract

