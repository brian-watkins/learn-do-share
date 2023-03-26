import { validate } from "esbehavior"
import { startBrowser, stopBrowser } from "./services/browser.js"
import { isDebug } from "./helpers.js"
import { startServer, stopServer } from "./services/testServer.js"
import viewBehavior from "./view.behavior.js"
import contentBehavior from "./content.behavior.js"
import engageBehavior from "./engage.behavior.js"
import authBehavior from "./auth.behavior.js"
import notesBehavior from "./notes.behavior.js"

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
], { failFast: true })

if (summary.invalid > 0 || summary.skipped > 0) {
  process.exitCode = 1
}

await shutdown()


// Helper functions

async function start() {
  await startBrowser()
  await startServer()
}

async function shutdown(): Promise<void> {
  if (!isDebug()) {
    await stopServer()
    await stopBrowser()
  }
}
