# Testing Kit

## ADDED Requirements

### Requirement: Tool execution test helper
The system SHALL provide a helper that runs an AgentTK tool definition with CLI arguments in tests.

#### Scenario: Run a tool in a test
- **WHEN** a test invokes the helper with a tool definition and argument list
- **THEN** the helper runs the tool without spawning an external shell process
- **AND** it returns the command result along with captured stdout and stderr

### Requirement: Output capture
The system SHALL capture stdout and stderr separately for test assertions.

#### Scenario: Success capture
- **WHEN** a test runs a successful command
- **THEN** stdout contains the rendered success output
- **AND** stderr remains available separately for assertions

#### Scenario: Failure capture
- **WHEN** a test runs a failed command
- **THEN** stderr contains the rendered failure output in human mode
- **AND** stdout remains available separately for assertions

### Requirement: Structured result assertions
The system SHALL provide lightweight assertions for structured success and failure results.

#### Scenario: Assert success result
- **WHEN** a test receives a successful command result
- **THEN** AgentTK provides a helper that can assert the result is successful

#### Scenario: Assert failure code
- **WHEN** a test receives a failed command result
- **THEN** AgentTK provides a helper that can assert the failure code

### Requirement: Simple fake implementations for tests
The system SHALL support simple fake implementations for adapter-like dependencies in tests.

#### Scenario: Fake dependency object
- **WHEN** a test needs a simple fake dependency object
- **THEN** AgentTK provides a helper that returns the passed implementation without extra runtime behavior
- **AND** the helper makes fake dependencies explicit and readable in tests

### Requirement: V0 testing scope boundaries
The system SHALL keep the testing helpers lightweight in v0.

#### Scenario: V0 excludes full end-to-end orchestration
- **WHEN** AgentTK v0 is implemented
- **THEN** the testing kit does not require live UAT runners, network recording, snapshot orchestration, or process-level CLI spawning to satisfy the v0 contract
