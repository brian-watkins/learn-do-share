import { CosmosConnection } from "@/adapters/cosmosConnection";
import { CosmosEngagementNoteRepository } from "@/adapters/cosmosEngagementNoteRepository";
import { CosmosEngagementPlanRepository } from "@/adapters/cosmosEngagementPlanRepository";
import { HttpEngagementPlanReader, HttpEngagementPlanWriter } from "azure/test/functions/HTTPEngagementPlanRepo";
import { HttpEngagementNoteCounter, HttpEngagementNoteReader, HttpNoteEngageWriter } from "azure/test/functions/HTTPNoteRepo";
import { TestDataServer } from "behaviors/integration/services/testDataServer";
import { validate } from "esbehavior";
import noteRepoBehavior from "./noteRepo.behavior";
import planRepoBehavior from "./planRepo.behavior";


const dataServer = new TestDataServer()
await dataServer.start()

const cosmosConnection = new CosmosConnection({
  endpoint: process.env["COSMOS_DB_ENDPOINT"] ?? "unknown",
  key: process.env["COSMOS_DB_READ_WRITE_KEY"] ?? "unknown",
  database: process.env["COSMOS_DB_NAME"] ?? "lds",
})

await cosmosConnection.createContainer("test-engagement-notes")
await cosmosConnection.createContainer("test-engagement-plans")

const engagementNoteRepo = new CosmosEngagementNoteRepository(cosmosConnection, "test-engagement-notes")
const engagementPlanRepo = new CosmosEngagementPlanRepository(cosmosConnection, "test-engagement-plans")

const summary = await validate([
  noteRepoBehavior("Test Data Server Adapter", new HttpEngagementNoteReader(), new HttpEngagementNoteCounter(), new HttpNoteEngageWriter()),
  noteRepoBehavior("Cosmos DB Adapter", engagementNoteRepo, engagementNoteRepo, engagementNoteRepo),
  planRepoBehavior("Test Data Server Adapter", new HttpEngagementPlanReader(), new HttpEngagementPlanWriter()),
  planRepoBehavior("Cosmos DB Adapter", engagementPlanRepo, engagementPlanRepo)
])

if (summary.invalid > 0 || summary.skipped > 0) {
  process.exitCode = 1
}

await cosmosConnection.deleteContainer("test-engagement-notes")
await cosmosConnection.deleteContainer("test-engagement-plans")

await dataServer.stop()