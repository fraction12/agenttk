## 1. Auth result primitives

- [ ] 1.1 Add reusable auth failure helpers with stable error codes.
- [ ] 1.2 Add a narrow auth-check contract for downstream tools.
- [ ] 1.3 Ensure auth failures can carry corrective guidance and account context.

## 2. Output and ergonomics

- [ ] 2.1 Render auth failures cleanly in human mode.
- [ ] 2.2 Preserve structured auth payloads in JSON mode.
- [ ] 2.3 Document a minimal auth-preflight pattern for downstream tools.

## 3. Verification

- [ ] 3.1 Add tests for unauthenticated, invalid-auth, and wrong-account flows.
- [ ] 3.2 Validate the OpenSpec change.
