import { ChildProcess, spawn } from "child_process"
import { Readable } from "stream"
import waitOn from "wait-on"

export interface RunOptions {
  workingDir?: string
  env?: { [key:string]: string },
  logLevel?: LogLevel
}

export enum LogLevel {
  Normal = 0,
  Error = 1,
  Silent = 2
}

export enum StopSignal {
  Term = 15,
  Kill = 9
}

export class TestProcess {
  private process: ChildProcess | null = null

  constructor(private command: string, private args: Array<string>) {}

  start(options: RunOptions = {}) {
    this.process = spawn(this.command, this.args, {
      cwd: options.workingDir,
      env: Object.assign(process.env, options.env)
    })

    if (options.logLevel === LogLevel.Silent) {
      return
    }

    if (options.logLevel === LogLevel.Error) {
      printLogs(this.process.stderr)
      return
    }

    if (options.logLevel === LogLevel.Normal) {
      printLogs(this.process.stdout)
      printLogs(this.process.stderr)
      return
    }
  }

  stop(signal: StopSignal = StopSignal.Term) {
    this.process?.kill(signal)
    this.process = null
  }
}

function printLogs(readable: Readable | null) {
  readable?.on("data", (data) => {
    console.log(String(data))
  })
}

export function waitForPort(port: string | number): Promise<void> {
  return new Promise((resolve, reject) => {
    waitOn({
      resources: [
        `tcp:localhost:${port}`
      ]
    }, (err) => {
      if (err) {
        console.log(err)
        reject()
      }
      resolve()
    })
  })
}