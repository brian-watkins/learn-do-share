import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Adapters, initBackstage } from "../../src/engage/backstage";
import { CosmosEngagementPlanRepository } from "../../src/cosmosEngagementPlanRepository";
import { StaticLearningAreaReader } from "../../src/staticLearningAreasReader";
import fs from "fs"
import path from "path"
import { renderTemplate } from "./render";
import { azureUserParser } from "../common/azureUserParser";

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
  // this needs to be consolidate with the local version
  const url = new URL(req.headers["x-ms-original-url"] as string)
  const areaId = url.pathname.split("/").pop() ?? ""

  let template = fs.readFileSync(path.join(context.executionContext.functionDirectory, "index.html"), 'utf-8')

  const html = await renderTemplate(backstage, template, azureUserParser(req, context), areaId)

  context.res = {
    headers: {
      'Content-Type': 'text/html',
      'Cache-Control': 'no-store'
    },
    body: html
  }
};

export default httpTrigger;