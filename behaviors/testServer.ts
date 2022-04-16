import { Server } from "http"
import { ChildProcess, spawn } from "child_process"
import { createServer, stopVite } from "../local/backstage/app"
import { Adapters } from "../src/backstage"

let SWA_SERVER: ChildProcess | null = null

const serverPort = 7778

export class TestServer {
  private server: Server | null = null
  
  host(): string {
    // host of the swa server
    return "http://localhost:4280"
  }

  async start(adapters: Adapters): Promise<void> {
    const app = await createServer(adapters)

    return new Promise((resolve) => {
      this.server = app.listen(serverPort, async () => {
        if (SWA_SERVER) {
          resolve()
          return
        }
        
        SWA_SERVER = spawn("node_modules/.bin/swa", [
          "start", `http://localhost:${serverPort}`,
          "--api-location", `http://localhost:${serverPort}`
        ])

        SWA_SERVER.stdout?.on("data", (data) => {
          const output = String(data)
          if (output.includes("emulator started")) {
            resolve()
          }
        })

        SWA_SERVER.stderr?.on("data", (data) => {
          console.log("SWA CLI ERROR:", String(data))
        })
      })
    })
  }

  async stop(): Promise<void> {
    await stopVite()

    return new Promise((resolve) => {
      if (this.server == null) {
        resolve()
        return
      }

      this.server.close(() => {
        resolve()
      })
    })
  }
}

export function stopSWAServer() {
  SWA_SERVER?.kill()
  SWA_SERVER = null
}