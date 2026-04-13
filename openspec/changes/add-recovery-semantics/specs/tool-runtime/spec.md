## ADDED Requirements

### Requirement: First-class recovery metadata on command results
The system SHALL support first-class recovery metadata on AgentTK command result envelopes.

#### Scenario: Failure includes recovery metadata
- **WHEN** a downstream tool returns a failure outcome with recovery hints
- **THEN** the top-level failure envelope can include `nextAction`, `classification`, and `retryable`
- **AND** downstream automation does not need to scrape provider-specific details to understand the intended recovery lane

#### Scenario: Success can include follow-up recovery metadata
- **WHEN** a downstream tool returns a successful outcome that still requires a follow-up step
- **THEN** the success envelope can include the same recovery metadata fields without breaking the standard success contract
