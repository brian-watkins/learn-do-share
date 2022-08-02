import cosmosServer from "@zeit/cosmosdb-server"
import { Server } from "https";
import { CosmosConnection } from "@/adapters/cosmosConnection";
import { createTestDatabase } from "../../../azure/local/databaseSetup"

let database: Server

export async function startCosmos(): Promise<void> {
  return new Promise((resolve) => {
    database = (cosmosServer as any).default().listen(3021, async () => {
      console.log(`Cosmos DB server running at https://localhost:3021`);
      console.log()

      await setupDatabase()

      resolve()
    })
  });
}

export async function stopCosmos(): Promise<void> {
  return new Promise((resolve) => {
    database.close(() => { resolve() })
  })
}

export async function resetCosmos(connection: CosmosConnection): Promise<void> {
  await connection.database?.delete()
  await setupDatabase()
}

async function setupDatabase(): Promise<void> {
  await createTestDatabase({
    endpoint: "https://localhost:3021",
    databaseName: "lds-test"
  })
}
