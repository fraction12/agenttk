## ADDED Requirements

### Requirement: Standard auth failure helpers
The system SHALL provide reusable helpers for common authentication and authorization failure states.

#### Scenario: Unauthenticated command result
- **WHEN** a downstream tool determines that no valid authentication is present
- **THEN** AgentTK returns a structured failure with an auth-specific error code
- **AND** the failure can include corrective guidance for reauthentication

#### Scenario: Wrong account or tenant
- **WHEN** a downstream tool detects that the current account or tenant is not the expected one
- **THEN** AgentTK returns a structured auth-related failure
- **AND** the payload can include the current and expected account identifiers when provided

### Requirement: Auth preflight contract
The system SHALL support a narrow contract for auth checks before command execution proceeds.

#### Scenario: Command gates on auth check
- **WHEN** a downstream command invokes an AgentTK auth preflight helper
- **THEN** the helper can short-circuit with a structured auth failure
- **AND** the command does not need to hand-roll the envelope shape

### Requirement: JSON-safe auth payloads
The system SHALL preserve auth failure details in JSON mode.

#### Scenario: Auth failure in JSON mode
- **WHEN** an auth-related failure is rendered in JSON mode
- **THEN** the output remains structured and machine-readable
- **AND** downstream automation does not need to scrape human text for repair guidance
