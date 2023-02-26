import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { render } from "../common/render.js";
import { azureUserParser } from "../common/azureUserParser.js";
import { Adapters, initRenderer } from "@/src/engage/backstage.js";


export function generateEngageFunction(adapters: Adapters): AzureFunction {
  const renderer = initRenderer(adapters)

  return async function (context: Context, req: HttpRequest): Promise<void> {
    const result = await renderer.initialState({
      user: azureUserParser(req, context),
      attributes: {
        learningAreaId: getLearningAreaId(req)
      }
    })

    render(context, result)
  }
}

function getLearningAreaId(req: HttpRequest): string {
  const url = new URL(req.headers["x-ms-original-url"] as string)
  return url.pathname.split("/").pop() ?? ""
}