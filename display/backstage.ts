import { MessageDispatcher } from "./effect"


export function handleBackstageMessage(dispatch: MessageDispatcher, _: any, message: any) {
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