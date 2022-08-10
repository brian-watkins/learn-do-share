import { User } from "../common/user"

export type MessageHandler<T> = (user: User | null, message: T) => Promise<any>

export interface Backstage<T> {
  messageHandler: MessageHandler<T>
}

export function sendBackstage(dispatch: (message: any) => void, _: any, message: any) {
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