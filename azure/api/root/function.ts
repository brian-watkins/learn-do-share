import { AzureFunction, Context, HttpRequest } from "@azure/functions";
import { renderTemplate } from "../common/render";
import { azureUserParser } from "../common/azureUserParser";
import { Adapters, initRenderer } from "@/src/overview/backstage";
import fs from "fs"
import path from "path"


export function generateRootFunction(adapters: Adapters): AzureFunction {
  const backstage = initRenderer(adapters)

  return async function (context: Context, req: HttpRequest): Promise<void> {

    const result = await backstage.initialState({
      user: azureUserParser(req, context),
      attributes: null
    })

    switch (result.type) {
      case "redirect":
        break
      case "ok":
        let template = fs.readFileSync(path.join(context.executionContext.functionDirectory, "index.html"), 'utf-8')
        const html = renderTemplate(template, result.state)
        context.res = {
          headers: {
            "Content-Type": "text/html",
            "Cache-Control": "no-store"
          },
          body: html
        };
        break
    }
  }
}
