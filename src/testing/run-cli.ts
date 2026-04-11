import { PassThrough } from 'node:stream'
import { createTool } from '../core/create-tool.js'
import type { CommandResult, ToolDefinition, ToolRuntime } from '../core/types.js'

function capture(stream: PassThrough) {
  const chunks: Buffer[] = []
  stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)))
  return () => Buffer.concat(chunks).toString('utf8')
}

export async function runTool(definition: ToolDefinition | ToolRuntime, argv: string[]): Promise<{
  result: CommandResult
  stdout: string
  stderr: string
}> {
  const stdout = new PassThrough()
  const stderr = new PassThrough()
  const readStdout = capture(stdout)
  const readStderr = capture(stderr)

  const tool = 'run' in definition ? definition : createTool(definition)
  const result = await tool.run(argv, { stdout, stderr })
  stdout.end()
  stderr.end()

  return {
    result,
    stdout: readStdout(),
    stderr: readStderr()
  }
}
