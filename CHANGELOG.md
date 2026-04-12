# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

### Added
- built-in tool help and command help
- alias-aware command dispatch
- structured help payloads in JSON mode
- auth failure helpers for required, invalid, and account-mismatch states
- auth preflight helper for provider-backed commands

### Changed
- command and tool metadata now support descriptions, aliases, usage, and examples
- human failure output can now render structured auth guidance details
- README examples now show help-oriented command metadata and auth preflight usage

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
