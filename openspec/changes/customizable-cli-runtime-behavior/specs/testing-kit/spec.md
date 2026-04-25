## ADDED Requirements

### Requirement: Golden-path CLI behavior assertions
The system SHALL provide lightweight helpers for asserting full AgentTK CLI behavior in tests.

#### Scenario: Assert JSON CLI output
- **WHEN** a test runs an AgentTK tool with CLI arguments through `expectCli`
- **THEN** the helper can assert the rendered stdout parses as JSON matching an expected shape
- **AND** the command result remains available for structured assertions

#### Scenario: Assert stdout output
- **WHEN** a test runs an AgentTK tool with CLI arguments through `expectCli`
- **THEN** the helper can assert the captured stdout exactly or partially matches expected text
- **AND** stderr remains separately available

#### Scenario: Assert stderr output
- **WHEN** a test runs an AgentTK tool with CLI arguments through `expectCli`
- **THEN** the helper can assert the captured stderr exactly or partially matches expected text
- **AND** stdout remains separately available

#### Scenario: Assert failure code
- **WHEN** a test runs a failing AgentTK CLI command through `expectCli`
- **THEN** the helper can assert the structured failure code
- **AND** the assertion does not require parsing human output

#### Scenario: Snapshot-friendly output
- **WHEN** a test framework supports snapshots
- **THEN** the helper exposes stable captured stdout, stderr, JSON, and result values suitable for snapshot assertions
