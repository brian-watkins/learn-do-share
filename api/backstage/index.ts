import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { Adapters } from "../../src/requests.js"
import { StaticLearningAreasReader } from "../../src/staticLearningAreasReader"
import { createMessageHandler } from "../../src/server"

const adapters: Adapters = {
    learningAreasReader: new StaticLearningAreasReader()
}

const handleMessage = createMessageHandler(adapters)

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    context.log('Backstage function processed a request.');

    const result = await handleMessage(req.body)

    context.res = {
        body: result
    };
};

export default httpTrigger;