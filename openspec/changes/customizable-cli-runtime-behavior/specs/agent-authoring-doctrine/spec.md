## ADDED Requirements

### Requirement: Upstream extension contract
The system SHALL document the intended extension contract for agent-authored CLIs.

#### Scenario: Tool needs custom human voice
- **WHEN** a downstream tool needs branded colors, concise status lines, or domain-specific human phrasing
- **THEN** AgentTK documentation directs the tool to use presentation render hooks
- **AND** AgentTK remains responsible for dispatch, JSON mode, and stream routing

#### Scenario: Tool needs custom domain errors
- **WHEN** a downstream tool needs stable domain error codes
- **THEN** AgentTK documentation directs the tool to use result helper code overrides
- **AND** the tool keeps the standard failure envelope

#### Scenario: Tool needs strict automation behavior
- **WHEN** a downstream tool must be safe for machine callers
- **THEN** AgentTK documentation directs the tool to configure unknown-command failure or use agent-safe defaults
- **AND** the tool does not need to fork runtime dispatch to get strict behavior
