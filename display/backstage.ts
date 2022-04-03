import { MessageDispatcher } from "./effect"

export const BACKSTAGE_MESSAGE_TYPE = "_backstage"

export interface BackstageMessage<T> {
  type: "_backstage"
  wrapped: T
}

export function backstageMessage<T>(wrapped: T): BackstageMessage<T> {
  return {
    type: BACKSTAGE_MESSAGE_TYPE,
    wrapped
  }
}

export function handleBackstageMessage(dispatch: MessageDispatcher, message: BackstageMessage<any>) {
  fetch("/api/backstage", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(message.wrapped)
  }).then((response) => {
    return response.json()
  }).then((responseMessage) => {
    dispatch(responseMessage)
  })
}