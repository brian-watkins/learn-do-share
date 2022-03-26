import { Adapters, registry } from './requests.js'

export function createMessageHandler(adapters: Adapters): (message: any) => Promise<any> {
  const messageRegistry = registry(adapters)

  return (message) => {
    const handler = messageRegistry[message.type]
    return handler(message)
  }
}