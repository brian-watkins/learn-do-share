import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { Adapters } from "../../src/backstage.js"
import { StaticLearningAreasReader } from "../../src/staticLearningAreasReader"
import { initBackstage } from "../../src/backstage"
import { CosmosEngagementPlanRepository } from "../../src/cosmosEngagementPlanRepository"
import { azureUserParser } from "../common/azureUserParser.js"

const cosmosDB = new CosmosEngagementPlanRepository({
  endpoint: process.env["COSMOS_DB_ENDPOINT"] ?? "unknown",
  key: process.env["COSMOS_DB_READ_WRITE_KEY"] ?? "unknown",
  database: "lds",
  container: "engagement-plans"
})

const adapters: Adapters = {
  learningAreasReader: new StaticLearningAreasReader(),
  engagementPlanReader: cosmosDB,
  engagementPlanWriter: cosmosDB
}

const backstage = initBackstage(adapters)

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  context.log('Backstage function processed a request.');

  const result = await backstage.messageHandler(azureUserParser(req, context), req.body)

  context.res = {
    body: result
  };
};

export default httpTrigger;