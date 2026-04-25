# tool-runtime Specification

## Purpose
The **tool-runtime** specification defines a runtime for creating and executing tools with named commands in AgentTK. It provides a structured way to:

- Define tools and commands with minimal boilerplate.
- Dispatch commands by name from CLI arguments.
- Handle success and failure outcomes with structured envelopes.
- Attach recovery, mutation-safety, verification, and risk metadata to command results.

This specification ensures that tools are portable, predictable, and interoperable across the AgentTK ecosystem.

## Requirements

### Requirement: Tool creation and command registration
The system SHALL provide a runtime for defining a named tool with one or more registered commands.

#### Scenario: Create a tool with commands
- **WHEN** a developer defines an AgentTK tool with a name, optional description, and a list of commands
- **THEN** the runtime creates a `ToolRuntime` that stores the tool definition
- **AND** each command can be addressed by name or alias during execution

#### Scenario: Define a command
- **WHEN** a developer defines a command with a name, optional description, aliases, usage examples, and a handler function
- **THEN** the command is accepted as part of the tool definition without additional framework boilerplate
- **AND** the command can include risk metadata (e.g., `level`, `confirmation`, `reason`)

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

#### Scenario: Help request for tool
- **WHEN** the tool is run with `help`, `--help`, or `-h` as the command name
- **THEN** the runtime returns a help result for the tool, listing all available commands

#### Scenario: Help request for command
- **WHEN** the tool is run with a command name followed by `--help` or `-h`
- **THEN** the runtime returns a help result for the specific command, including usage, examples, and risk metadata

#### Scenario: Unknown command
- **WHEN** the tool is run with a command name that is not registered
- **THEN** the runtime returns a help result for the tool, listing all available commands

#### Scenario: Missing command
- **WHEN** the tool is run without providing a command name
- **THEN** the runtime returns a help result for the tool, listing all available commands

### Requirement: Command execution context
The system SHALL provide a shared execution context to command handlers.

#### Scenario: Context is available to handlers
- **WHEN** a command handler runs
- **THEN** it receives a context including:
  - The `toolName`
  - A `json` flag indicating if JSON output mode is enabled
  - `stdout` and `stderr` streams for output
  - Optional `presentation` settings for formatting command output

### Requirement: Stable success envelope
The system SHALL support a standard structured success envelope for command results.

#### Scenario: Successful command result
- **WHEN** a command succeeds
- **THEN** it returns an envelope containing:
  - `ok: true`
  - A `type` string
  - Optional fields: `destination`, `id`, `record`, `warnings`, `dryRun`
  - Optional recovery metadata: `nextAction`, `classification`, `retryable`
  - Optional mutation-safety metadata: `idempotencyKey`, `retrySafety`, `replayRisk`, `partial`
  - Optional verification metadata: `verified`, `verificationStatus`

#### Scenario: Success envelope is JSON-safe
- **WHEN** a success result is rendered in JSON mode
- **THEN** the payload preserves the envelope fields without human-only decoration

### Requirement: Stable failure envelope
The system SHALL support a standard structured failure envelope for command results.

#### Scenario: Command failure
- **WHEN** a command fails
- **THEN** it returns an envelope containing:
  - `ok: false`
  - An `error` object with `code` and `message`
  - Optional `details` for additional context
  - Optional recovery metadata: `nextAction`, `classification`, `retryable`

#### Scenario: Adapter failures stay normalized
- **WHEN** a downstream command converts an adapter-layer failure into an AgentTK failure result
- **THEN** the failure envelope preserves category and retryability hints without leaking raw provider response formats into the runtime contract

### Requirement: Separate package consumption
The system SHALL be usable as a dependency from separate TypeScript CLI repositories.

#### Scenario: Import AgentTK from another repo
- **WHEN** a developer installs AgentTK in another TypeScript CLI repository
- **THEN** they can import the public runtime primitives (e.g., `createTool`, `runToolCli`) from the package entrypoint
- **AND** they can define and run tools without copying internal files from the AgentTK repo

### Requirement: First-class recovery metadata on command results
The system SHALL support first-class recovery metadata on AgentTK command result envelopes.

#### Scenario: Command result includes recovery metadata
- **WHEN** a command returns a result (success or failure)
- **THEN** the result envelope can include:
  - `nextAction`: The suggested next action (e.g., `fix_input`, `retry`, `confirm`, `abort`)
  - `classification`: The category of the result (e.g., `user_action_required`, `transient`, `unknown`)
  - `retryable`: A boolean indicating if the command can be retried

### Requirement: Mutation-safety metadata on command results
The system SHALL support first-class mutation-safety metadata on AgentTK command result envelopes.

#### Scenario: Mutation result includes safety metadata
- **WHEN** a command returns the result of a mutation
- **THEN** the result can include:
  - `idempotencyKey`: A unique key for idempotency
  - `retrySafety`: The safety level of retrying the command
  - `replayRisk`: The risk level of replaying the command
  - `partial`: A boolean indicating if the mutation was partial
  - `verified`: A boolean indicating if the mutation was verified
  - `verificationStatus`: The status of verification (e.g., `verified`, `unverified`)

### Requirement: Verification metadata on command results
The system SHALL support first-class verification metadata on AgentTK command result envelopes for mutation commands.

#### Scenario: Successful mutation result is unverified
- **WHEN** a command returns a mutation result that has not yet been read back and confirmed
- **THEN** the result includes `verified: false` and `verificationStatus: unverified`
- **AND** the `nextAction` can be set to `verify_state`

#### Scenario: Successful mutation result is verified
- **WHEN** a command confirms the intended post-mutation state
- **THEN** the result includes `verified: true` and `verificationStatus: verified`

### Requirement: Command risk metadata
The system SHALL support provider-agnostic risk metadata on AgentTK command definitions.

#### Scenario: Define command with risk metadata
- **WHEN** a developer defines a command with risk metadata
- **THEN** the command can include:
  - `level`: The risk level (e.g., `low`, `medium`, `high`)
  - `confirmation`: The confirmation requirement (e.g., `none`, `recommended`, `required`)
  - `reason`: The reason for the risk level

#### Scenario: Risk metadata appears in command help
- **WHEN** a tool generates help for a command with risk metadata
- **THEN** the help output includes the risk level, confirmation requirement, and reason

