import { Adapters } from "@/src/engage/backstage";
import { CosmosEngagementPlanRepository } from "@/adapters/cosmosEngagementPlanRepository";
import { CosmosEngagementNoteRepository } from "@/adapters/cosmosEngagementNoteRepository";
import { StaticLearningAreaReader } from "@/adapters/staticLearningAreasReader";
import { generateEngageFunction } from "./function";
import { CosmosConnection } from "@/adapters/cosmosConnection";

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

export default generateEngageFunction(adapters)
