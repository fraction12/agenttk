## 1. Runtime entrypoint

- [x] 1.1 Add a high-level CLI runtime helper that runs a tool definition from argv with built-in help, alias resolution, unknown-command handling, and output emission.
- [x] 1.2 Add tests covering JSON mode, human mode, tool help, command help, unknown command, and missing command behavior through the new runtime helper.
- [x] 1.3 Document the thin-entrypoint pattern for downstream CLIs.

## 2. Result helpers and rendering

- [x] 2.1 Add reusable result helpers for invalid input, operational failure, locked/busy, confirmation-required, and verification-aware mutation outcomes.
- [x] 2.2 Extend human rendering to surface warnings, recovery metadata, verification metadata, and simple record fields without downstream hand-rolled formatting.
- [x] 2.3 Add tests covering success/failure rendering with warnings and recovery metadata through the new helpers.

## 3. Lightweight argument helpers

- [x] 3.1 Add lightweight raw-arg helpers for boolean flag detection and positional extraction without introducing a full parser framework.
- [x] 3.2 Add tests for common flag and positional parsing cases used by downstream CLIs.

## 4. Adoption proof

- [x] 4.1 Capture a reference migration shape showing how a downstream CLI like Microcanvas can delete local dispatch and envelope glue.
- [x] 4.2 Verify the new runtime layer is additive and does not break existing low-level AgentTK consumers.
