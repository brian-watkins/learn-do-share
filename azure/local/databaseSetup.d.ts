export interface DatabaseOptions {
  endpoint: string,
  databaseName: string
}

export function createTestDatabase(options: DatabaseOptions): Promise<void>
