import { StaticLearningAreaReader } from "@/adapters/staticLearningAreasReader.js"
import { Adapters } from "@/src/engage/backstage.js"
import { CosmosEngagementPlanRepository } from "@/adapters/cosmosEngagementPlanRepository.js"
import { generateBackstageFunction } from "./function.js"
import { CosmosConnection } from "@/adapters/cosmosConnection.js"
import { CosmosEngagementNoteRepository } from "@/adapters/cosmosEngagementNoteRepository.js"

const cosmosConnection = new CosmosConnection({
  endpoint: process.env["COSMOS_DB_ENDPOINT"] ?? "unknown",
  key: process.env["COSMOS_DB_READ_WRITE_KEY"] ?? "unknown",
  database: "lds",
})

const engagementPlanRepo = new CosmosEngagementPlanRepository(cosmosConnection)
const engagementNoteRepo = new CosmosEngagementNoteRepository(cosmosConnection)

const adapters: Adapters = {
  learningAreaReader: new StaticLearningAreaReader(),
  engagementPlanReader: engagementPlanRepo,
  engagementPlanWriter: engagementPlanRepo,
  engagementNoteReader: engagementNoteRepo,
  engagementNoteWriter: engagementNoteRepo
}

export default generateBackstageFunction(adapters)
