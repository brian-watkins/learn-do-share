import { StaticLearningAreaReader } from "@/adapters/staticLearningAreasReader"
import { Adapters } from "@/src/engage/backstage"
import { CosmosEngagementPlanRepository } from "@/adapters/cosmosEngagementPlanRepository"
import { generateBackstageFunction } from "./function"

const cosmosDB = new CosmosEngagementPlanRepository({
  endpoint: process.env["COSMOS_DB_ENDPOINT"] ?? "unknown",
  key: process.env["COSMOS_DB_READ_WRITE_KEY"] ?? "unknown",
  database: "lds",
  container: "engagement-plans"
})

const adapters: Adapters = {
  learningAreaReader: new StaticLearningAreaReader(),
  engagementPlanReader: cosmosDB,
  engagementPlanWriter: cosmosDB
}

export default generateBackstageFunction(adapters)