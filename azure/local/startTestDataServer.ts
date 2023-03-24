import { TestDataServer } from "behaviors/integration/services/testDataServer.js"

const server = new TestDataServer()
await server.start(7171)

console.log("Test data server listening on port 7171")

process.on("SIGINT", async () => {
  await server.stop()
})