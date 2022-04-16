import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Adapters, initBackstage } from "../../src/backstage";
import { CosmosEngagementPlanRepository } from "../../src/cosmosEngagementPlanRepository";
import { StaticLearningAreasReader } from "../../src/staticLearningAreasReader";
import fs from "fs"
import path from "path"
import { renderTemplate } from "./render";
import { azureUserParser } from "./azureUserParser";

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
  let template = fs.readFileSync(path.join(context.executionContext.functionDirectory, "index.html"), 'utf-8')

  const html = await renderTemplate(backstage, template, azureUserParser(req, context))

  context.res = {
    headers: {
      "Content-Type": "text/html"
    },
    body: html
  };
};

export default httpTrigger;