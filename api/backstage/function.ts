import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { Adapters, initBackstage } from "../../src/engage/backstage";
import { azureUserParser } from "../common/azureUserParser";


export function generateBackstageFunction(adapters: Adapters): AzureFunction {
  const backstage = initBackstage(adapters)

  return async function (context: Context, req: HttpRequest): Promise<void> {
    const result = await backstage.messageHandler(azureUserParser(req, context), req.body)
  
    context.res = {
      body: result
    };
  };
}
