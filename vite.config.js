import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url';

/**
 * @type {import('vite').UserConfig}
 */
const config = {
  root: "./display",
  server: {
    port: 7663,
    open: true,
    proxy: {
      "/api/backstage": "http://localhost:7664"
    }
  },
  build: {
    outDir: "../build/display",
    emptyOutDir: true,
    sourcemap: true
  },
  plugins: [
    copyIndex("./api/root")
  ]
}

function copyIndex(destinationDir) {
  return {
    name: 'copy-index',
    enforce: 'post',
    apply: 'build',
    async writeBundle(options, bundle) {
      const indexFile = bundle['index.html']
      const outputFile = path.resolve(dirname(), destinationDir, "index.html")
      fs.writeFileSync(outputFile, indexFile.source)
      console.log("[copy-index] Wrote", outputFile)
    }
  }
}

function dirname() {
  return path.dirname(fileURLToPath(import.meta.url))
}

export default config
