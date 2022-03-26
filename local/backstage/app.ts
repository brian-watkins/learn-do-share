import express, { Express } from "express"
import { Adapters, createBackstage } from "../../src/backstage"

export function createServer(adapters: Adapters): Express {
    const app = express()
    app.use(express.json())
    
    const backstage = createBackstage(adapters)
    
    app.post('/api/backstage', async (req, res) => {
        const message = req.body
    
        const handler = backstage.messageRegistry[message.type]
        const result = await handler(message)
    
        res.send(result)
    })

    return app
}