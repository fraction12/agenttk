## ADDED Requirements

### Requirement: Verification metadata on command results
The system SHALL support first-class verification metadata on AgentTK command result envelopes.

#### Scenario: Successful mutation result is unverified
- **WHEN** a downstream tool returns a mutation result that has not yet been read back and confirmed
- **THEN** the result can include `verified: false` and `verificationStatus: unverified`
- **AND** the recovery layer can point the agent toward `verify_state`

#### Scenario: Successful mutation result is verified
- **WHEN** a downstream tool confirms the intended post-mutation state
- **THEN** the result can include `verified: true` and `verificationStatus: verified`
