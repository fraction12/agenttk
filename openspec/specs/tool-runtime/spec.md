# tool-runtime Specification

## Purpose
TBD - created by archiving change add-agenttk-v0. Update Purpose after archive.
## Requirements
### Requirement: Tool creation and command registration
The system SHALL provide a runtime for defining a named tool with one or more registered commands.

#### Scenario: Create a tool with commands
- **WHEN** a developer defines an AgentTK tool with a name and a list of commands
- **THEN** the runtime stores that tool definition
- **AND** each command can be addressed by name during execution

#### Scenario: Define a command
- **WHEN** a developer defines a command with a name, optional description, and handler
- **THEN** the command is accepted as part of a tool definition without additional framework boilerplate

### Requirement: Command dispatch
The system SHALL dispatch execution by command name from CLI arguments.

#### Scenario: Known command executes
- **WHEN** the tool is run with a registered command name
- **THEN** the matching command handler is invoked
- **AND** the remaining arguments are passed to the command as raw arguments

#### Scenario: Alias command executes
- **WHEN** the tool is run with a registered command alias
- **THEN** the matching canonical command handler is invoked
- **AND** the remaining arguments are passed to the command as raw arguments

#### Scenario: Unknown command fails predictably
- **WHEN** the tool is run with a command name that is not registered
- **THEN** the runtime returns a structured failure with code `UNKNOWN_COMMAND`
- **AND** the failure does not require downstream tools to parse ad hoc strings to determine what happened

#### Scenario: Missing command fails predictably
- **WHEN** the tool is run without providing a command name
- **THEN** the runtime returns a structured failure with code `UNKNOWN_COMMAND`
- **AND** the message states that no command was provided for the tool

### Requirement: Command execution context
The system SHALL provide a shared execution context to command handlers.

#### Scenario: Context is available to handlers
- **WHEN** a command handler runs
- **THEN** it receives a context including the tool name, JSON output mode flag, and stdout/stderr streams

### Requirement: Stable success envelope
The system SHALL support a standard structured success envelope for command results.

#### Scenario: Successful command result
- **WHEN** a command succeeds
- **THEN** it can return an envelope containing `ok: true`
- **AND** it includes a `type` string
- **AND** it MAY include `destination`, `id`, `record`, `warnings`, and `dryRun`

#### Scenario: Success envelope is JSON-safe
- **WHEN** a success result is rendered in JSON mode
- **THEN** the payload preserves the envelope fields without human-only decoration

### Requirement: Stable failure envelope
The system SHALL support a standard structured failure envelope for command results.

#### Scenario: Adapter failures stay normalized
- **WHEN** a downstream command converts an adapter-layer failure into an AgentTK failure result
- **THEN** the failure envelope can preserve category and retryability hints without leaking raw provider response formats into the runtime contract

### Requirement: Separate package consumption
The system SHALL be usable as a dependency from separate TypeScript CLI repositories.

#### Scenario: Import AgentTK from another repo
- **WHEN** a developer installs AgentTK in another TypeScript CLI repository
- **THEN** they can import the public runtime primitives from the package entrypoint
- **AND** they do not need to copy internal files from the AgentTK repo to build a tool

### Requirement: First-class recovery metadata on command results
The system SHALL support first-class recovery metadata on AgentTK command result envelopes.

#### Scenario: Failure includes recovery metadata
- **WHEN** a downstream tool returns a failure outcome with recovery hints
- **THEN** the top-level failure envelope can include `nextAction`, `classification`, and `retryable`
- **AND** downstream automation does not need to scrape provider-specific details to understand the intended recovery lane

#### Scenario: Success can include follow-up recovery metadata
- **WHEN** a downstream tool returns a successful outcome that still requires a follow-up step
- **THEN** the success envelope can include the same recovery metadata fields without breaking the standard success contract

### Requirement: Mutation-safety metadata on command results
The system SHALL support first-class mutation-safety metadata on AgentTK command result envelopes.

#### Scenario: Write result includes replay-safety cues
- **WHEN** a downstream tool returns the result of a mutation command
- **THEN** the result can include `idempotencyKey`, `retrySafety`, `replayRisk`, and `partial`
- **AND** those fields remain available to downstream automation without parsing human text

### Requirement: Verification metadata on command results
The system SHALL support first-class verification metadata on AgentTK command result envelopes.

#### Scenario: Successful mutation result is unverified
- **WHEN** a downstream tool returns a mutation result that has not yet been read back and confirmed
- **THEN** the result can include `verified: false` and `verificationStatus: unverified`
- **AND** the recovery layer can point the agent toward `verify_state`

#### Scenario: Successful mutation result is verified
- **WHEN** a downstream tool confirms the intended post-mutation state
- **THEN** the result can include `verified: true` and `verificationStatus: verified`

### Requirement: Command risk metadata
The system SHALL support provider-agnostic risk metadata on AgentTK command definitions.

#### Scenario: Risk metadata appears in command help
- **WHEN** a downstream tool defines a command with risk metadata
- **THEN** the generated help records preserve that metadata so operators and agents can inspect the command posture before execution

