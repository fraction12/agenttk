## Why

AgentTK now owns enough CLI runtime behavior that downstream tools such as Microcanvas need explicit extension points instead of forking dispatch, argument parsing, or human presentation. The current runtime can produce useful help and stable result envelopes, but tool-specific CLIs still need machine-friendly unknown-command failures, branded human output, typed args, domain error codes, and golden-path CLI tests.

## What Changes

- Add configurable missing-command and unknown-command behavior so tools can choose help fallback or structured `UNKNOWN_COMMAND` failure, with an optional `onUnknownCommand` hook.
- Add presentation render hooks for help, success, and failure while preserving AgentTK ownership of dispatch, JSON mode, stdout, and stderr routing.
- Add first-class typed command argument parsing for positionals and a unified typed `flags` map without introducing an external parser dependency.
- Bless custom domain error-code overrides in result helpers while retaining stable framework/domain categories.
- Add lifecycle and middleware hooks for cross-cutting command behavior such as before/after hooks, error mapping, lock wrappers, and telemetry wrappers.
- Add stronger CLI testing helpers for full runtime behavior, including stdout, stderr, JSON, and result assertions.
- Extend record presentation fields to support nested paths and per-field formatters.
- Add a small set of copyable CLI example templates for the highest-leverage agent-authored CLI shapes rather than a generator.
- Add an agent-safe defaults policy helper and document the upstream extension contract for strict automation behavior.
- No breaking changes: existing tools should continue to compile and keep their current behavior unless they opt into stricter policies.

## Capabilities

### New Capabilities
- `cli-argument-parsing`: Typed command argument schemas for positionals, typed flags, aliases, defaults, and validation failures.
- `cli-lifecycle-hooks`: Runtime hooks and composable wrappers for cross-cutting command behavior.
- `cli-policy-presets`: Stable defaults for agent-safe CLI behavior such as unknown-command failure, JSON flag naming, failure output posture, and recovery metadata expectations.
- `cli-example-templates`: Copyable examples for common agent-authored CLI patterns.

### Modified Capabilities
- `tool-runtime`: Missing-command behavior, unknown-command behavior, command invocation shape, render hook integration, and runtime policy options.
- `command-help`: Help rendering extensibility and help records compatible with custom renderers.
- `command-blocks`: Human output presentation hooks, nested record field presentation, and documented custom domain error-code override patterns.
- `testing-kit`: Full CLI behavior assertions for stdout, stderr, JSON, and result matching.
- `agent-authoring-doctrine`: Extension contract that keeps domain voice, strict automation posture, and domain errors in downstream tools while AgentTK owns runtime plumbing.

## Impact

- Affected public APIs: `ToolDefinition`, `CommandDefinition`, `CommandContext`, command invocation objects, presentation types, result helper options, and testing helper exports.
- Affected implementation areas: `src/core/create-tool.ts`, `src/core/define-command.ts`, `src/core/run-tool-cli.ts`, `src/core/types.ts`, `src/blocks/args.ts`, `src/blocks/output.ts`, `src/blocks/results.ts`, and `src/testing/*`.
- Affected docs/examples: README API reference, runtime-kit examples, and new focused examples for minimal, strict rich-output, and mutating locked CLIs.
- No new runtime dependency is expected; argument parsing should stay lightweight and framework-local.
