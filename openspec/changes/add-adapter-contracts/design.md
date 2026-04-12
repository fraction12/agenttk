## Context

AgentTK is meant to help agents write CLIs faster and more correctly. Without a reusable adapter contract, every downstream tool will model provider errors and capability checks differently, which makes generated tool code brittle and inconsistent.

## Goals / Non-Goals

**Goals:**
- Define a narrow adapter contract shape that downstream tools can adopt.
- Standardize normalized adapter errors with retryability and category hints.
- Support capability flags or feature detection in a provider-agnostic way.

**Non-Goals:**
- Provide first-party adapters for Google, Slack, GitHub, or any other provider.
- Force downstream tools into a single object model for all business logic.
- Build retry orchestration into the runtime.

## Decisions

### 1. Adapter contracts should describe behavior, not providers
Core should standardize patterns like capability checks and normalized failures, not the contents of a Google Task or GitHub issue.

### 2. Retryability should be explicit
A normalized adapter error should be able to say whether the failure is retryable without forcing callers to parse provider messages.

### 3. Capability checks should stay narrow
The first pass should support simple capability flags or check helpers rather than a full plugin negotiation system.

## Risks / Trade-offs

- **Risk: too much abstraction too early** → keep the contract intentionally small.
- **Risk: downstream tools ignore the model** → make it cheap to adopt and obviously useful.
- **Risk: provider-specific fields leak in** → keep adapter errors categorized, not vendor-shaped.

## Migration Plan

1. Define adapter contract and normalized adapter error types.
2. Add helper utilities for capability checks and failure mapping.
3. Add tests for retryable vs non-retryable failures and unsupported capabilities.
4. Document how downstream repos should layer provider-specific logic on top.
