# command-blocks Specification

## Purpose
The **command-blocks** specification defines the reusable helper blocks that AgentTK exposes for common CLI command concerns. These blocks cover:

- raw argument inspection
- validation and corrective guidance
- lookup resolution outcomes
- human and JSON result rendering
- dry-run annotation
- recovery, mutation-safety, and verification presentation
- structured confirmation-required failures for risky commands

The goal of these blocks is to let downstream tools compose predictable command behavior without rewriting common result, rendering, and guardrail patterns.

## Requirements

### Requirement: Raw argument helpers
The system SHALL provide reusable helpers for inspecting raw CLI argument arrays.

#### Scenario: Detect a flag in raw arguments
- **WHEN** a downstream tool checks raw arguments for a known flag or list of flags
- **THEN** AgentTK can return whether any matching flag is present

#### Scenario: Read the first positional argument
- **WHEN** a downstream tool needs the first positional value from raw arguments
- **THEN** AgentTK can skip known flags
- **AND** it can skip the value belonging to any known flag that consumes a value
- **AND** it returns the first non-flag positional argument when present

### Requirement: Validation helpers
The system SHALL provide reusable validation helpers for command inputs.

#### Scenario: Schema validation returns parsed input
- **WHEN** a downstream tool validates input with a schema and the input is valid
- **THEN** AgentTK returns the parsed value

#### Scenario: Schema validation returns structured failure
- **WHEN** a downstream tool validates input with a schema and the input is invalid
- **THEN** AgentTK returns a structured `VALIDATION_ERROR` failure
- **AND** the failure can include recovery metadata

#### Scenario: Config diagnostics reuse structured validation style
- **WHEN** a downstream tool validates environment or config inputs before command execution
- **THEN** AgentTK can return a structured failure with actionable guidance using the same predictable envelope style as other validation helpers

### Requirement: Corrective guidance in validation failures
The system SHALL support validation failures that include corrective guidance.

#### Scenario: Validation failures include expected payload guidance
- **WHEN** a downstream tool wants to describe the expected payload shape
- **THEN** AgentTK can include that guidance in the failure message

#### Scenario: Validation failures include next-step guidance
- **WHEN** a downstream tool wants to point the operator at the next corrective step
- **THEN** AgentTK can include that guidance in the failure message

#### Scenario: Lookup failures point to the next narrowing step
- **WHEN** a resolution helper returns a not-found or ambiguous-match outcome
- **THEN** AgentTK can surface next-step guidance such as listing records or retrying with an explicit id
- **AND** the guidance remains concise in human mode and structured in JSON mode

### Requirement: Lookup resolution helpers
The system SHALL provide reusable helpers for returning lookup resolution outcomes.

#### Scenario: Resolve by explicit id
- **WHEN** a downstream tool has an explicit id match
- **THEN** AgentTK can return a successful resolution with strategy `id`

#### Scenario: Resolve by query
- **WHEN** a downstream tool has a single query match
- **THEN** AgentTK can return a successful resolution with strategy `query`

#### Scenario: Resolve one returns not-found guidance
- **WHEN** a downstream tool attempts to resolve one candidate and no candidates match
- **THEN** AgentTK can return a structured `NOT_FOUND` failure with query and next-step details

#### Scenario: Resolve one returns ambiguous-match guidance
- **WHEN** a downstream tool attempts to resolve one candidate and multiple candidates match
- **THEN** AgentTK can return a structured `AMBIGUOUS_MATCH` failure
- **AND** the failure can include a compact list of candidate summaries

### Requirement: Output rendering for JSON mode
The system SHALL render command results as structured JSON when JSON mode is enabled.

#### Scenario: Success renders as JSON
- **WHEN** a command result is rendered with JSON mode enabled
- **THEN** the exact structured success envelope is written to stdout as formatted JSON

#### Scenario: Failure renders as JSON
- **WHEN** a failed command result is rendered with JSON mode enabled
- **THEN** the exact structured failure envelope is written to stdout as formatted JSON
- **AND** the output remains machine-readable without requiring downstream parsers to strip presentation text

### Requirement: Output rendering for human mode
The system SHALL render concise human-readable output when JSON mode is disabled.

