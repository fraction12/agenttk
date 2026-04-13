export type AgentSafeChecklistArea =
  | 'command-contract'
  | 'recovery'
  | 'mutation-safety'
  | 'verification'
  | 'risk'
  | 'testing'

export type AgentSafeChecklistItem = {
  id: string
  area: AgentSafeChecklistArea
  title: string
  description: string
  checks: readonly string[]
}

const CHECKLIST: AgentSafeChecklistItem[] = [
  {
    id: 'predictable-failure-envelopes',
    area: 'command-contract',
    title: 'Predictable failure envelopes',
    description: 'Every command should fail with structured, machine-usable envelopes instead of ad-hoc strings.',
    checks: [
      'All failure paths return stable error codes and details payloads.',
      'Human and JSON rendering preserve the same core failure semantics.',
      'Unknown, validation, auth, lookup, config, and adapter paths stay explicit.'
    ]
  },
  {
    id: 'machine-usable-recovery',
    area: 'recovery',
    title: 'Machine-usable recovery semantics',
    description: 'Failures and ambiguous outcomes should tell the agent what to do next.',
    checks: [
      'Failures expose nextAction, classification, and retryable metadata where relevant.',
      'Recovery hints stay provider-agnostic and composable.',
      'Operators can see the same recovery cues in human output.'
    ]
  },
  {
    id: 'explicit-write-retry-semantics',
    area: 'mutation-safety',
    title: 'Explicit write retry semantics',
    description: 'Mutation commands should make replay risk and retry posture boringly clear.',
    checks: [
      'Writes can report retrySafety and replayRisk metadata.',
      'Partial mutation outcomes are marked explicitly.',
      'Idempotency or dedupe hints are preserved when the downstream tool supports them.'
    ]
  },
  {
    id: 'post-mutation-verification',
    area: 'verification',
    title: 'Post-mutation verification',
    description: 'Important mutations should say whether the resulting state was actually verified.',
    checks: [
      'Mutations can report verified or unverified outcomes.',
      'verificationStatus distinguishes verified, unverified, verification_failed, and not_applicable.',
      'Downstream tools can direct agents to verify state before continuing when needed.'
    ]
  },
  {
    id: 'risk-and-confirmation-posture',
    area: 'risk',
    title: 'Risk and confirmation posture',
    description: 'High-risk commands should declare when an agent ought to pause instead of charging ahead.',
    checks: [
      'Commands can declare provider-agnostic risk metadata.',
      'Destructive or high-risk operations can require confirmation before execution.',
      'Help output makes risky commands obvious before they run.'
    ]
  },
  {
    id: 'review-grade-test-coverage',
    area: 'testing',
    title: 'Review-grade test coverage',
    description: 'A CLI should prove its safety contract with focused tests, not vibes.',
    checks: [
      'Tests cover auth, ambiguity, and not-found failures.',
      'Tests cover transient or retry-shaped failure handling where applicable.',
      'Tests cover write verification and risky-command confirmation flows.'
    ]
  }
]

export const agentSafeCliChecklist: ReadonlyArray<AgentSafeChecklistItem> = CHECKLIST

export function getAgentSafeCliChecklist(): AgentSafeChecklistItem[] {
  return CHECKLIST.map((item) => ({
    ...item,
    checks: [...item.checks]
  }))
}
