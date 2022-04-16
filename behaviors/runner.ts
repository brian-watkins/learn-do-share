import { validate } from "esbehavior"
import { startBrowser, stopBrowser } from "./browser"
import viewBehavior from "./view.behavior"
import contentBehavior from "./content.behavior"
import engageBehavior from "./engage.behavior"
import authBehavior  from "./auth.behavior"
import { isDebug } from "./helpers"
import { startCosmos, stopCosmos } from "./testStore"
import { stopServer } from "./testServer"

await startBrowser()
await startCosmos()

const summary = await validate([
  viewBehavior,
  contentBehavior,
  engageBehavior,
  authBehavior
])

if (summary.invalid > 0 || summary.skipped > 0) {
  process.exitCode = 1
}

if (!isDebug()) {
  await stopServer()
  await stopCosmos()
  await stopBrowser()
}