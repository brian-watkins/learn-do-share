import express, { Express } from "express"
import { Adapters, initBackstage } from "../../src/backstage"
import { Adapters as EngageAdapters, initBackstage as initEngageBackstage } from "../../src/engage/backstage"
import { createServer as createViteServer } from "vite"
import fs from "fs"
import { renderTemplate } from "../../api/root/render"
import { renderTemplate as renderEngage } from "../../api/engage/render"
import { azureUserParser, Request } from "../../api/common/azureUserParser"
import { IncomingMessage } from "http"

const vite = await createViteServer({
  server: { middlewareMode: 'ssr' }
})

export async function stopVite() {
  await vite.close()
}

export async function createServer(adapters: Adapters & EngageAdapters): Promise<Express> {
  const app = express()

  app.use(express.json())

  app.get("/admin/functions", (_, res) => {
    // Just to make SWA CLI not print out errors
    res.json([{ config: { bindings: [{ type: "httpTrigger" }] } }])
  })

  const backstage = initBackstage(adapters)

  app.post('/api/backstage', async (req, res) => {
    const result = await backstage.messageHandler(azureUserParser(normalizeRequest(req)), req.body)
    res.send(result)
  })

  app.use(vite.middlewares)

  app.use("/api/root", async (req, res, next) => {
    try {
      let template = fs.readFileSync("./src/index.html", 'utf-8')

      const html = await renderTemplate(backstage, template, azureUserParser(normalizeRequest(req)))

      res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
    } catch (err: any) {
      vite.ssrFixStacktrace(err)
      next(err)
    }
  })

  const engageBackstage = initEngageBackstage(adapters)

  app.use("/api/engage", async (req, res, next) => {

    // console.log("Path", req.url)
    // console.log("Query", req.query)
    // console.log("Headers", req.headers)
  
    const url = new URL(req.headers["x-ms-original-url"] as string)
    const areaId = url.pathname.split("/").pop() ?? ""

    try {
      let template = fs.readFileSync("./src/engage/index.html", 'utf-8')

      const html = await renderEngage(engageBackstage, template, azureUserParser(normalizeRequest(req)), areaId)

      res.status(200).set({ 'Content-Type': 'text/html' }).end(html)
    } catch (err: any) {
      vite.ssrFixStacktrace(err)
      next(err)
    }
  })

  return app
}

function normalizeRequest(req: IncomingMessage): Request {
  let headers: { [name: string]: string } = {}
  for (let i = 0; i < req.rawHeaders.length; i = i + 2) {
    headers[req.rawHeaders[i].toLowerCase()] = req.rawHeaders[i + 1]
  }

  return {
    headers
  }
}