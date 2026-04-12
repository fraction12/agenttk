## Context

AgentTK v0 proved the runtime, result envelopes, validation, dry-run, and testing kit. The most obvious missing ergonomic layer now is built-in help. Command definitions already support `description`, but the runtime does not use it. Every consumer would otherwise need to implement the same command list, aliases, and usage output manually.

## Goals / Non-Goals

**Goals:**
- Support a minimal metadata model for tools and commands.
- Render concise help for the whole tool and for a specific command.
- Support `help`, `--help`, and `-h` requests consistently.
- Support command aliases in dispatch.
- Preserve JSON-safe output for automation and tests.

**Non-Goals:**
- Introduce a full argument parsing framework.
- Support generated manpages or shell completion.
- Replace downstream flag parsing libraries.
- Add rich theming or interactive help UIs.

## Decisions

### 1. Help is a built-in runtime concern
AgentTK should provide the baseline help path because every CLI needs it and the shape should be predictable.

### 2. Metadata stays intentionally small
The runtime should accept a narrow metadata set:
- tool description
- command description
- command aliases
- usage string
- examples

Anything more complicated can come later.

### 3. Help requests should not be treated as unknown-command failures
`help`, `--help`, and `-h` are normal product behavior, not errors.

### 4. JSON help should remain structured
JSON mode should return machine-readable help payloads rather than forcing consumers to scrape plain text.

## Risks / Trade-offs

- **Risk: the metadata model grows too fast** → keep v1 help metadata deliberately narrow.
- **Risk: help rendering becomes too opinionated** → standardize structure, keep styling minimal.
- **Risk: alias support complicates dispatch** → resolve aliases to canonical commands before handler execution.

## Migration Plan

1. Extend runtime types with minimal metadata fields.
2. Add alias-aware command resolution.
3. Add structured help payloads and human rendering.
4. Add tests for tool help, command help, aliases, and JSON help output.
5. Update README examples to show the new pattern.
