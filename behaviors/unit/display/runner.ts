import { validate } from "esbehavior";
import { chromium } from "playwright";
import { createServer } from "vite";
import tsConfigPaths from "vite-tsconfig-paths"
import deleteNoteBehavior from "./deleteNote.behavior.js";
import engageBehavior from "./engage.behavior.js";
import notesBehavior from "./notes.behavior.js";
import saveNoteBehavior from "./saveNote.behavior.js";

export function isDebug(): boolean {
  return process.env["DEBUG"] !== undefined
}

// start vite
const vite = await createServer({
  root: ".",
  server: {
    headers: {
      "Service-Worker-Allowed": "/"
    }
  },
  define: {
    "__IS_DEBUG__": isDebug()
  },
  plugins: [
    tsConfigPaths()
  ],
  logLevel: isDebug() ? "info" : "silent"
})
await vite.listen(7170)

// start playwright
const browser = await chromium.launch({
  headless: !isDebug()
})
const page = await browser.newPage()

// print out the logs
page.on("console", (message) => console.log(fixStackTrace(message.text())))
page.on("pageerror", (error) => console.log(fixStackTrace(error.toString())))

// load the TestContext
await page.goto("http://localhost:7170/behaviors/unit/display/index.html")

// run the tests
const summary = await validate([
  engageBehavior(page),
  deleteNoteBehavior(page),
  notesBehavior(page),
  saveNoteBehavior(page)
])

if (summary.invalid > 0 || summary.skipped > 0) {
  process.exitCode = 1
}

if (!isDebug()) {
  await browser.close()
  await vite.close()
}

function fixStackTrace(line: string): string {
  return line.replace(`http://localhost:7170`, '')
}