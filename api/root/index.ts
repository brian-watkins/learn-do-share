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
  context.log('Root function processed a request.', context.executionContext.functionDirectory);

  fs.readdir(context.executionContext.functionDirectory, function (err, files) {
    //handling error
    if (err) {
      return console.log('Unable to scan directory: ' + err);
    }
    //listing all files using forEach
    files.forEach(function (file) {
      // Do whatever you want to do with the file
      console.log(file);
    });
  });

  let template = fs.readFileSync(path.join(context.executionContext.functionDirectory, "index.html"), 'utf-8')

  const state = await backstage.initialState()

  const content = `window._display_initial_state = ${JSON.stringify(state)};`

  const html = template.replace("/* DISPLAY_INITIAL_STATE */", content)

  context.res = {
    body: html
  };
};

export default httpTrigger;