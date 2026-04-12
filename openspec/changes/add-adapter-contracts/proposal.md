## Why

The doctrine says AgentTK should own the boring framework boundary, not provider logic. That boundary is weakest today around adapters. Downstream repos will keep inventing their own adapter shapes, capability signaling, and error mapping unless the framework offers a small common contract.

## What Changes

- Define a narrow adapter contract pattern for provider-backed commands.
- Standardize normalized adapter error mapping and retryability hints.
- Support capability signaling so downstream tools can branch safely without bespoke checks.
- Keep scope narrow: no provider SDK wrappers and no domain-specific adapters in core.

## Capabilities

### New Capabilities
- `adapter-contracts`: Shared adapter patterns, normalized error mapping, and capability signaling for downstream tools.

### Modified Capabilities
- `tool-runtime`: Runtime-facing result envelopes should accommodate normalized adapter failures without leaking provider-specific shapes.

## Impact

- Creates a clearer contract between AgentTK core and downstream integrations.
- Helps agents generate more consistent tool code across providers.
- Reduces repeated error-normalization work in every repo.
