import express, { Express } from "express"
import { Adapters } from "../../src/overview/backstage"
import { Adapters as EngageAdapters } from "../../src/engage/backstage"
import { createServer as createViteServer } from "vite"
import { AzureFunctionAdapter } from "./azureFunctionAdapter"
import { generateEngageFunction } from "../../api/engage/function"
import { generateRootFunction } from "../../api/root/function"
import { generateBackstageFunction } from "../../api/backstage/function"

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

  const backstageFunctionAdapter = new AzureFunctionAdapter(generateBackstageFunction(adapters))

  app.post('/api/backstage', async (req, res) => {
    await backstageFunctionAdapter.run(req, res)
  })

  app.use(vite.middlewares)

  const rootFunctionAdapter = new AzureFunctionAdapter(generateRootFunction(adapters))
  rootFunctionAdapter.context.executionContext.functionDirectory = "./src"

  app.use("/api/root", async (req, res, next) => {
    try {
      await rootFunctionAdapter.run(req, res)
    } catch (err: any) {
      vite.ssrFixStacktrace(err)
      next(err)
    }
  })

  const engageFunctionAdapter = new AzureFunctionAdapter(generateEngageFunction(adapters))
  engageFunctionAdapter.context.executionContext.functionDirectory = "./src"

  app.use("/api/engage", async (req, res, next) => {
    try {
      await engageFunctionAdapter.run(req, res)
    } catch (err: any) {
      vite.ssrFixStacktrace(err)
      next(err)
    }
  })

  return app
}
