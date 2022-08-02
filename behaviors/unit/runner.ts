import { chromium } from "playwright";
import { createServer } from "vite";
import tsConfigPaths from "vite-tsconfig-paths"

// start vite
const vite = await createServer({
  root: ".",
  server: {
    headers: {
      "Service-Worker-Allowed": "/"
    }
  },
  plugins: [
    tsConfigPaths()
  ],
  logLevel: "silent"
})
await vite.listen(7170)

// start playwright
const browser = await chromium.launch()
const page = await browser.newPage()

// print out the logs
page.on("console", console.log)
page.on("pageerror", console.log)

// load the tests
await page.goto("http://localhost:7170/behaviors/unit/index.html")

// run the tests
const summary = await page.evaluate(() => { return window.esbehavior_run() })

if (summary.invalid > 0 || summary.skipped > 0) {
  process.exitCode = 1
}

await browser.close()
await vite.close()