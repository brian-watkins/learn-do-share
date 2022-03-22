import { validate } from "esbehavior"
import basic from "./view.behavior"
import { createServer } from 'vite'
import { startBrowser, stopBrowser } from "./browser"

const devServer = await createServer({
  configFile: false,
  root: "./display",
  server: {
    port: 7777, // We need to pass this in somehow to the browser?
    proxy: {
      "/messages": "http://localhost:7778" // How do we know this is the right port?
    }
  }
})

await devServer.listen()

await startBrowser()

const summary = await validate([
  basic
])

if (summary.invalid > 0 || summary.skipped > 0) {
  process.exitCode = 1
}

await stopBrowser()

await devServer.close()