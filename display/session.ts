import { MessageDispatcher } from "./effect"

export const SESSION_MESSAGE_TYPE = "session-property"

export interface SessionMessage {
  type: "session-property"
  slice: any
}

export function storeForSession(slice: any): SessionMessage {
  return {
    type: SESSION_MESSAGE_TYPE,
    slice
  }
}

// Ultimately probably want this to be a concern of the app, not the framework?
export function handleSessionMessage(dispatch: MessageDispatcher, message: SessionMessage) {
  window.sessionStorage.setItem("__display_session_state", JSON.stringify(message))
}