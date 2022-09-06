import { Adapters } from "@/src/overview/backstage";
import { CosmosEngagementPlanRepository } from "@/adapters/cosmosEngagementPlanRepository";
import { generateRootFunction } from "@/api/root/function";
import https from 'https'
import { HttpLearningAreasReader } from "./HTTPLearningAreasReader";
import { CosmosConnection } from "@/adapters/cosmosConnection";
import { HttpNoteOverviewReader } from "./HTTPNoteRepo";

const cosmosConnection = new CosmosConnection({
  endpoint: process.env["COSMOS_DB_ENDPOINT"] ?? "unknown",
  key: "some-fake-key",
  database: "lds-test",
  agent: new https.Agent({ rejectUnauthorized: false })
})

const engagementPlanRepository = new CosmosEngagementPlanRepository(cosmosConnection)

const adapters: Adapters = {
  learningAreasReader: new HttpLearningAreasReader(),
  engagementPlanReader: engagementPlanRepository,
  engagementNoteReader: new HttpNoteOverviewReader()
}

export default generateRootFunction(adapters)
