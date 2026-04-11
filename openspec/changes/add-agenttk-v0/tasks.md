## 1. Core runtime

- [x] 1.1 Finalize the public TypeScript package surface for `createTool`, `defineCommand`, result helpers, and shared types.
- [x] 1.2 Implement deterministic command dispatch with structured `UNKNOWN_COMMAND` failures for missing or invalid command names.
- [x] 1.3 Ensure command handlers receive a stable execution context with tool name, JSON mode, stdout, and stderr.
- [x] 1.4 Confirm the package entrypoint exports the runtime primitives needed by downstream CLI repos.

## 2. Command blocks

- [x] 2.1 Implement the structured success and failure envelopes described in the runtime spec.
- [x] 2.2 Implement validation helpers that convert schema failures into `VALIDATION_ERROR` results.
- [x] 2.3 Support corrective guidance patterns such as expected payload shapes and next-step lookup hints in validation failures.
- [x] 2.4 Implement output rendering for JSON mode and concise human mode, including warning display.
- [x] 2.5 Implement dry-run helpers that preserve successful payloads while marking `dryRun: true`.

## 3. Testing kit

- [x] 3.1 Implement the test helper that runs a tool definition with arguments and captures stdout and stderr.
- [x] 3.2 Add lightweight assertion helpers for structured success and failure results.
- [x] 3.3 Provide a simple fake-dependency helper for adapter-like test doubles.
- [x] 3.4 Add smoke tests covering JSON success output, human failure output, and dry-run behavior.

## 4. Package hardening and examples

- [x] 4.1 Add a real minimal example CLI that demonstrates the public API from a consumer point of view.
- [x] 4.2 Add at least one example that exercises validation and dry-run behavior.
- [x] 4.3 Tighten the README so the v0 scope, non-goals, and usage examples match the spec.
- [x] 4.4 Validate the OpenSpec change and resolve any structural issues before implementation continues.
