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
  Silent = 2
}

export enum StopSignal {
  Shutdown,
  Kill
}

export class TestProcess {
  private process: ChildProcess | null = null

  constructor(private command: string, private args: Array<string>) {}

  start(options: RunOptions = {}) {
    this.process = spawn(this.command, this.args, {
      cwd: options.workingDir,
      env: Object.assign(process.env, options.env),
      stdio: options.logLevel === LogLevel.Silent ? 'ignore' : 'inherit',
      detached: true
    })
  }

  stop(signal: StopSignal = StopSignal.Shutdown) {
    if (!this.process) {
      console.log("Test process is nil!?!?", this.command, this.args)
      return
    }

    switch (signal) {
      case StopSignal.Shutdown:
        this.process.kill("SIGTERM")
        break
      case StopSignal.Kill:
        this.process.kill("SIGKILL")
        break
    }

    this.process = null
  }
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