import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url';
import tsConfigPaths from "vite-tsconfig-paths"

/**
 * @type {import('vite').UserConfig}
 */
const config = {
  root: ".",
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(dirname(), "index.html"),
        engage: path.resolve(dirname(), "engage.html"),
      }
    },
    outDir: "azure/build/display",
    emptyOutDir: false,
    sourcemap: true,
  },
  ssr: {
    noExternal: []
  },
  plugins: [
    copyHtml("index.html", "./azure/api/root/index.html"),
    copyHtml("engage.html", "./azure/api/engage/engage.html"),
    tsConfigPaths()
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
