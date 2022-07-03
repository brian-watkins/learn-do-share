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

export async function seedNotes({ endpoint, databaseName }) {
  const cosmosClient = new CosmosClient({
    endpoint,
    key: "some-dumb-key",
    agent: new https.Agent({ rejectUnauthorized: false })
  })

  await cosmosClient.database(databaseName).container("engagement-notes").items.create({
    learningAreaId: "area-1",
    userId: "53fb442a96cb0e63ff13df56f9aa1c26",
    content: "Here is a great note! It happens to be quite long but still also kind of interesting and it talks a lot about all the fun stuff that I've done over the last few days. Thank you!"
  })

  await cosmosClient.database(databaseName).container("engagement-notes").items.create({
    learningAreaId: "area-1",
    userId: "53fb442a96cb0e63ff13df56f9aa1c26",
    content: "Here is a another fun note!"
  })
}