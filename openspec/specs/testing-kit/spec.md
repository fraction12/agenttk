# testing-kit Specification

## Purpose
TBD - created by archiving change add-agenttk-v0. Update Purpose after archive.
## Requirements
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

### Requirement: Rich primitive-aware testing helpers
The system SHALL provide lightweight testing helpers for AgentTK-based CLIs.

#### Scenario: Framework primitives have matching test helpers
- **WHEN** AgentTK introduces reusable primitives such as auth blocks, lookup resolution, dry-run helpers, or adapter contracts
- **THEN** the testing kit can expose matching lightweight fixtures or assertions
- **AND** downstream tools do not need to rebuild the same harness patterns repeatedly

#### Scenario: Data-first testing remains possible
- **WHEN** a downstream developer uses the richer testing kit helpers
- **THEN** they can still test command behavior through explicit inputs and outputs
- **AND** the testing kit does not require a heavyweight integration framework or snapshot system

### Requirement: Mutation-safety assertions
The system SHALL provide reusable testing assertions for mutation-safety metadata.

#### Scenario: Downstream tool tests replay safety
- **WHEN** a downstream tool test checks a result produced by a mutation command
- **THEN** AgentTK can assert mutation-safety fields such as replay risk, retry safety, partial state, and idempotency key without custom test helpers

### Requirement: Verification assertions
The system SHALL provide reusable testing assertions for verification metadata.

#### Scenario: Downstream tool tests verification state
- **WHEN** a downstream tool test checks whether a mutation result was verified
- **THEN** AgentTK can assert `verified` and `verificationStatus` directly without custom test helpers

### Requirement: Exported agent-safe review checklist
The system SHALL export the canonical agent-safe CLI checklist for downstream review and release workflows.

#### Scenario: Downstream repo consumes checklist
- **WHEN** a downstream CLI repo imports the checklist from AgentTK
- **THEN** it can use the exported checklist as a stable review bar for PRs, audits, or release gates
- **AND** the checklist reflects the framework-level capabilities established by recovery, mutation safety, and command risk posture

