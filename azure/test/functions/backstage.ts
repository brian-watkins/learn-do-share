import { Adapters } from "@/src/engage/backstage"
import { CosmosEngagementPlanRepository } from "@/adapters/cosmosEngagementPlanRepository"
import { generateBackstageFunction } from "@/api/backstage/function"
import https from 'https'
import { HttpLearningAreaReader } from "./HTTPLearningAreasReader"
import { CosmosConnection } from "@/adapters/cosmosConnection"
import { CosmosEngagementNoteRepository } from "@/adapters/cosmosEngagementNoteRepository"

const cosmosConnection = new CosmosConnection({
  endpoint: process.env["COSMOS_DB_ENDPOINT"] ?? "unknown",
  key: "some-fake-key",
  database: "lds-test",
  agent: new https.Agent({ rejectUnauthorized: false })
})

const engagementPlanRepository = new CosmosEngagementPlanRepository(cosmosConnection)
const engagementNotesRepository = new CosmosEngagementNoteRepository(cosmosConnection)

const adapters: Adapters = {
  learningAreaReader: new HttpLearningAreaReader(),
  engagementPlanReader: engagementPlanRepository,
  engagementPlanWriter: engagementPlanRepository,
  engagementNoteReader: engagementNotesRepository,
  engagementNoteWriter: engagementNotesRepository
}

export default generateBackstageFunction(adapters)
