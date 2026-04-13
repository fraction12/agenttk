## Context

AgentTK's current core already solves a meaningful chunk of repeated CLI plumbing:
- deterministic runtime and command dispatch
- structured success/failure envelopes
- validation helpers
- auth/config/lookup/adapter blocks
- human/JSON output rendering
- test assertions and fixtures

That is good groundwork, but it does not fully solve the agent-stuck problem. A downstream tool can still fail in ways that are technically structured yet operationally unclear:
- the failure says what happened, but not whether to retry, clarify, reauth, or stop
- a write times out and the agent does not know whether to retry or verify state first
- a provider returns a partial success and there is no framework-level way to mark the operation as unsafe to replay
- a mutation succeeds, but nobody verifies the resulting state

The next roadmap should therefore optimize for **agent recovery** and **safe execution loops**, not just for more blocks.

## Goals

- Define the next AgentTK roadmap around primitives that reduce agent-stranding and unsafe retries.
- Establish a clean split among core primitives, optional helper layers, and downstream tool behavior.
- Provide a concrete phased sequence for future OpenSpec work.
- Define what a downstream CLI should eventually implement before being treated as agent-safe for autonomous use.

## Non-Goals

- Turn AgentTK into a workflow engine or orchestration layer.
- Put provider-specific retry logic or domain-specific safety rules into core.
- Require every downstream tool to adopt the full roadmap before using AgentTK at all.
- Retroactively claim that unimplemented roadmap items already exist.

## Decisions

### 1. The next roadmap is recovery-first
Future primitives should be prioritized by one question:

**Does this reduce the chance that an agent gets stranded, retries unsafely, or mutates state without knowing what happened?**

That means the most valuable next lanes are not cosmetic. They are execution semantics.

### 2. AgentTK core should own machine-usable recovery contracts
AgentTK should eventually make it easy for downstream tools to return not just a failure message and prose next step, but structured recovery signals that agents can act on consistently.

The key future contract fields are:
- `nextAction` such as `retry`, `reauth`, `clarify`, `choose_candidate`, `fix_input`, `verify_state`, or `abort`
- retry classification such as transient vs permanent
- mutation safety hints such as safe-to-retry vs do-not-replay
- verification status such as `verified: true|false`

These are generic enough to belong in framework-level contracts.

### 3. Post-mutation verification is a framework concern
Downstream tools will always own the actual read-back logic for their domain, but AgentTK should own the reusable pattern:
- perform mutation
- verify resulting state where possible
- surface whether the mutation was verified
- tell the agent whether to continue, verify manually, retry carefully, or stop

This is broadly useful across boards, tasks, notes, tickets, calendars, storage, and other APIs.

### 4. Idempotency guidance should be normalized
AgentTK should provide a standard way for downstream tools to declare:
- safe to retry
- unsafe to retry
- partially applied / replay risk
- idempotency key or dedupe hint when supported

The framework should not invent domain-specific replay logic, but it should make the safety classification boringly consistent.

### 5. Dangerous writes need explicit confirmation semantics
Some commands are materially riskier than others. AgentTK should support a reusable risk/confirmation layer for operations such as:
- destructive changes
- irreversible state transitions
- broad-scope or fan-out mutations
- externally visible actions

The framework should let downstream tools declare risk levels and recommended confirmation behavior without forcing one UI or approval model.

## Phased roadmap

The roadmap should be read as a sequence, not a grab bag. Each phase raises the floor for autonomous tool use before the next layer is added.

### Phase 1: Recovery semantics
**Goal:** make failures machine-actionable instead of merely readable.

**Why first:** agents get stranded most often when a tool reports what happened but not what to do next.

**In scope:**
1. `nextAction` as a first-class success/failure field
2. transient vs permanent failure classification
3. retryability metadata normalized across blocks
4. richer human/JSON rendering for recovery cues

**Not yet in scope:**
- idempotency keys
- replay-risk semantics
- post-mutation verification
- confirmation or approval flows

**Exit criteria:**
- downstream tools can return recovery signals that tell an agent whether to retry, reauth, clarify, fix input, verify state, or abort
- the runtime contract and renderers preserve those signals cleanly in both human and JSON mode

**Likely follow-on change:** `add-recovery-semantics`

