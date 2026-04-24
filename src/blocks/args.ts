export type RawArgFlag = string | {
  name: string
  takesValue?: boolean
}

function flagName(flag: RawArgFlag): string {
  return typeof flag === 'string' ? flag : flag.name
}

function flagTakesValue(flag: RawArgFlag): boolean {
  return typeof flag === 'string' ? false : flag.takesValue === true
}

export function hasFlag(rawArgs: string[], flag: string | string[]): boolean {
  const flags = Array.isArray(flag) ? flag : [flag]
  return rawArgs.some((arg) => flags.includes(arg))
}

export function firstPositional(rawArgs: string[], knownFlags: RawArgFlag[] = []): string | undefined {
  for (let index = 0; index < rawArgs.length; index += 1) {
    const arg = rawArgs[index]
    if (!arg) continue

    const knownFlag = knownFlags.find((flag) => flagName(flag) === arg)
    if (knownFlag) {
      if (flagTakesValue(knownFlag)) index += 1
      continue
    }

    if (arg.startsWith('-')) continue
    return arg
  }

  return undefined
}
