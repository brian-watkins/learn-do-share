import { Adapters } from "@/src/engage/backstage";
import { CosmosEngagementPlanRepository } from "@/adapters/cosmosEngagementPlanRepository";
import { generateEngageFunction } from "@/api/engage/function"
import https from 'https'
import { HttpLearningAreaReader } from "./HTTPLearningAreasReader";
import { CosmosConnection } from "@/adapters/cosmosConnection";
import { CosmosEngagementNoteRepository } from "@/adapters/cosmosEngagementNoteRepository";

const cosmosConnection = new CosmosConnection({
  endpoint: process.env["COSMOS_DB_ENDPOINT"] ?? "unknown",
  key: "some-fake-key",
  database: "lds-test",
  agent: new https.Agent({ rejectUnauthorized: false })
})

const engagementPlansRepository = new CosmosEngagementPlanRepository(cosmosConnection)
const engagementNotesRepository = new CosmosEngagementNoteRepository(cosmosConnection)

const adapters: Adapters = {
  learningAreaReader: new HttpLearningAreaReader(),
  engagementPlanReader: engagementPlansRepository,
  engagementPlanWriter: engagementPlansRepository,
  engagementNoteReader: engagementNotesRepository
}

export default generateEngageFunction(adapters)
