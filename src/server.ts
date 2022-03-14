import express, { Express } from 'express'
import { Adapters, registry } from './requests'

export function createServerApp(adapters: Adapters): Express {
  const app = express()
  app.use(express.json())

  const messageRegistry = registry(adapters)

  app.post('/messages', async (req, res) => {
    const message = req.body

    const handler = messageRegistry[message.type]
    const result = await handler(message)

    res.send(result)
  })

  return app
}