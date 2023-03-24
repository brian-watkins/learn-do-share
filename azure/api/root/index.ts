import { Adapters } from "@/src/overview/backstage.js";
import { CosmosEngagementPlanRepository } from "@/adapters/cosmosEngagementPlanRepository.js";
import { StaticLearningAreasReader } from "@/adapters/staticLearningAreasReader.js";
import { generateRootFunction } from "./function.js";
import { CosmosConnection } from "@/adapters/cosmosConnection.js";
import { CosmosEngagementNoteRepository } from "@/adapters/cosmosEngagementNoteRepository.js";

const cosmosConnection = new CosmosConnection({
  endpoint: process.env["COSMOS_DB_ENDPOINT"] ?? "unknown",
  key: process.env["COSMOS_DB_READ_WRITE_KEY"] ?? "unknown",
  database: "lds",
})

const engagementPlanRepo = new CosmosEngagementPlanRepository(cosmosConnection)
const engagementNoteRepo = new CosmosEngagementNoteRepository(cosmosConnection)

const adapters: Adapters = {
  learningAreasReader: new StaticLearningAreasReader(),
  engagementPlanReader: engagementPlanRepo,
  engagementNoteCounter: engagementNoteRepo
}

export default generateRootFunction(adapters)
