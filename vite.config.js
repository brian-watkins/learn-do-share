import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url';

/**
 * @type {import('vite').UserConfig}
 */
const config = {
  root: "./src",
  // server: {
    // port: 7663,
    // open: true,
    // proxy: {
      // "/api/backstage": "http://localhost:7664"
    // }
  // },
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(dirname(), "src/index.html"),
        engage: path.resolve(dirname(), "src/engage/index.html")
      }
    },
    outDir: "../build/display",
    emptyOutDir: true,
    sourcemap: true
  },
  plugins: [
    copyHtml("index.html", "./api/root/index.html"),
    copyHtml("engage/index.html", "./api/engage/index.html")
  ]
}

function copyHtml(filename, destinationFile) {
  return {
    name: 'copy-html',
    enforce: 'post',
    apply: 'build',
    async writeBundle(options, bundle) {
      const indexFile = bundle[filename]
      const outputFile = path.resolve(dirname(), destinationFile)
      fs.writeFileSync(outputFile, indexFile.source)
      console.log("[copy-html] Wrote", outputFile)
    }
  }
}

function dirname() {
  return path.dirname(fileURLToPath(import.meta.url))
}

export default config
