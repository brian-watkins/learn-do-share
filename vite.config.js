import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url';

/**
 * @type {import('vite').UserConfig}
 */
const config = {
  root: "./src",
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(dirname(), "src/index.html"),
        engage: path.resolve(dirname(), "src/engage.html")
      }
    },
    outDir: "../build/display",
    emptyOutDir: true,
    sourcemap: true
  },
  plugins: [
    copyHtml("index.html", "./api/root/index.html"),
    copyHtml("engage.html", "./api/engage/engage.html")
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
