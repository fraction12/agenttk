## Why

AgentTK already has a useful testing kit, but the doctrine points toward richer reusable fixtures for adapter-backed tools, auth failures, dry-run flows, and lookup-heavy commands. Without those, downstream repos will keep writing brittle bespoke harness code around the same scenarios.

## What Changes

- Expand the testing kit with richer fixtures and assertions for common AgentTK patterns.
- Add reusable helpers for auth failures, lookup ambiguity, dry-run mutations, and adapter-backed commands.
- Keep the scope narrow: no full integration harness, no browser automation, and no snapshot-heavy framework layer.

## Capabilities

### Modified Capabilities
- `testing-kit`: Broaden the kit to cover richer reusable fixtures and assertions for real downstream tool patterns.

## Impact

- Makes AgentTK more useful for real provider-backed CLIs rather than toy examples.
- Reduces repeated boilerplate in downstream test suites.
- Reinforces doctrine by making reusable primitives easier to adopt and verify.
