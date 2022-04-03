import cosmosServer from "@zeit/cosmosdb-server"
import { Server } from "https";
import { CosmosConfig, CosmosEngagementPlanRepository } from "../src/cosmosEngagementPlanRepository";

let database: Server

export async function startCosmos(): Promise<void> {
  return new Promise((resolve) => {
    database = (cosmosServer as any).default().listen(3021, () => {
      console.log(`Cosmos DB server running at https://localhost:3021`);
      resolve()
    })
  });
}

export async function stopCosmos(): Promise<void> {
  return new Promise((resolve) => {
    database.close(() => { resolve() })
  })
}

export class ResetableEngagementPlanRepo extends CosmosEngagementPlanRepository {
  constructor(config: CosmosConfig) {
    super(config)
  }

  async reset(): Promise<void> {
    await this.container?.delete()
    this.container = null
  }
}
