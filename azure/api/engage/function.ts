import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { renderTemplate } from "../common/render";
import { azureUserParser } from "../common/azureUserParser";
import { Adapters, initRenderer } from "@/src/engage/backstage";
import fs from "fs"
import path from "path"


export function generateEngageFunction(adapters: Adapters): AzureFunction {
  const renderer = initRenderer(adapters)

  return async function (context: Context, req: HttpRequest): Promise<void> {
    const url = new URL(req.headers["x-ms-original-url"] as string)
    const areaId = url.pathname.split("/").pop() ?? ""

    // maybe
    // 1. get the initial state result
    const result = await renderer.initialState({
      user: azureUserParser(req, context),
      attributes: {
        learningAreaId: areaId
      }
    })

    switch (result.type) {
      case "not-found":
        // 3. if NOT then return response with status
        context.res = {
          status: 404,
          // headers: {
            // "Location": "/index.html"
          // }
        }
        break
      case "ok":
        // 2. if OK then fetch the template and render it
        let template = fs.readFileSync(path.join(context.executionContext.functionDirectory, "engage.html"), 'utf-8')
        const html = renderTemplate(template, result.state)
        context.res = {
          headers: {
            'Content-Type': 'text/html',
            'Cache-Control': 'no-store'
          },
          body: html
        }
        break
    }


    //   let template = fs.readFileSync(path.join(context.executionContext.functionDirectory, "engage.html"), 'utf-8')

    //   const html = await renderTemplate(template, )

    //   context.res = {
    //     headers: {
    //       'Content-Type': 'text/html',
    //       'Cache-Control': 'no-store'
    //     },
    //     body: html
    //   }
  }
}
