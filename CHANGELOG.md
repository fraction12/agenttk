# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

## [0.1.5] - 2026-04-13

### Added
- recovery semantics helpers and metadata for machine-usable next actions
- mutation safety helpers for retry posture, replay risk, and verification status
- risk metadata and confirmation helpers for dangerous commands
- an exported agent-safe CLI checklist for downstream reviews and release gates

### Changed
- tool and command help can surface command risk posture
- human output now renders recovery, mutation safety, and confirmation details more clearly
- testing helpers now cover recovery, mutation safety, and the exported checklist surface

## [0.1.4] - 2026-04-12

### Added
- built-in tool help and command help
- alias-aware command dispatch
- structured help payloads in JSON mode
- auth failure helpers for required, invalid, and account-mismatch states
- auth preflight helper for provider-backed commands
- lookup-resolution helpers for id-or-query flows, not-found outcomes, and ambiguous matches
- adapter contract helpers for capability checks and normalized adapter failures
- config convention helpers for env/profile loading and structured config diagnostics
- richer testing helpers for auth, lookup, adapter, config, and dry-run assertions

### Changed
- command and tool metadata now support descriptions, aliases, usage, and examples
- human failure output can now render structured auth guidance details, adapter failure metadata, config diagnostics, and lookup candidate summaries
- README examples now show help-oriented command metadata, auth preflight usage, adapter contract patterns, config conventions, testing helpers, and lookup resolution patterns

## [0.1.3] - 2026-04-11

### Added
- push/PR verification workflow for build, tests, and example smoke checks
- archived v0 OpenSpec into `openspec/specs/` as the durable source of truth

### Changed
- release and verify workflows now target Node 24
- README positioning tightened around the actual v0 scope

### Fixed
- GitHub, npm, and package metadata were brought back into version alignment
- stray repo junk and spec-tracking issues were cleaned up

## [0.1.2] - 2026-04-11

### Added
- initial public AgentTK package release
- deterministic runtime primitives for tool creation and command dispatch
- structured success/failure envelopes
- validation, output, and dry-run blocks
- lightweight testing helpers and example CLIs

## Release discipline

- Every release should have a matching changelog entry.
- Git tags should match `package.json` exactly.
- npm and GitHub releases should reflect the same published version.
- If a tag fails to publish, clean up the public version surface before the next release.
