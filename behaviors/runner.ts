import { validate } from "esbehavior"
import { startBrowser, stopBrowser } from "./browser"
import viewBehavior from "./view.behavior"
import contentBehavior from "./content.behavior"
import engageBehavior from "./engage.behavior"
import authBehavior from "./auth.behavior"
import { isDebug } from "./helpers"
import { startCosmos, stopCosmos } from "./testStore"
import { startServer, stopServer } from "./testServer"
import { LogLevel, TestProcess } from "./testProcess"

process.on("uncaughtException", async (error) => {
  console.log("A horrible error occurred:", error)
  try {
    await shutdown()
  } catch (_) { }
  process.exit(5)
})

await start()

const summary = await validate([
  viewBehavior,
  contentBehavior,
  engageBehavior,
  authBehavior
])

if (summary.invalid > 0 || summary.skipped > 0) {
  process.exitCode = 1
}

await shutdown()


// Helper functions

async function start() {
  await startBrowser()
  await startCosmos()
  await startServer()
}

async function shutdown(): Promise<void> {
  if (!isDebug()) {
    console.log("A")
    await stopServer()
    console.log("B")
    await stopCosmos()
    console.log("C")
    await stopBrowser()
    console.log("D")
    // const check = new TestProcess("ps", ["-eaf"])
    // check.start({
    //   logLevel: LogLevel.Normal
    // })
    // check.start()
    // await new Promise<void>((resolve) => {
    //   setTimeout(() => {
    //     check.stop()
    //     console.log("Blah")
    //     resolve()
    //   }, 5000)
    // })
  }
}
