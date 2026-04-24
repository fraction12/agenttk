## Why

Downstream CLIs like Microcanvas are still carrying a thin but repetitive CLI framework layer for dispatch, help generation, result factories, recovery metadata helpers, and human/JSON rendering. AgentTK should absorb those generic blocks so tool repos stay focused on domain behavior instead of reimplementing the same runtime shell.

## What Changes

- Add first-class runtime helpers for building and running a CLI tool without hand-rolled dispatch and output plumbing.
- Add reusable result helpers for common command outcomes like invalid input, operational failure, locked/busy, confirmation-required, and unverified mutation results.
- Expand built-in rendering so tools can rely on AgentTK for concise human output, JSON output, warnings, recovery metadata, verification metadata, and light key/value record formatting.
- Add lightweight argument helpers for common command patterns such as boolean flags and positional argument extraction without introducing a full parser framework.
- Preserve existing low-level primitives so current AgentTK consumers do not have to adopt the higher-level helpers immediately.

## Capabilities

### New Capabilities
- `cli-runtime-kit`: High-level CLI runtime helpers for dispatch, result helpers, rendering, and lightweight argument extraction.

### Modified Capabilities
- `tool-runtime`: Add a higher-level tool runner that can execute a tool definition with built-in help, unknown-command handling, and output emission.
- `command-blocks`: Add reusable result helpers and human rendering support for common command outcomes and simple record formatting.
- `command-help`: Extend help generation so the runtime can emit tool and command help without downstream glue code.

## Impact

- Affected code: AgentTK runtime entrypoints, command/result helpers, help generation, rendering utilities, and tests.
- Affected consumers: downstream CLIs such as Microcanvas can delete local dispatch, envelope factory, and presentation glue.
- API impact: additive high-level helpers; existing low-level APIs remain supported.
- Dependency impact: none required; avoid introducing a heavy argument-parser dependency.