**OpenSpec shape:**
- likely change lanes under `command-blocks`, `adapter-contracts`, and `tool-runtime`

### Phase 2: Mutation safety
**Goal:** reduce duplicate writes and unsafe replays.

**Why second:** once an agent can interpret failures, the next risk is retrying writes blindly after timeouts, partial success, or unclear provider behavior.

**In scope:**
1. idempotency metadata helpers
2. partial-success / replay-risk semantics
3. post-mutation verification helpers
4. verification-oriented testing helpers

**Not yet in scope:**
- high-level approval policies
- tool-specific business rules for what counts as safe to replay

**Exit criteria:**
- downstream tools can mark write operations as safe to retry, unsafe to replay, or verify-first
- important mutations can report whether resulting state was verified

**Likely follow-on changes:** `add-idempotency-and-retry-metadata`, `add-post-mutation-verification`

**OpenSpec shape:**
- likely change lanes under `tool-runtime`, `command-blocks`, and `testing-kit`

### Phase 3: Autonomy guardrails
**Goal:** let downstream CLIs declare when the agent should pause instead of blindly acting.

**Why third:** once recovery and mutation safety exist, the framework can add guardrails for high-risk actions without confusing core execution contracts.

**In scope:**
1. risk levels for commands
2. confirmation hints for dangerous mutations
3. standardized stop/ask behavior for high-risk actions
4. optional helper layer for approval-oriented downstream tools

**Not yet in scope:**
- one fixed approval UX
- provider-specific approval policies in core

**Exit criteria:**
- downstream tools can declare high-risk actions in a provider-agnostic way
- agents can distinguish between safe autonomous actions and actions that should pause for confirmation

**Likely follow-on change:** `add-command-risk-levels`

**OpenSpec shape:**
- likely doctrine + command contract changes, with any approval orchestration staying outside low-level core

### Phase 4: Agent-safe CLI checklist
**Goal:** define a durable bar for downstream tools that want autonomous-agent use.

**Why last:** the checklist should codify the capabilities established by the earlier phases, not wave at unimplemented ideals.

A downstream CLI should eventually be able to show:
1. predictable failure envelopes across all commands
2. machine-usable recovery semantics
3. explicit retry/idempotency behavior for writes
4. verification on important mutations
5. tests covering auth, ambiguity, not-found, transient failure, and write verification flows

**Exit criteria:**
- AgentTK has a stable review checklist for whether a downstream CLI is truly safe for autonomous-agent use
- the checklist can be applied without dragging domain-specific business logic into core

**Likely follow-on change:** `define-agent-safe-cli-checklist`

**OpenSpec shape:**
- mostly doctrine, testing, and review criteria, not necessarily a large code surface

## Boundary guidance

### AgentTK core
Belongs in core when the capability is:
- generic across many CLIs
- small enough to stay composable
- directly tied to predictable execution or recovery
- useful in both human-assisted and agent-autonomous tools

Examples:
- recovery fields
- retry classification
- verification envelopes
- idempotency metadata
- risk metadata

### Optional helper layers
Belongs in an optional helper layer when the capability is:
- reusable but heavier-weight
- not required for all CLIs
- likely to evolve faster than the lowest-level runtime

Examples:
- approval-oriented helpers
- verification helper scaffolds for common tool categories
- richer canned renderers

### Downstream tool repos
Belongs downstream when the capability is:
- provider-specific
- business-rule specific
- dependent on domain semantics or side-effect models

Examples:
- Trello's exact read-back behavior for label attachment
- calendar-specific attendee safety policies
- email-specific anti-duplication rules
- project-specific approval policies

## Risks / Trade-offs

- **Risk: too much framework policy**. Mitigation: keep core focused on contracts and helpers, not orchestration.
- **Risk: roadmap becomes abstract again**. Mitigation: split into phased future changes with explicit target capabilities.
- **Risk: downstream tools ignore the guidance**. Mitigation: define an eventual agent-safe checklist and use it in reviews.
- **Risk: approval semantics bloat core**. Mitigation: keep risk metadata in core, but keep approval workflow integration optional.

## Recommended next OpenSpec changes after this one

In order:
1. add-recovery-semantics
2. add-idempotency-and-retry-metadata
3. add-post-mutation-verification
4. add-command-risk-levels
5. define-agent-safe-cli-checklist
