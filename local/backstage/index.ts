import { Adapters } from "../../src/backstage.js";
import { CosmosEngagementPlanRepository } from "../../src/cosmosEngagementPlanRepository.js";
import { StaticLearningAreasReader } from "../../src/staticLearningAreasReader.js"
import { createServer } from "./app.js";
import cosmosServer from "@zeit/cosmosdb-server"
import https from 'https'

const port = process.env.PORT || 7778;

await new Promise<void>((resolve) => {
  (cosmosServer as any).default().listen(3021, () => {
    console.log(`Cosmos DB server running at https://localhost:3021`);
    resolve()
  })
});

const cosmosDB = new CosmosEngagementPlanRepository({
  endpoint: "https://localhost:3021",
  key: "some-fake-key",
  database: "lds-local",
  container: "engagement-plans-local",
  agent: new https.Agent({ rejectUnauthorized: false })
})

const adapters: Adapters = {
  learningAreasReader: new StaticLearningAreasReader(),
  engagementPlanReader: cosmosDB,
  engagementPlanWriter: cosmosDB
}

const app = createServer(adapters)

app.listen(port, () => {
  console.log("Server listening on port", port)
})