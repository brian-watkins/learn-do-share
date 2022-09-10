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

const runnerKey = process.env["RUNNER_KEY"] ?? "0"

const notesContainer = `test-engagement-notes-${runnerKey}`
const plansContainer = `test-engagement-plans-${runnerKey}`

console.log("Creating Cosmos DB Container", notesContainer)
await cosmosConnection.createContainer(notesContainer)

console.log("Creating Cosmos DB Container", plansContainer)
await cosmosConnection.createContainer(plansContainer)

const engagementNoteRepo = new CosmosEngagementNoteRepository(cosmosConnection, notesContainer)
const engagementPlanRepo = new CosmosEngagementPlanRepository(cosmosConnection, plansContainer)

const summary = await validate([
  noteRepoBehavior("Test Data Server Adapter", new HttpEngagementNoteReader(), new HttpEngagementNoteCounter(), new HttpNoteEngageWriter()),
  noteRepoBehavior("Cosmos DB Adapter", engagementNoteRepo, engagementNoteRepo, engagementNoteRepo),
  planRepoBehavior("Test Data Server Adapter", new HttpEngagementPlanReader(), new HttpEngagementPlanWriter()),
  planRepoBehavior("Cosmos DB Adapter", engagementPlanRepo, engagementPlanRepo)
])

if (summary.invalid > 0 || summary.skipped > 0) {
  process.exitCode = 1
}

console.log("Deleting Cosmos DB Container", notesContainer)
await cosmosConnection.deleteContainer(notesContainer)

console.log("Deleting Cosmos DB Container", plansContainer)
await cosmosConnection.deleteContainer(plansContainer)

await dataServer.stop()