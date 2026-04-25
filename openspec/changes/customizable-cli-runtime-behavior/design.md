## Context

AgentTK is becoming the runtime layer that downstream agents use to author real CLI tools. The previous runtime-kit work introduced `runToolCli`, built-in help, result helpers, and simple human output, but Microcanvas still needs to keep its own CLI plumbing for strict unknown-command failures, branded `OK`/`ERR` output, typed flags, domain error codes, lock patterns, and full CLI output tests.

The design should keep AgentTK provider-agnostic: AgentTK owns dispatch, JSON mode, stdout/stderr routing, argument schema parsing, and stable envelopes; downstream tools own domain commands, human voice, brand coloring, and domain-specific error codes.

## Goals / Non-Goals

**Goals:**
- Preserve existing runtime behavior by default while allowing strict agent-safe behavior by configuration.
- Add extension hooks that are small, typed, and composable rather than forcing downstream tools to replace the runtime.
- Make typed command arguments available to handlers without adding a parser dependency.
- Strengthen test helpers so agents can assert full CLI behavior through the same runtime path users exercise.
- Document blessed extension patterns for domain errors, custom renderers, strict automation policies, and copyable examples.

**Non-Goals:**
- Do not build a complete CLI generator.
- Do not add provider-specific Microcanvas logic, colors, or command semantics to AgentTK core.
- Do not replace existing raw-arg access; typed parsing should be additive.
- Do not introduce an external parser or command framework dependency for this scope.

## Decisions

### Missing-command and unknown-command policies are runtime configuration

Add `unknownCommand?: 'help' | 'fail'` and `missingCommand?: 'help' | 'fail'` to `ToolDefinition`, plus `onUnknownCommand` for advanced tools. The defaults remain `help` to preserve current human-friendly behavior. `agentSafeDefaults()` will set both policies to `fail` so strict automation surfaces machine-readable `UNKNOWN_COMMAND` failures whether the caller omits a command or misspells one.

Alternative considered: always fail missing or unknown commands. That is cleaner for agents but would surprise existing human-first tools that just received help fallback behavior.

### Render hooks are human-mode only

Add `presentation.renderHelp`, `presentation.renderSuccess`, and `presentation.renderFailure`. JSON mode always renders the stable envelope/record unchanged. Human mode calls the hook first and uses built-in output as the fallback. Hooks return a string, string array, or void; AgentTK still writes to the appropriate stream.

Alternative considered: let hooks write directly to streams. Direct writes are possible through `ctx`, but returning text keeps the common path testable and preserves AgentTK stream routing.

### Typed args wrap raw args, not replace them

Add `CommandDefinition.args` with `positionals` and a single typed `flags` map. Runtime parsing produces `invocation.args` while retaining `rawArgs`. Parser failures return `INVALID_INPUT` with field-level details before the handler runs. Supported v1 flag types are `boolean`, `string`, and `string[]`, with aliases, defaults, and optional custom parse functions.

Alternative considered: adopt a parser package. Avoiding a dependency keeps AgentTK small and leaves room to grow only the subset agents repeatedly need.

### Lifecycle hooks use precise result-mapping semantics

Add `beforeCommand`, `afterCommand`, and `onError` hooks, plus wrapper helpers such as `withLock` and `withTelemetry`. Hooks receive a normalized lifecycle event with the resolved command, parsed args when available, raw args, context, and result/error where relevant. `beforeCommand` may return a `CommandResult` to abort before the handler. `afterCommand` may return a replacement `CommandResult`. `onError` maps thrown errors from handlers or lifecycle hooks into a structured result, but parser-created `INVALID_INPUT` failures do not flow through `onError`.

Alternative considered: expose a generic plugin system. That is too broad for this scope and conflicts with AgentTK's framework-not-generator boundary.

### Testing helpers assert rendered CLI behavior

Build on `runCli` capture helpers with an `expectCli` fluent helper. It runs the same `ToolRuntime.run` path and exposes assertions for JSON, stdout, stderr, success, failure code, and snapshots where the repo's test runner supports them.

Alternative considered: process-level CLI spawning. That belongs in downstream integration tests; AgentTK should keep fast in-process tests for framework behavior.

## Risks / Trade-offs

- [Risk] Typed parsing could drift into a full parser clone. -> Mitigation: keep v1 grammar limited and document unsupported shell-level parsing, subcommands, and coercions.
- [Risk] Render hooks could make output inconsistent across tools. -> Mitigation: JSON mode remains stable and docs define render hooks as human presentation only.
- [Risk] Middleware can obscure control flow. -> Mitigation: start with lifecycle events plus explicit wrapper helpers instead of a broad plugin system.
- [Risk] Default unknown-command behavior conflicts with archived spec text. -> Mitigation: update the runtime spec to make the default and strict policy explicit, then align tests with that contract.
- [Risk] Example templates can become stale. -> Mitigation: keep the first example set small, copyable, and covered by smoke commands rather than generated output.

## Migration Plan

1. Add type definitions and runtime branches behind optional fields, starting with the Microcanvas-first slice.
2. Add tests for default behavior and strict policy behavior before updating implementation.
3. Preserve existing raw-arg handlers and built-in output fallback.
4. Update README and examples to document strict Microcanvas-style configuration with a small example set.
5. Validate with `npm run verify` and `openspec validate customizable-cli-runtime-behavior --strict`.

Rollback is straightforward because the change is additive: remove optional fields and helpers if tests reveal incompatibility before release.

## Open Questions

- Should argument schemas support numeric coercion in v1? This design defers numbers unless a downstream CLI needs them immediately.
