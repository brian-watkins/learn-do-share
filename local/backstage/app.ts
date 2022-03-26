import express, { Express } from "express"
import { Adapters, initBackstage } from "../../src/backstage"

export function createServer(adapters: Adapters): Express {
  const app = express()
  app.use(express.json())

  const backstage = initBackstage(adapters)

  app.post('/api/backstage', async (req, res) => {
    const result = await backstage.messageHandler(req.body)
    res.send(result)
  })

  return app
}