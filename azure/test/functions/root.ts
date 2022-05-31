import { Adapters } from "@/src/overview/backstage";
import { CosmosEngagementPlanRepository } from "@/adapters/cosmosEngagementPlanRepository";
import { generateRootFunction } from "@/api/root/function";
import https from 'https'
import { HttpLearningAreasReader } from "./HTTPLearningAreasReader";

const cosmosDB = new CosmosEngagementPlanRepository({
  endpoint: process.env["COSMOS_DB_ENDPOINT"] ?? "unknown",
  key: "some-fake-key",
  database: "lds-test",
  container: "engagement-plans",
  agent: new https.Agent({ rejectUnauthorized: false })
})

const adapters: Adapters = {
  learningAreasReader: new HttpLearningAreasReader(),
  engagementPlanReader: cosmosDB,
}

export default generateRootFunction(adapters)
