import { MessageDispatcher } from "./effect"

export const BACKSTAGE_MESSAGE_TYPE = "_backstage"

export class BackstageMessage<T> {
  type: "_backstage" = BACKSTAGE_MESSAGE_TYPE
  constructor(public wrapped: T) { }
}

export function handleBackstageMessage(dispatch: MessageDispatcher, message: any) {
  fetch("/api/backstage", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(message)
  }).then((response) => {
    return response.json()
  }).then((responseMessage) => {
    dispatch(responseMessage)
  })
}