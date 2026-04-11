## Context

AgentTK is intended to be a standalone dependency used by separate CLI repositories, including Relay and future agent-oriented tools. The immediate need is not a maximal framework. It is a small, publishable TypeScript toolkit with stable primitives for command definition, structured results, predictable output, validation, and dry-run behavior.

The main constraint is sequencing. If v0 tries to solve plugin loading, auth orchestration, provenance, dynamic adapters, or workflow composition now, the package will become vague and hard to adopt. V0 needs to stay narrow enough that two independent tools could consume it without inheriting each other's domain assumptions.

## Goals / Non-Goals

**Goals:**
- Provide a minimal TypeScript runtime for defining and running CLI tools.
- Standardize the AgentTK success and failure envelope for JSON-first agent use.
- Provide reusable blocks for validation, output rendering, and dry-run semantics.
- Provide lightweight testing helpers so new tools start with decent CLI tests.
- Keep the API small enough to publish as a dependency without Relay-specific leakage.

**Non-Goals:**
- Build a universal CLI framework for every style of application.
- Support plugins, workflow graphs, runtime module loading, or scaffolding generators in v0.
- Standardize auth doctor, lookup resolution, provenance, or live UAT flows yet.
- Define domain adapters for third-party systems in v0.
- Optimize for binary distribution or a Rust runtime.

## Decisions

### 1. AgentTK will be a standalone TypeScript package
AgentTK is a dependency repo, not a shared folder inside another CLI. This creates the right package boundary, forces clean public APIs, and keeps adoption friction low for Node/TypeScript tools.

**Alternatives considered:**
- Shared code inside Relay: faster short term, but not reusable or publishable.
- Rust runtime first: attractive long term, but wrong ergonomics for a dependency consumed by separate TypeScript CLIs.

### 2. V0 is composition-first but intentionally small
The package will expose a minimal set of primitives: tool creation, command definition, result helpers, validation, output rendering, dry-run support, and testing helpers. Anything beyond that requires a later change proposal.

**Alternatives considered:**
- Full block marketplace or plugin model: too much abstraction before the stable primitives are known.
- Monolithic framework API: harder to extend cleanly and more likely to bake in incorrect assumptions.

### 3. Stable result envelopes are the core product contract
Every AgentTK command must be able to return a structured success or failure shape. Human output is important, but machine-safe JSON is the non-negotiable contract because agents depend on it.

**Alternatives considered:**
- Human-first output with optional JSON added case by case: leads to drift and brittle automation.
- Command-specific envelopes: too inconsistent for a toolkit.

### 4. Validation and dry-run are first-class blocks, not app-specific extras
Validation and dry-run support are repeated needs across agent CLIs. AgentTK should make them boring and reusable from the beginning.

**Alternatives considered:**
- Leave them to each tool: guarantees repeated bugs and inconsistent write semantics.

### 5. Testing support ships in v0
AgentTK should not merely help define commands. It should make it easier to verify them. The testing kit stays lightweight: run a tool, capture stdout/stderr, and assert structured results.

**Alternatives considered:**
- Ship tests later: encourages weak downstream quality and makes the toolkit less valuable.

## Risks / Trade-offs

- **[Risk] V0 becomes too Relay-shaped** → Keep domain adapters, task semantics, provenance behavior, and lookup logic out of v0.
- **[Risk] Public API grows too quickly** → Keep exports intentionally small and require future capabilities to come through new OpenSpec changes.
- **[Risk] The runtime is too thin to feel useful** → Ensure the first examples and one downstream adoption prove it removes real repeated work.
- **[Risk] Human output becomes overly prescriptive** → Standardize shape and predictability, but allow later customization through future changes.

## Migration Plan

1. Define the v0 behavior contract in specs.
2. Keep the current scaffold aligned with that contract.
3. Build at least one real example CLI in-repo against the public API.
4. Extract only proven shared pieces from Relay that fit the spec.
5. Publish the package only after a second tool can consume the same primitives cleanly.

Rollback is straightforward because this is a new package. If a decision proves wrong, the v0 work can be revised before external consumers depend on it.

## Open Questions

- Should the first public package name remain `agenttk` or move to a scoped npm package before publication?
- How much customization should v0 output rendering allow before it weakens the contract?
- Should example CLIs live in this repo long term, or move to separate consumer repos after the API hardens?
