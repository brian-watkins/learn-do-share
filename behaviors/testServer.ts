import { LogLevel, StopSignal, TestProcess, waitForPort } from "./testProcess"

const vitePort = "7778"
const funcPort = "7072"
const cosmosPort = "3021"
const serverPort = "4280"

const SWA_SERVER = new TestProcess("node_modules/.bin/swa", [
  "start", `http://localhost:${vitePort}`,
  "--api-location", `http://localhost:${funcPort}`,
  "--verbose", "log",
  "--run", `npx vite --port ${vitePort}`
])

const FUNCTION_SERVER = new TestProcess("func", [
  "start",
  "--port", funcPort,
  "--verbose", "false"
])

export function serverHost(): string {
  return `http://localhost:${serverPort}`
}

export async function startServer(): Promise<void> {
  FUNCTION_SERVER.start({
    workingDir: "./azure/api",
    env: {
      COSMOS_DB_ENDPOINT: `https://localhost:${cosmosPort}`
    },
    logLevel: LogLevel.Normal
  })

  SWA_SERVER.start({
    logLevel: LogLevel.Normal
  })

  return waitForPort(serverPort)
}

export async function stopServer(): Promise<void> {
  FUNCTION_SERVER.stop(StopSignal.Kill)
  SWA_SERVER.stop()
}
