import { BulkOperationType, Container, CosmosClient, CosmosClientOptions, Database } from "@azure/cosmos";
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
    const containerResponse = await this.database?.containers.createIfNotExists({
      id: this.config.container,
      partitionKey: {
        paths: ["/id"],
        version: 2
      }
    });
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

  async deleteAll(learningArea: string): Promise<void> {
    if (this.container == null) {
      console.log("Connecting to container!")
      await this.connect()
    }

    if (this.container == null) {
      return Promise.reject("No container has been connected!")
    }

    // Note: Seems like we should try to remove this query
    // But the frontend request doesn't seem to be all that much slower,
    // maybe a few ms. So doesn't matter a whole lot
    const { resources } = await this.container.items
      .query(`SELECT * FROM plans WHERE plans.learningArea = '${learningArea}'`)
      .fetchAll()

    for (const resource of resources) {
      console.log("Deleting resource: ", resource.id)
    }

    const result = await this.container.items.batch(resources.map((resource) => {
      return {
        operationType: BulkOperationType.Delete,
        partitionKey: `["${resource.id}"]`,
        id: resource.id
      }
    }), 'id')

    console.log("Delete result: ", JSON.stringify(result))
  }
}