import { BulkOperationType, Container, CosmosClient, CosmosClientOptions, Database } from "@azure/cosmos";
import { User } from "../api/common/user";
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
        paths: ["/userId"],
        version: 2
      }
    });
    this.container = containerResponse.container
  }

  async read(user: User): Promise<EngagementPlan[]> {
    if (this.container == null) {
      await this.connect()
    }

    if (this.container == null) {
      return Promise.reject("Could not connect!")
    }

    const { resources } = await this.container.items
      .query({
        query: "SELECT * FROM plans p WHERE p.userId = @userId",
        parameters: [
          { name: "@userId", value: user.identifier }
        ]
      }, { partitionKey: user.identifier })
      .fetchAll()

    return resources
  }

  async write(user: User, plan: EngagementPlan): Promise<EngagementPlan> {
    if (this.container == null) {
      await this.connect()
    }

    if (this.container == null) {
      return Promise.reject("No container has been connected!")
    }

    const storeablePlan = Object.assign(plan, { userId: user.identifier })

    const { resource } = await this.container.items.create(storeablePlan)

    if (!resource) {
      return Promise.reject("Unable to create plan!")
    }

    return resource
  }

  async deleteAll(user: User, learningArea: string): Promise<void> {
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
      .query({
        query: "SELECT * FROM plans WHERE plans.learningArea = @learningArea",
        parameters: [
          { name: "@learningArea", value: learningArea }
        ],
      }, { partitionKey: user.identifier })
      .fetchAll()

    const result = await this.container.items.batch(resources.map((resource) => {
      return {
        operationType: BulkOperationType.Delete,
        partitionKey: `["${user.identifier}"]`,
        id: resource.id
      }
    }), user.identifier)

    console.log("RESULT", JSON.stringify(result))
  }
}