import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { Adapters } from "../../src/backstage.js"
import { StaticLearningAreasReader } from "../../src/staticLearningAreasReader"
import { initBackstage } from "../../src/backstage"

const adapters: Adapters = {
  learningAreasReader: new StaticLearningAreasReader()
}

const backstage = initBackstage(adapters)

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  context.log('Backstage function processed a request.');

  const result = await backstage.messageHandler(req.body)

  context.res = {
    body: result
  };
};

export default httpTrigger;