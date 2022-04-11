import express, { Express } from "express"
import { Adapters, initBackstage } from "../../src/backstage"
import { createServer as createViteServer, ViteDevServer } from "vite"
import fs from "fs"

let vite: ViteDevServer

export async function stopVite() {
  await vite.close()
}

export async function createServer(adapters: Adapters): Promise<Express> {
  const app = express()

  app.use(express.json())

  const backstage = initBackstage(adapters)

  app.post('/api/backstage', async (req, res) => {
    const result = await backstage.messageHandler(req.body)
    res.send(result)
  })

  vite = await createViteServer({
    server: { middlewareMode: 'ssr' }
  })

  app.use(vite.middlewares)

  app.use("*", async (_, res, next) => {
    try {
      let template = fs.readFileSync("./display/index.html",'utf-8')

      const state = await backstage.initialState()

      const content = `window._display_initial_state = ${JSON.stringify(state)};`

      const html = template.replace("/* DISPLAY_INITIAL_STATE */", content)

      res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
    } catch (err: any) {
      vite.ssrFixStacktrace(err)
      next(err)
    }
  })

  return app
}