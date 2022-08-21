import { User } from "../common/user"
import { errorResult, okResult, Result } from "../../../src/util/result"

export type MessageHandler<T> = (user: User | null, message: T) => Promise<any>

export interface Backstage<T> {
  messageHandler: MessageHandler<T>
}

export enum BackstageError {
  "Failure"
}

export function getBackstageResult<T>(message: { type: string }): Promise<Result<T, BackstageError>> {
  return fetch("/api/backstage", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(message)
  }).then(async (response): Promise<Result<T, BackstageError>> => {
    if (response.ok) {
      return okResult(await response.json())
    } else {
      return errorResult(BackstageError.Failure)
    }
  })
}

export function sendBackstage<T extends { type: string }, M extends { type: string }>(message: M): Promise<T> {
  return fetch("/api/backstage", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(message)
  }).then((response) => {
    console.log("Response status", response.ok, response.status)
    if (response.ok) {
      return response.json()
    } else {
      return { type: "backstage-failure" }
    }
  })
}