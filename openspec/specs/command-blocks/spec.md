# command-blocks Specification

## Purpose
TBD - created by archiving change add-agenttk-v0. Update Purpose after archive.
## Requirements
### Requirement: Validation helpers
The system SHALL provide reusable validation helpers for command inputs.

#### Scenario: Config diagnostics reuse structured validation style
- **WHEN** a downstream tool validates environment or config inputs before command execution
- **THEN** AgentTK can return a structured failure with actionable guidance using the same predictable envelope style as other validation helpers

### Requirement: Corrective guidance in validation failures
The system SHALL support validation failures that include corrective guidance.

#### Scenario: Lookup failures point to the next narrowing step
- **WHEN** a resolution helper returns a not-found or ambiguous-match outcome
- **THEN** AgentTK can surface next-step guidance such as listing records or retrying with an explicit id
- **AND** the guidance remains concise in human mode and structured in JSON mode

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
- **AND** the failure can preserve risk level, confirmation posture, and next-step guidance in a reusable format

