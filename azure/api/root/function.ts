import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { render } from "../common/render.js";
import { azureUserParser } from "../common/azureUserParser.js";
import { Adapters, initRenderer } from "@/src/overview/backstage.js";


export function generateRootFunction(adapters: Adapters): AzureFunction {
  const backstage = initRenderer(adapters)

  return async function (context: Context, req: HttpRequest): Promise<void> {
    const result = await backstage.initialState({
      user: azureUserParser(req, context),
      attributes: null
    })

    render(context, result)
  }
}
