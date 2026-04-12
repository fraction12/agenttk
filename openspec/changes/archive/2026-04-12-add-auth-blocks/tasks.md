## 1. Auth result primitives

- [x] 1.1 Add reusable auth failure helpers with stable error codes.
- [x] 1.2 Add a narrow auth-check contract for downstream tools.
- [x] 1.3 Ensure auth failures can carry corrective guidance and account context.

## 2. Output and ergonomics

- [x] 2.1 Render auth failures cleanly in human mode.
- [x] 2.2 Preserve structured auth payloads in JSON mode.
- [x] 2.3 Document a minimal auth-preflight pattern for downstream tools.

## 3. Verification

- [x] 3.1 Add tests for unauthenticated, invalid-auth, and wrong-account flows.
- [x] 3.2 Validate the OpenSpec change.
