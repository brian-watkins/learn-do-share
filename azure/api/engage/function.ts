import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { render } from "../common/render.js";
import { azureUserParser } from "../common/azureUserParser.js";
import { initRenderer } from "@/src/engage/backstageRenderer.js" 

export function generateEngageFunction(adapters: any): AzureFunction {
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