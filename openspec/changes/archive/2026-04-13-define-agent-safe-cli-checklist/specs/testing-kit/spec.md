## ADDED Requirements

### Requirement: Exported agent-safe review checklist
The system SHALL export the canonical agent-safe CLI checklist for downstream review and release workflows.

#### Scenario: Downstream repo consumes checklist
- **WHEN** a downstream CLI repo imports the checklist from AgentTK
- **THEN** it can use the exported checklist as a stable review bar for PRs, audits, or release gates
- **AND** the checklist reflects the framework-level capabilities established by recovery, mutation safety, and command risk posture
