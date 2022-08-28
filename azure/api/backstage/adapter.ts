import { User } from "../common/user"
import { errorResult, okResult, Result } from "../../../src/util/result"

export type MessageHandler<T> = (user: User | null, message: T) => Promise<any>

export interface Backstage<T> {
  messageHandler: MessageHandler<T>
}

export enum BackstageError {
  "Failure",
  "NetworkError"
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
  }).catch(() => {
    return errorResult(BackstageError.NetworkError)
  })
}
