import { LogLevel, StopSignal, TestProcess, waitForPort } from "./testProcess"
import { createServer as createViteServer, ViteDevServer } from "vite"

const vitePort = 7778
const funcPort = "7072"
const cosmosPort = "3021"
const serverPort = "4280"

// const VITE_SERVER = new TestProcess("npx", [
//   "vite", "--port", vitePort
// ])

let VITE_SERVER: ViteDevServer | null = null

const SWA_SERVER = new TestProcess("node_modules/.bin/swa", [
  "start", `http://localhost:${vitePort}`,
  "--api-location", `http://localhost:${funcPort}`,
  "--verbose", "log",
  // "--run", `npx vite --port ${vitePort}`
])

const FUNCTION_SERVER = new TestProcess("func", [
  "start",
  "--port", funcPort,
  // "--verbose", "false"
])

export function serverHost(): string {
  return `http://localhost:${serverPort}`
}

export async function startServer(): Promise<void> {
  VITE_SERVER = await createViteServer()
  await VITE_SERVER.listen(vitePort)

  // FUNCTION_SERVER.start({
  //   workingDir: "./azure/api",
  //   env: {
  //     COSMOS_DB_ENDPOINT: `https://localhost:${cosmosPort}`
  //   },
  //   logLevel: LogLevel.Normal
  // })

  // VITE_SERVER.start({
  //   logLevel: LogLevel.Normal
  // })

  // SWA_SERVER.start({
  //   logLevel: LogLevel.Normal
  // })

  // return waitForPort(serverPort)
}

export async function stopServer(): Promise<void> {
  console.log("Stopping server")
  FUNCTION_SERVER.stop(StopSignal.Kill)
  console.log("Function server killed")
  // VITE_SERVER.stop(StopSignal.Kill)
  await VITE_SERVER?.close()
  console.log("Vite server killed")
  SWA_SERVER.stop()
  console.log("SWA Server killed")
}
