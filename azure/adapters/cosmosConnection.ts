import { Container, CosmosClient, CosmosClientOptions, Database } from "@azure/cosmos";

export interface CosmosConfig extends CosmosClientOptions {
  endpoint: string
  key: string,
  database: string,
}

export class CosmosConnection {
  private client: CosmosClient
  public database: Database | null = null

  constructor(private config: CosmosConfig) {
    this.client = new CosmosClient(config)
  }

  private container(containerName: string): Container {
    const database = this.client.database(this.config.database)
    return database.container(containerName)
  }

  async execute<T>(containerName: string, handler: (container: Container) => Promise<T>): Promise<T> {
    return handler(this.container(containerName))
  }

  async createContainer(containerName: string): Promise<Container> {
    const database = this.client.database(this.config.database)
    const { container } = await database.containers.create({ id: containerName, partitionKey: "/userId" });
    return container
  }

  async deleteContainer(containerName: string): Promise<void> {
    const database = this.client.database(this.config.database)
    await database.container(containerName).delete()
  }
}