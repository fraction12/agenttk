## ADDED Requirements

### Requirement: Command lifecycle hooks
The system SHALL provide lifecycle hooks for cross-cutting command behavior.

#### Scenario: Before-command hook runs before handler
- **WHEN** a tool defines a `beforeCommand` hook
- **AND** a known command is invoked
- **THEN** the hook runs after command resolution and argument parsing
- **AND** the command handler runs only after the hook completes successfully

#### Scenario: Before-command hook aborts with result
- **WHEN** a tool defines a `beforeCommand` hook
- **AND** the hook returns a command result
- **THEN** the command handler is not invoked
- **AND** the runtime renders the hook result through normal output handling

#### Scenario: After-command hook observes result
- **WHEN** a tool defines an `afterCommand` hook
- **AND** a command handler returns a result
- **THEN** the hook receives the command event and result
- **AND** the runtime renders the final result after the hook completes

#### Scenario: After-command hook replaces result
- **WHEN** a tool defines an `afterCommand` hook
- **AND** the hook returns a command result
- **THEN** the runtime uses that result as the final command result
- **AND** the replacement result is rendered through normal output handling

#### Scenario: Error hook maps thrown errors
- **WHEN** a command handler or lifecycle hook throws
- **AND** a tool defines an `onError` hook
- **THEN** the hook can convert the thrown error into a structured command result
- **AND** the runtime renders that result through normal output handling

#### Scenario: Parser failures bypass error hook
- **WHEN** argument parsing returns a structured `INVALID_INPUT` failure
- **AND** a tool defines an `onError` hook
- **THEN** the error hook is not invoked
- **AND** the parser failure is rendered through normal output handling

### Requirement: Composable runtime wrappers
The system SHALL provide small wrapper helpers for common lifecycle patterns.

#### Scenario: Lock wrapper releases on success
- **WHEN** a command is wrapped with `withLock`
- **AND** the wrapped handler succeeds
- **THEN** the configured lock is acquired before execution
- **AND** the lock is released after execution

#### Scenario: Lock wrapper releases on failure
- **WHEN** a command is wrapped with `withLock`
- **AND** the wrapped handler fails or throws
- **THEN** the lock is released before the result or mapped error is returned

#### Scenario: Telemetry wrapper observes outcome
- **WHEN** a command is wrapped with `withTelemetry`
- **THEN** the telemetry callback can observe command start and completion
- **AND** the callback receives success or failure state without changing the structured result by default
