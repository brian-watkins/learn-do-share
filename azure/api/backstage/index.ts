import { StaticLearningAreaReader } from "@/adapters/staticLearningAreasReader"
import { Adapters } from "@/src/engage/backstage"
import { CosmosEngagementPlanRepository } from "@/adapters/cosmosEngagementPlanRepository"
import { generateBackstageFunction } from "./function"
import { CosmosConnection } from "@/adapters/cosmosConnection"
import { CosmosEngagementNoteRepository } from "@/adapters/cosmosEngagementNoteRepository"

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
  engagementNoteReader: engagementNoteRepo
}

export default generateBackstageFunction(adapters)