#### Scenario: Human success output includes receipt details
- **WHEN** a successful result is rendered in human mode
- **THEN** the output includes the result type
- **AND** it includes the id when present
- **AND** it includes the destination when present

#### Scenario: Human success output reflects dry-run posture
- **WHEN** a successful result is marked as a dry run
- **THEN** the human output begins with `Dry run` instead of `Saved`

#### Scenario: Human output shows warnings
- **WHEN** a successful result contains warnings
- **THEN** the warnings are surfaced in human mode rather than silently dropped

#### Scenario: Human output renders simple record fields
- **WHEN** a successful result contains an object record
- **THEN** AgentTK renders primitive record fields in human mode
- **AND** nested object values are omitted by default

#### Scenario: Human output can use configured record field order
- **WHEN** a tool provides record field presentation settings
- **THEN** AgentTK renders only those configured fields in the declared order
- **AND** it uses configured labels when present

#### Scenario: Human output can use a record formatter hook
- **WHEN** a tool provides a record formatting function
- **THEN** AgentTK renders the formatter output instead of the default record-field presentation

#### Scenario: Human failure output is actionable
- **WHEN** a failed result is rendered in human mode
- **THEN** the output includes the error code and message in a concise actionable format

#### Scenario: Human failures render on stderr
- **WHEN** a failed result is rendered in human mode
- **THEN** the rendered output is written to stderr

#### Scenario: Human successes render on stdout
- **WHEN** a successful result is rendered in human mode
- **THEN** the rendered output is written to stdout

### Requirement: Dry-run support
The system SHALL provide a reusable dry-run helper for successful results.

#### Scenario: Dry-run marks successful result
- **WHEN** a successful command result is wrapped as a dry run
- **THEN** the returned success envelope includes `dryRun: true`
- **AND** all other success fields remain intact

#### Scenario: Dry-run does not rewrite failures
- **WHEN** a failed command result is passed through the dry-run helper
- **THEN** the original failure is returned unchanged

### Requirement: Recovery metadata rendering
The system SHALL preserve recovery metadata in both JSON and human rendering modes.

#### Scenario: JSON rendering preserves recovery fields
- **WHEN** a command result with recovery metadata is rendered in JSON mode
- **THEN** the recovery fields are preserved exactly in the JSON envelope

#### Scenario: Human rendering surfaces recovery fields
- **WHEN** a command result with recovery metadata is rendered in human mode
- **THEN** the output shows recovery cues such as classification, retryability, and next action in a concise readable format
- **AND** those cues appear without requiring downstream tools to hand-roll presentation logic for common recovery cases

### Requirement: Mutation-safety rendering
The system SHALL preserve mutation-safety metadata in both JSON and human rendering modes.

#### Scenario: Human output surfaces mutation-safety metadata
- **WHEN** a command result includes mutation-safety metadata
- **THEN** human output renders those cues in a concise readable form
- **AND** operators can see whether replay should be safe, verify-first, or avoided

### Requirement: Verification rendering
The system SHALL preserve verification metadata in both JSON and human rendering modes.

#### Scenario: Human output surfaces verification status
- **WHEN** a command result includes verification metadata
- **THEN** human output renders verification status in a concise readable form
- **AND** downstream tools do not need to hand-roll display logic for verified versus unverified outcomes

### Requirement: Structured confirmation-required failures
The system SHALL support a structured failure for risky commands that require confirmation before execution.

#### Scenario: Risky command is not confirmed
- **WHEN** a downstream tool requires confirmation for a risky command and confirmation is not present
- **THEN** AgentTK can return a structured `CONFIRMATION_REQUIRED` failure
- **AND** the failure can preserve risk level, confirmation posture, reason, and next-step guidance in a reusable format

### Requirement: Current block surface
The system SHALL expose a broader reusable block surface than the initial v0-only core helpers.

#### Scenario: Exported blocks include specialized helpers
- **WHEN** a downstream tool imports AgentTK blocks from the package entrypoint
- **THEN** it can use argument, validation, output, dry-run, lookup, risk, adapter, auth, and config helpers from the current public surface
