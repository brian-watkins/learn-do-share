import { Adapters } from "../../src/overview/backstage";
import { CosmosEngagementPlanRepository } from "../../src/cosmosEngagementPlanRepository";
import { StaticLearningAreasReader } from "../../src/staticLearningAreasReader";
import { generateRootFunction } from "./function";

const cosmosDB = new CosmosEngagementPlanRepository({
  endpoint: process.env["COSMOS_DB_ENDPOINT"] ?? "unknown",
  key: process.env["COSMOS_DB_READ_WRITE_KEY"] ?? "unknown",
  database: "lds",
  container: "engagement-plans"
})

const adapters: Adapters = {
  learningAreasReader: new StaticLearningAreasReader(),
  engagementPlanReader: cosmosDB,
}

export default generateRootFunction(adapters)
