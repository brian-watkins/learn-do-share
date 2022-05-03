import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url';

/**
 * @type {import('vite').UserConfig}
 */
const config = {
  root: "./display",
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
        main: '/Users/bwatkins/workspace/learn-do-share/display/index.html',
        engage: '/Users/bwatkins/workspace/learn-do-share/display/engage.html'
      }
    },
    outDir: "../build/display",
    emptyOutDir: true,
    sourcemap: true
  },
  plugins: [
    copyHtml("index.html", "./api/root"),
    copyHtml("engage.html", "./api/engage")
  ]
}

function copyHtml(filename, destinationDir) {
  return {
    name: 'copy-html',
    enforce: 'post',
    apply: 'build',
    async writeBundle(options, bundle) {
      const indexFile = bundle[filename]
      const outputFile = path.resolve(dirname(), destinationDir, filename)
      fs.writeFileSync(outputFile, indexFile.source)
      console.log("[copy-html] Wrote", outputFile)
    }
  }
}

function dirname() {
  return path.dirname(fileURLToPath(import.meta.url))
}

export default config
