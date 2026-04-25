## 1. Microcanvas-First Runtime Slice

- [ ] 1.1 Add public types for unknown-command policy, unknown-command hook input, runtime policy, lifecycle hooks, and render hooks.
- [ ] 1.2 Implement `unknownCommand: "help" | "fail"` and `missingCommand: "help" | "fail"` in `createTool`, preserving help fallback as the default.
- [ ] 1.3 Implement `onUnknownCommand` and route its returned result through normal JSON/human rendering.
- [ ] 1.4 Add tests for default unknown help, strict unknown failure, strict missing failure, custom unknown handler, and no-arg tool help.

## 2. Presentation Hooks And Record Fields

- [ ] 2.1 Add `presentation.renderHelp`, `presentation.renderSuccess`, and `presentation.renderFailure` support for human mode.
- [ ] 2.2 Ensure JSON mode bypasses human render hooks and preserves structured result payloads.
- [ ] 2.3 Extend record fields to accept dotted `path`, labels, and per-field formatters.
- [ ] 2.4 Add tests for custom help/success/failure renderers, nested record paths, missing nested fields, and formatted fields.

## 3. Typed Command Args

- [ ] 3.1 Add command `args` schema types for positionals and a unified typed `flags` map with aliases, defaults, and optional parse hooks.
- [ ] 3.2 Implement lightweight argv parsing in `src/blocks/args.ts` or a focused parser module.
- [ ] 3.3 Pass parsed args to handlers while preserving `rawArgs` and current raw-helper behavior.
- [ ] 3.4 Return structured `INVALID_INPUT` failures for missing positionals, missing flag values, parse failures, and unknown flags.
- [ ] 3.5 Add tests for required positionals, boolean flag aliases, string flags, string-array flags, defaults, unknown flags, and legacy raw handlers.

## 4. Result Helpers And Policies

- [ ] 4.1 Update result helper types/docs so `invalidInput`, `operationalFailure`, and related helpers explicitly support custom domain codes.
- [ ] 4.2 Implement `agentSafeDefaults` with strict missing-command and unknown-command failure plus documented output posture.
- [ ] 4.3 Add tests for domain code overrides and policy override precedence.

## 5. Lifecycle And Wrappers

- [ ] 5.1 Implement `beforeCommand`, `afterCommand`, and `onError` lifecycle hooks around command execution with explicit result replacement semantics.
- [ ] 5.2 Add `withLock` helper that acquires before handler execution and releases on success, failure, or throw.
- [ ] 5.3 Add `withTelemetry` helper that observes start/completion without mutating results by default.
- [ ] 5.4 Add tests for hook ordering, before-command aborts, after-command result replacement, error mapping, parser failures bypassing `onError`, lock release, and telemetry outcome capture.

## 6. CLI Test Harness

- [ ] 6.1 Add `expectCli` helper that runs an AgentTK tool in-process and captures result, stdout, and stderr.
- [ ] 6.2 Add fluent assertions for JSON output, stdout, stderr, success, and failure codes.
- [ ] 6.3 Keep existing `runCli` and assertion helpers backward-compatible.
- [ ] 6.4 Add smoke tests that demonstrate the new harness against a realistic tool definition.

## 7. Docs And Examples

- [ ] 7.1 Update README API docs for unknown-command policies, render hooks, typed args, custom domain codes, lifecycle hooks, policy presets, and test harness helpers.
- [ ] 7.2 Add copyable examples for minimal CLI, strict rich-output CLI, and mutating CLI with dry-run plus lock handling.
- [ ] 7.3 Ensure example smoke commands cover new examples without requiring network, credentials, or platform-specific services.

## 8. Verification

- [ ] 8.1 Run `openspec validate customizable-cli-runtime-behavior --strict` and fix any spec issues.
- [ ] 8.2 Run `npm run verify` and fix any type, lint, or test failures.
- [ ] 8.3 Review public exports for backwards compatibility and add missing exports before marking the change ready for review.
