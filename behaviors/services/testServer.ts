import { LogLevel, StopSignal, TestProcess, waitForPort } from "./testProcess"
import { createServer as createViteServer, ViteDevServer } from "vite"
import { isDebug } from "../helpers"

const vitePort = 7778
const funcPort = "7072"
const cosmosPort = "3021"
const serverPort = "4280"

let VITE_SERVER: ViteDevServer | null = null

const SWA_SERVER = new TestProcess("node_modules/.bin/swa", [
  "start", `http://localhost:${vitePort}`,
  "--api-location", `http://localhost:${funcPort}`,
  "--verbose", "silent",
])

const FUNCTION_SERVER = new TestProcess("func", [
  "start",
  "--port", funcPort,
  "--verbose", isDebug() ? "true" : "false"
])

export function serverHost(): string {
  return `http://localhost:${serverPort}`
}

export async function startServer(): Promise<void> {
  VITE_SERVER = await createViteServer()
  await VITE_SERVER.listen(vitePort)

  FUNCTION_SERVER.start({
    workingDir: "./azure/api",
    env: {
      COSMOS_DB_ENDPOINT: `https://localhost:${cosmosPort}`
    },
    logLevel: isDebug() ? LogLevel.Normal : LogLevel.Silent
  })

  SWA_SERVER.start({
    logLevel: LogLevel.Silent
  })

  return waitForPort(serverPort)
}

export async function stopServer(): Promise<void> {
  FUNCTION_SERVER.stop(StopSignal.Kill)
  await VITE_SERVER?.close()
  SWA_SERVER.stop()
}

process.on("SIGINT", async () => {
  await stopServer()
})