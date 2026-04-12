## Why

AgentTK can validate input and render clean failures, but downstream CLIs still need to hand-roll auth failure handling, account checks, and reauth guidance. That is exactly the sort of repeated plumbing the doctrine says should live in the framework rather than being reinvented badly in every tool.

## What Changes

- Add reusable auth result helpers for unauthenticated and misconfigured tool states.
- Add a narrow auth check contract that downstream tools can implement before running provider-backed commands.
- Standardize corrective guidance for reauth and account-selection flows in both human and JSON output.
- Keep scope narrow: no provider SDKs, no OAuth implementation, and no built-in credential storage.

## Capabilities

### New Capabilities
- `auth-blocks`: Reusable auth state helpers, auth check contracts, and reauth guidance patterns.

### Modified Capabilities
- `command-blocks`: Validation and human output should interoperate cleanly with auth failures and corrective guidance.

## Impact

- Affects reusable blocks and helper contracts in `src/blocks` and `src/core`.
- Gives downstream tools a standard way to say "auth required", "wrong account", or "reauth needed" without bespoke error shapes.
- Provides a foundation for later higher-level auth helpers without bloating core.
