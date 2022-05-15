export function isDebug(): boolean {
  return process.env["DEBUG"] !== undefined
}

export function userIdentifierFor(name: string): string {
  let buff = Buffer.from(name);
  return buff.toString('base64')
}