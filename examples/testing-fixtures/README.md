# testing-fixtures

Minimal downstream-style example of using AgentTK's richer testing helpers.

```ts
import test from 'node:test'
import { accountMismatch, authFailureFixture, expectAuthFailure, requireAuth } from 'agenttk'

test('auth preflight stays cheap to test', async () => {
  const auth = await requireAuth(authFailureFixture({
    code: 'ACCOUNT_MISMATCH',
    currentAccount: 'personal@example.com',
    expectedAccount: 'team@example.com'
  }))

  expectAuthFailure(auth, {
    code: 'ACCOUNT_MISMATCH',
    provider: 'google',
    currentAccount: 'personal@example.com',
    expectedAccount: 'team@example.com'
  })
})
```
