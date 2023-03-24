import { Adapters } from "@/src/engage/backstage.js";
import { CosmosEngagementPlanRepository } from "@/adapters/cosmosEngagementPlanRepository.js";
import { CosmosEngagementNoteRepository } from "@/adapters/cosmosEngagementNoteRepository.js";
import { StaticLearningAreaReader } from "@/adapters/staticLearningAreasReader.js";
import { generateEngageFunction } from "./function.js";
import { CosmosConnection } from "@/adapters/cosmosConnection.js";

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
