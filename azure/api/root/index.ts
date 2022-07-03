import { Adapters } from "@/src/overview/backstage";
import { CosmosEngagementPlanRepository } from "@/adapters/cosmosEngagementPlanRepository";
import { StaticLearningAreasReader } from "@/adapters/staticLearningAreasReader";
import { generateRootFunction } from "./function";
import { CosmosConnection } from "@/adapters/cosmosConnection";

const cosmosConnection = new CosmosConnection({
  endpoint: process.env["COSMOS_DB_ENDPOINT"] ?? "unknown",
  key: process.env["COSMOS_DB_READ_WRITE_KEY"] ?? "unknown",
  database: "lds",
})

const engagementPlanRepo = new CosmosEngagementPlanRepository(cosmosConnection)

const adapters: Adapters = {
  learningAreasReader: new StaticLearningAreasReader(),
  engagementPlanReader: engagementPlanRepo,
}

export default generateRootFunction(adapters)
