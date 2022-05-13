import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { renderTemplate } from "../common/render";
import { azureUserParser } from "../common/azureUserParser";
import { Adapters, initBackstage } from "../../src/engage/backstage";
import fs from "fs"
import path from "path"


export function generateEngageFunction(adapters: Adapters): AzureFunction {
  const backstage = initBackstage(adapters)

  return async function (context: Context, req: HttpRequest): Promise<void> {
    const url = new URL(req.headers["x-ms-original-url"] as string)
    const areaId = url.pathname.split("/").pop() ?? ""
  
    let template = fs.readFileSync(path.join(context.executionContext.functionDirectory, "index.html"), 'utf-8')
  
    const html = await renderTemplate(backstage, template, {
      user: azureUserParser(req, context),
      attributes: {
        learningAreaId: areaId
      }
    })
  
    context.res = {
      headers: {
        'Content-Type': 'text/html',
        'Cache-Control': 'no-store'
      },
      body: html
    }
  };
}
