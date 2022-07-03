import https from 'https'
import { CosmosClient } from "@azure/cosmos";

export async function createTestDatabase({ endpoint, databaseName }) {
  const cosmosClient = new CosmosClient({
    endpoint,
    key: "some-dumb-key",
    agent: new https.Agent({ rejectUnauthorized: false })
  })

  const { database } = await cosmosClient.databases.createIfNotExists({ id: databaseName })
  
  await database.containers.createIfNotExists({
    id: "engagement-plans",
    partitionKey: {
      paths: ["/userId"],
      version: 2
    }
  })
  
  await database.containers.createIfNotExists({
    id: "engagement-notes",
    partitionKey: {
      paths: ["/userId"],
      version: 2
    }
  })
}
