import { Container, CosmosClient, CosmosClientOptions, Database } from "@azure/cosmos";
import { EngagementPlan } from "./engagementPlans";
import { EngagementPlanReader } from "./readEngagementPlans";
import { EngagementPlanWriter } from "./writeEngagementPlans";

export interface CosmosConfig extends CosmosClientOptions {
  endpoint: string
  key: string,
  database: string,
  container: string,
}

export class CosmosEngagementPlanRepository implements EngagementPlanReader, EngagementPlanWriter {
  protected client: CosmosClient
  protected database: Database | null = null
  protected container: Container | null = null
  protected config: CosmosConfig;

  constructor(config: CosmosConfig) {
    this.client = new CosmosClient(config)
    this.config = config
  }

  async connect(): Promise<void> {
    const databaseResponse = await this.client.databases.createIfNotExists({ id: this.config.database });
    this.database = databaseResponse.database
    const containerResponse = await this.database?.containers.createIfNotExists({ id: this.config.container });
    this.container = containerResponse.container
  }

  async read(): Promise<EngagementPlan[]> {
    if (this.container == null) {
      await this.connect()
    }

    if (this.container == null) {
      return Promise.reject("Could not connect!")
    }

    const { resources } = await this.container.items
      .query("SELECT * FROM plans")
      .fetchAll()
    
    return resources
  }

  async write(plan: EngagementPlan): Promise<EngagementPlan> {
    if (this.container == null) {
      await this.connect()
    }
    
    if (this.container == null) {
      return Promise.reject("No container has been connected!")
    }

    const { resource } = await this.container.items.create(plan)

    if (!resource) {
      return Promise.reject("Unable to create plan!")
    }

    return resource
  }
}