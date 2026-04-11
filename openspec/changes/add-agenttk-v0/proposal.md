## Why

AgentTK needs a clear v0 contract before more code lands, otherwise it will drift into Relay-shaped shared code instead of a reusable toolkit. We need a spec for what the first publishable version actually guarantees, what it deliberately leaves out, and how separate CLI repos should consume it.

## What Changes

- Define AgentTK v0 as a separate TypeScript package for building deterministic, agent-friendly CLI tools.
- Specify the core runtime for tool creation, command registration, dispatch, and shared result envelopes.
- Specify the v0 command blocks for validation, output rendering, and dry-run behavior.
- Specify the v0 testing helpers for building and verifying CLIs with predictable JSON and human output.
- Explicitly exclude plugin systems, workflow engines, auth doctor flows, provenance helpers, live UAT runners, and dynamic runtime loading from v0.

## Capabilities

### New Capabilities
- `tool-runtime`: Core AgentTK runtime for defining tools, registering commands, dispatching execution, and returning stable result envelopes.
- `command-blocks`: Reusable v0 blocks for validation, output rendering, and dry-run semantics.
- `testing-kit`: Lightweight testing helpers for running AgentTK tools, capturing output, and asserting structured success/failure behavior.

### Modified Capabilities
- None.

## Impact

- Affects the AgentTK package surface under `src/core`, `src/blocks`, `src/errors`, and `src/testing`.
- Defines the first public API and package boundaries for the new standalone repo.
- Establishes the acceptance criteria for extracting proven shared patterns from Relay into AgentTK.
- Gives future changes a stable baseline so new capabilities can be proposed instead of smuggled into v0.
