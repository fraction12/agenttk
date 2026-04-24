## Context

AgentTK already has the core pieces for defining commands, structured results, verification metadata, and help records. In practice, downstream tools still assemble those primitives by hand: they build command lookup, help dispatch, JSON vs human emission, common failure wrappers, and small argument-parsing utilities in each repository. Microcanvas is a good example: its domain logic is reasonably compact, but its CLI package still contains framework-like code that is generic enough to belong in AgentTK.

The design needs to reduce downstream boilerplate without turning AgentTK into a heavy framework. The right move is to add a thin higher-level layer on top of existing primitives rather than replacing them.

## Goals / Non-Goals

**Goals:**
- Let a downstream tool define commands and run them through a built-in runtime entrypoint.
- Provide reusable result helpers for common recovery and verification patterns.
- Provide built-in rendering for human and JSON modes with warnings and common metadata surfaced consistently.
- Provide lightweight argument helpers for common flag and positional parsing patterns.
- Keep the new layer additive so existing consumers can adopt it incrementally.

**Non-Goals:**
- Introduce a full declarative argument parser or subcommand framework.
- Force downstream tools into a single visual style or branding scheme.
- Eliminate low-level result primitives like `ok`, `fail`, or `defineCommand`.
- Encode domain-specific records or diagnostics in AgentTK.

## Decisions

### 1. Add a high-level `runToolCli` style runtime helper
AgentTK should expose a runtime helper that accepts a tool definition, argv, and optional IO, then handles:
- JSON flag detection
- command lookup and alias handling
- tool help and command help emission
- unknown-command failures
- success/failure rendering to stdout/stderr

This keeps dispatch logic in one place and lets downstream CLIs reduce their `index.ts` to a thin entrypoint.

**Alternative considered:** keep dispatch composition fully manual. Rejected because every consumer rebuilds the same behavior with slight drift.

### 2. Add reusable result helper factories
AgentTK should ship helper factories for common result shapes, such as:
- invalid input
- operational failure
- locked/busy retryable failure
- confirmation required
- verified/unverified mutation success

These helpers should produce standard envelopes while remaining generic about domain-specific codes and messages.

**Alternative considered:** leave these as copy-paste patterns in each tool. Rejected because envelope consistency is part of the SDK’s value.

### 3. Add a simple record renderer contract instead of full custom templating
For human mode, AgentTK should support a minimal result presentation model:
- headline from result type / error code
- warnings
- common metadata fields
- optional record field extraction via ordered key definitions or a small formatter callback

This covers most CLI tools without forcing a large template system.

**Alternative considered:** full theme/template engine. Rejected as needless weight.

### 4. Add lightweight arg helpers, not a parser framework
AgentTK should expose tiny helpers for common patterns:
- `hasFlag(rawArgs, '--native')`
- `firstPositional(rawArgs, knownFlags)`
- possibly `pickArgs(rawArgs, schema)` for tiny use cases

This solves the repeated hand-rolled parsing in downstream CLIs while keeping the SDK small.

**Alternative considered:** introduce yargs/commander-style parsing. Rejected because it bloats the package and changes the philosophy.

## Risks / Trade-offs

- **[Risk] Higher-level helpers become too opinionated** → Keep low-level primitives fully supported and make higher-level helpers optional.
- **[Risk] Human rendering becomes too generic for some tools** → Support light customization hooks while keeping the default renderer strong enough for common cases.
- **[Risk] Scope creep into a full framework** → Explicitly limit argument support to lightweight helpers and avoid plugin/template systems.
- **[Risk] Existing behavior drifts across downstream tools during migration** → Add tests that cover the shared runtime path and migrate one reference consumer first.

## Migration Plan

1. Add the new runtime and result helper APIs alongside existing AgentTK primitives.
2. Add coverage for help, dispatch, rendering, warnings, and recovery metadata through the new runtime path.
3. Migrate one downstream consumer pattern, using Microcanvas as the proving shape.
4. Document the recommended “thin CLI entrypoint” pattern.
5. Leave old usage supported so downstream tools can migrate gradually.

## Open Questions

- Should the simple record renderer be schema-based, callback-based, or support both?
- Should argument helpers live in the main entrypoint or a separate `args` module?
- Should the runtime expose a default pretty/plain theme, or should color treatment remain opt-in per tool?