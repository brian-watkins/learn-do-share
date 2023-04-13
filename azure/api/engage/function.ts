import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { render } from "../common/render.js";
import { azureUserParser } from "../common/azureUserParser.js";

// This should probably be a dynamic import
//@ts-ignore
import { Adapters, initRenderer } from "/Users/bwatkins/workspace/learn-do-share/azure/build/display/backstage.js";


export function generateEngageFunction(adapters: any): AzureFunction {
  return async function (context: Context, req: HttpRequest): Promise<void> {
    // not good to do on every request but whatever?
    // const { initRenderer } = await import("@/src/engage/backstage.js")
    const renderer = initRenderer(adapters)
  
    const result = await renderer.initialState({
      user: azureUserParser(req, context),
      attributes: {
        learningAreaId: getLearningAreaId(req)
      }
    })

    console.log("Got result", result)

    render(context, result)
  }
}

function getLearningAreaId(req: HttpRequest): string {
  const url = new URL(req.headers["x-ms-original-url"] as string)
  return url.pathname.split("/").pop() ?? ""
}