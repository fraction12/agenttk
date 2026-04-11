## Why

AgentTK can dispatch commands and return stable result envelopes, but it still makes downstream CLIs reinvent basic help behavior. That is a gap in a toolkit that is explicitly for building agent-friendly command-line tools. The next useful step is not a giant framework feature. It is a small, predictable help layer built on top of the existing runtime.

## What Changes

- Add built-in help rendering for tools and commands.
- Extend command metadata so downstream CLIs can declare descriptions, usage, examples, and aliases in a structured way.
- Ensure help works in both human mode and JSON mode without weakening the existing result-envelope contract.
- Keep the scope narrow: no full flag parser, no scaffolding, no shell completion, and no interactive TUI help.

## Capabilities

### New Capabilities
- `command-help`: Built-in help and command metadata for AgentTK tools.

### Modified Capabilities
- `tool-runtime`: Runtime dispatch will recognize explicit help requests and command aliases.

## Impact

- Affects the public runtime surface in `src/core` and output rendering in `src/blocks`.
- Expands `CommandDefinition` and tool metadata in a backward-compatible way.
- Gives downstream CLIs a consistent help path instead of bespoke hand-written usage text.
