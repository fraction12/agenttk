## MODIFIED Requirements

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

#### Scenario: Human output can include simple record fields
- **WHEN** a successful result includes a record and the tool configures ordered display fields
- **THEN** AgentTK renders those fields in a stable concise key/value layout
- **AND** downstream tools do not need to hand-roll basic record formatting

### Requirement: Recovery metadata rendering
The system SHALL preserve recovery metadata in both JSON and human rendering modes.

#### Scenario: JSON rendering preserves recovery fields
- **WHEN** a command result with recovery metadata is rendered in JSON mode
- **THEN** the recovery fields are preserved exactly in the JSON envelope

#### Scenario: Human rendering surfaces recovery fields
- **WHEN** a command result with recovery metadata is rendered in human mode
- **THEN** the output shows recovery cues such as classification, retryability, and next action in a concise readable format
- **AND** those cues appear without requiring downstream tools to hand-roll presentation logic for common recovery cases

### Requirement: Verification rendering
The system SHALL preserve verification metadata in both JSON and human rendering modes.

#### Scenario: Human output surfaces verification status
- **WHEN** a command result includes verification metadata
- **THEN** human output renders verification status in a concise readable form
- **AND** downstream tools do not need to hand-roll display logic for verified versus unverified outcomes

### Requirement: Common result helper factories
The system SHALL provide reusable helper factories for common command result patterns.

#### Scenario: Invalid input helper returns structured failure
- **WHEN** a downstream tool needs to return a user-fixable input failure
- **THEN** AgentTK can create a structured failure with the expected code, message, recovery classification, and next action without the tool hand-rolling the full envelope

#### Scenario: Locked or busy helper returns retryable failure
- **WHEN** a downstream tool is temporarily blocked by a lock or busy runtime
- **THEN** AgentTK can create a retryable structured failure with the expected recovery metadata without the tool hand-rolling the full envelope

#### Scenario: Verification-aware mutation helper returns unverified success
- **WHEN** a downstream tool completes a mutation but still requires follow-up verification
- **THEN** AgentTK can return a success envelope marked unverified with the expected recovery metadata without the tool hand-rolling the full envelope
