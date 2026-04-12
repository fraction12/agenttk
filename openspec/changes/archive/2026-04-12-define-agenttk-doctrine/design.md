## Context

AgentTK already proves a narrow but useful runtime: deterministic dispatch, structured success/failure envelopes, validation, dry-run behavior, output rendering, and test helpers. The question now is what kind of product it should become.

The desired direction is precise:
- a user's agent should be able to read a skill or interface contract
- inspect the target APIs, auth requirements, and config shape
- write a CLI tool using AgentTK as the reusable framework
- avoid re-implementing common CLI plumbing each time

That means AgentTK should optimize for **agent usability as a library**, not for first-party generation magic.

## Goals / Non-Goals

**Goals:**
- Define AgentTK as the framework for agent-authored CLIs.
- Clarify the split between framework primitives and downstream tool code.
- Identify the next reusable building-block lanes that reduce repeated CLI work.
- Prevent the core package from turning into a blob.

**Non-Goals:**
- Build a first-party generator that emits complete CLIs automatically.
- Put provider-specific adapters or domain logic into core.
- Standardize every possible CLI workflow in one package.
- Replace the user's agent as the author of the actual tool.

## Decisions

### 1. AgentTK is a library, not a generator
The framework should expose reusable primitives. The user's agent remains responsible for reading a skill, deciding which commands exist, wiring integrations, and writing the resulting tool code.

### 2. AgentTK owns the repeated CLI building blocks
Core should absorb the boring parts that agents repeatedly rebuild poorly:
- command/runtime structure
- help metadata and discoverability
- result envelopes
- validation and corrective guidance
- dry-run/write semantics
- auth-required and lookup/resolution patterns
- output formatting
- testing harnesses
- adapter and config conventions

### 3. Domain logic stays out of core
Provider-specific logic such as Google Tasks behavior, calendar planning semantics, or individual API quirks should remain in downstream tools or higher-level helper packages.

### 4. Higher-level packages may exist later
If AgentTK grows helper layers for auth blocks, adapter contracts, or scaffolding helpers, those should be treated as additive layers above a stable core rather than reasons to bloat the lowest-level runtime.

### 5. Future changes should be judged by agent leverage
A good AgentTK change is one that helps an agent build a CLI faster and more correctly without forcing domain assumptions into the framework.

## Product boundary

### AgentTK core
Owns stable reusable framework primitives:
- runtime
- result contracts
- help metadata
- validation blocks
- output rendering
- dry-run semantics
- test harnesses
- basic adapter/config contracts

### User's agent
Owns tool authorship:
- reading the skill
- understanding target APIs and auth
- deciding command surface
- writing the CLI code
- composing AgentTK primitives
- handling domain-specific behavior

### Downstream tool repo
Owns product-specific implementation:
- provider integrations
- business rules
- specific command flows
- live operational behavior
- API quirks and safety rules

## Roadmap lanes

The next likely reusable lanes are:
1. command help and metadata
2. auth blocks and auth-required guidance
3. adapter contracts and normalized error patterns
4. lookup/resolution blocks for id-or-query flows
5. config loading conventions
6. richer test helpers for adapter-backed tools

These should land incrementally and only when they help multiple downstream tools.

## Risks / Trade-offs

- **Risk: the framework stays too small** → solve by adding repeated primitives only after they prove reusable.
- **Risk: the framework becomes sludge** → enforce a boundary between core and downstream/domain logic.
- **Risk: roadmap becomes hand-wavy** → keep changes concrete and judged by agent leverage.
- **Risk: people expect automatic tool generation** → be explicit that AgentTK is the framework used by the agent, not the generator itself.

## Migration / adoption guidance

1. Adopt AgentTK first where a CLI already has hand-rolled runtime/output/validation/test plumbing.
2. Extract only patterns that appear in multiple tools.
3. Keep domain quirks in the downstream repo until they are clearly generic.
4. Use OpenSpec to evaluate whether a proposed primitive belongs in core, a higher-level helper package, or nowhere.
