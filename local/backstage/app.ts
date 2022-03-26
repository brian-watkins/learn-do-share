import express, { Express } from "express"
import { Adapters } from "../../src/requests"
import { createMessageHandler } from "../../src/server"

export function createServer(adapters: Adapters): Express {
    const app = express()
    app.use(express.json())
    
    const handleMessage = createMessageHandler(adapters)
    
    app.post('/api/backstage', async (req, res) => {
        const message = req.body
    
        const result = await handleMessage(message)
    
        res.send(result)
    })

    return app
}