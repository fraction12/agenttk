## 1. Runtime contract

- [x] 1.1 Add first-class recovery types and metadata to AgentTK command result envelopes.
- [x] 1.2 Add a reusable helper for attaching recovery metadata to existing results.
- [x] 1.3 Export the new recovery types and helper from the package entrypoint.

## 2. Block normalization

- [x] 2.1 Apply default recovery metadata to auth failures.
- [x] 2.2 Apply default recovery metadata to lookup failures.
- [x] 2.3 Apply default recovery metadata to validation and config failures.
- [x] 2.4 Apply category-based recovery defaults to adapter failures and unsupported capability outcomes.
- [x] 2.5 Keep guidance helpers aligned with the new recovery contract.

## 3. Rendering and tests

- [x] 3.1 Render recovery metadata cleanly in human mode while preserving JSON output.
- [x] 3.2 Add reusable testing assertions for recovery metadata.
- [x] 3.3 Extend smoke tests to cover recovery defaults and human rendering.

## 4. Validation

- [x] 4.1 Validate the OpenSpec change.
- [x] 4.2 Run build and test verification for the implementation.
