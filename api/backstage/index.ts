import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { Adapters } from "../../src/backstage.js"
import { StaticLearningAreasReader } from "../../src/staticLearningAreasReader"
import { createBackstage } from "../../src/backstage"

const adapters: Adapters = {
    learningAreasReader: new StaticLearningAreasReader()
}

const backstage = createBackstage(adapters)

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('Backstage function processed a request.');

    const message = req.body
    const handler = backstage.messageRegistry[message.type]
    const result = await handler(message)

    context.res = {
        body: result
    };
};

export default httpTrigger;