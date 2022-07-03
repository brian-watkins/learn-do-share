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

  private async container(containerName: string): Promise<Container> {
    this.database = this.client.database(this.config.database)
    return this.database?.container(containerName)
  }

  async execute<T>(containerName: string, handler: (container: Container) => Promise<T>): Promise<T> {
    const container = await this.container(containerName)
    return handler(container)
  }
}