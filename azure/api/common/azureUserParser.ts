import { Context } from "@azure/functions"
import { User } from "./user.js"

export interface Request {
  headers: { [name: string]: string }
}

export function azureUserParser(req: Request, context?: Context): User | null {
  const header = req.headers['x-ms-client-principal']

  if (!header) {
    return null
  }

  const buffer = Buffer.from(header, 'base64')
  const principal = JSON.parse(buffer.toString('ascii'))

  context?.log("Principal", principal)

  return {
    identifier: principal.userId,
    name: principal.userDetails
  }
}