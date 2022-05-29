import { Adapters } from "@/src/overview/backstage";
import { CosmosEngagementPlanRepository } from "@/adapters/cosmosEngagementPlanRepository";
import { StaticLearningAreasReader } from "@/adapters/staticLearningAreasReader";
import { generateRootFunction } from "@/api/root/function";
import https from 'https'

const cosmosDB = new CosmosEngagementPlanRepository({
  endpoint: process.env["COSMOS_DB_ENDPOINT"] ?? "unknown",
  key: process.env["COSMOS_DB_READ_WRITE_KEY"] ?? "unknown",
  database: "lds-local",
  container: "engagement-plans",
  agent: new https.Agent({ rejectUnauthorized: false })
})

const adapters: Adapters = {
  learningAreasReader: new StaticLearningAreasReader(),
  engagementPlanReader: cosmosDB,
}

export default generateRootFunction(adapters)
