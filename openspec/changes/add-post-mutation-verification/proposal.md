## Why

Mutation safety is incomplete if a downstream tool cannot say whether the intended state was actually verified after a write. Agents need a standard way to represent "write succeeded but verification is still needed" without inventing bespoke booleans and follow-up prose in every CLI.

## What Changes

- Add first-class verification metadata to AgentTK command result envelopes.
- Provide reusable helpers for marking mutation outcomes as verified or unverified.
- Default unverified mutation outcomes toward a recovery action of `verify_state`.
- Add tests for verification metadata and human rendering.

## Capabilities

### Modified Capabilities
- `tool-runtime`: result envelopes gain verification metadata.
- `command-blocks`: human and JSON rendering preserve verification status.
- `testing-kit`: tests can assert verification status directly.

## Impact

- Downstream tools can report whether a write was verified, unverified, not applicable, or verification failed.
- Agents can distinguish between "done" and "done but verify first".
