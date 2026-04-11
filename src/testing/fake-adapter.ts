export function fakeAdapter<T extends object>(implementation: T): T {
  return implementation
}
