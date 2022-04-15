import express, { Express } from "express"
import { Adapters, initBackstage } from "../../src/backstage"
import { createServer as createViteServer, ViteDevServer } from "vite"
import fs from "fs"
import { renderTemplate } from "../../api/root/render"
import { azureUserParser, Request } from "../../api/root/azureUserParser"
import { IncomingMessage } from "http"

let vite: ViteDevServer

export async function stopVite() {
  await vite.close()
}

export async function createServer(adapters: Adapters): Promise<Express> {
  const app = express()

  app.use(express.json())

  app.get("/admin/functions", (_, res) => {
    // Just to make SWA CLI not print out errors
    res.json([{config: {bindings:[{type: "httpTrigger"}]}}])
  })

  const backstage = initBackstage(adapters)

  app.post('/api/backstage', async (req, res) => {
    const result = await backstage.messageHandler(req.body)
    res.send(result)
  })

  vite = await createViteServer({
    server: { middlewareMode: 'ssr' }
  })

  app.use(vite.middlewares)

  app.use("*", async (req, res, next) => {
    try {
      let template = fs.readFileSync("./display/index.html",'utf-8')

      const html = await renderTemplate(backstage, template, azureUserParser(normalizeRequest(req)))

      res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
    } catch (err: any) {
      vite.ssrFixStacktrace(err)
      next(err)
    }
  })

  return app
}

function normalizeRequest(req: IncomingMessage): Request {
  let headers: { [ name: string ]: string } = {}
  for (let i = 0; i < req.rawHeaders.length; i = i+2) {
    headers[req.rawHeaders[i].toLowerCase()] = req.rawHeaders[i+1]
  }

  return {
    headers
  }
}