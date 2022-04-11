import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Adapters, initBackstage } from "../../src/backstage";
import { CosmosEngagementPlanRepository } from "../../src/cosmosEngagementPlanRepository";
import { StaticLearningAreasReader } from "../../src/staticLearningAreasReader";
import fs from "fs"
import path from "path"

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

const httpTrigger: AzureFunction = async function (context: Context, _: HttpRequest): Promise<void> {
  context.log('Root function processed a request.');

  let template = fs.readFileSync(path.join(context.executionContext.functionDirectory, "index.html"), 'utf-8')

  const state = await backstage.initialState()

  const content = `window._display_initial_state = ${JSON.stringify(state)};`

  const html = template.replace("/* DISPLAY_INITIAL_STATE */", content)

  context.res = {
    headers: {
      "Content-Type": "text/html"
    },
    body: html
  };
};

export default httpTrigger;