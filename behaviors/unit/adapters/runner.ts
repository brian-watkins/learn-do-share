import { CosmosConnection } from "@/adapters/cosmosConnection";
import { CosmosEngagementNoteRepository } from "@/adapters/cosmosEngagementNoteRepository";
import { HttpEngagementNoteCounter, HttpEngagementNoteReader, HttpNoteEngageWriter } from "azure/test/functions/HTTPNoteRepo";
import { TestDataServer } from "behaviors/integration/services/testDataServer";
import { validate } from "esbehavior";
import noteRepoBehavior from "./noteRepo.behavior";


const dataServer = new TestDataServer()
await dataServer.start()

const cosmosConnection = new CosmosConnection({
  endpoint: process.env["COSMOS_DB_ENDPOINT"] ?? "unknown",
  key: process.env["COSMOS_DB_READ_WRITE_KEY"] ?? "unknown",
  database: process.env["COSMOS_DB_NAME"] ?? "lds",
})

await cosmosConnection.createContainer("test-engagement-notes")

const engagementNoteRepo = new CosmosEngagementNoteRepository(cosmosConnection, "test-engagement-notes")

const summary = await validate([
  noteRepoBehavior(new HttpEngagementNoteReader(), new HttpEngagementNoteCounter(), new HttpNoteEngageWriter()),
  noteRepoBehavior(engagementNoteRepo, engagementNoteRepo, engagementNoteRepo)
])

await cosmosConnection.deleteContainer("test-engagement-notes")

if (summary.invalid > 0 || summary.skipped > 0) {
  process.exitCode = 1
}

await dataServer.stop()