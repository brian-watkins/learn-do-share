import { validate } from "esbehavior"
import { startBrowser, stopBrowser } from "./services/browser"
import { isDebug } from "./helpers"
import { startCosmos, stopCosmos } from "./services/testStore"
import { startServer, stopServer } from "./services/testServer"
import viewBehavior from "./view.behavior"
import contentBehavior from "./content.behavior"
import engageBehavior from "./engage.behavior"
import authBehavior from "./auth.behavior"
import notesBehavior from "./notes.behavior"

process.on("uncaughtException", async (error) => {
  console.log("A horrible error occurred:", error)
  try {
    await shutdown()
  } finally {
    process.exit(5)
  }
})

await start()

const summary = await validate([
  viewBehavior,
  contentBehavior,
  engageBehavior,
  authBehavior,
  notesBehavior
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
    await stopServer()
    await stopCosmos()
    await stopBrowser()
  }
}
