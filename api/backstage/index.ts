import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { StaticLearningAreaReader } from "../../src/staticLearningAreasReader"
import { Adapters, initBackstage } from "../../src/engage/backstage"
import { CosmosEngagementPlanRepository } from "../../src/cosmosEngagementPlanRepository"
import { azureUserParser } from "../common/azureUserParser.js"

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

const backstage = initBackstage(adapters)

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  const result = await backstage.messageHandler(azureUserParser(req, context), req.body)

  context.res = {
    body: result
  };
};

export default httpTrigger;