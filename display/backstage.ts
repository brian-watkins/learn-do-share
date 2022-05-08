import { MessageDispatcher } from "./effect"

export const BACKSTAGE_MESSAGE_TYPE = "_backstage"

export interface BackstageMessage<T> {
  type: typeof BACKSTAGE_MESSAGE_TYPE
  wrapped: T
}

export function backstageMessage<T>(wrapped: T): BackstageMessage<T> {
  return {
    type: BACKSTAGE_MESSAGE_TYPE,
    wrapped
  }
}

export function reloadInitialSTate(): BackstageMessage<any> {
  return {
    type: BACKSTAGE_MESSAGE_TYPE,
    wrapped: { type: "_backstage-reload-initial-state" }
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