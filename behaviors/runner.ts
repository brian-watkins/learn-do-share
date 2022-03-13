import { validate } from "esbehavior"
import basic from "./view.behavior"
import { createServer } from 'vite'
import path from "path"

const devServer = await createServer({
  configFile: false,
  root: "./src",
  server: {
    port: 7777
  }
})

await devServer.listen()

const summary = await validate([
  basic
])

if (summary.invalid > 0 || summary.skipped > 0) {
  process.exitCode = 1
}

await devServer.close()