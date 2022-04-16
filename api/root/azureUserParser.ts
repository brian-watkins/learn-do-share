
export interface Request {
  headers: { [name: string]: string }
}

export function azureUserParser(req: Request): string | null {
  const header = req.headers['x-ms-client-principal']

  if (!header) {
    return null
  }

  const buffer = Buffer.from(header, 'base64')
  const principal = JSON.parse(buffer.toString('ascii'))

  return principal.userDetails
}